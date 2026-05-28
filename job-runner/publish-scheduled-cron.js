const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { publishPostToAccounts } = require('./lib/publish-post-accounts');
const { RECURRING_ONE_TIME } = require('./lib/recurring-schedule');

const schedule = '* * * * *'; // every minute

const postIncludes = [
    {
        model: db.Account,
        as: 'accounts',
        through: { attributes: [] },
        required: true
    },
    {
        model: db.PostVersion,
        as: 'versions'
    },
    {
        model: db.Tag,
        as: 'tags',
        through: { attributes: [] }
    }
];

/**
 * After publish: one-time post is complete.
 */
async function finalizeOneTimePost(post, accountResults) {
    const allSucceeded = accountResults.every((r) => r.success);
    const anySucceeded = accountResults.some((r) => r.success);

    if (allSucceeded) {
        post.status = 2;
        post.publishedAt = new Date();
        post.scheduleStatus = 2;
        await post.save();
        logger.info(`Post ${post.uuid} published successfully to all accounts`);
        return { success: true };
    }
    if (anySucceeded) {
        post.status = 2;
        post.publishedAt = new Date();
        post.scheduleStatus = 2;
        await post.save();
        logger.warn(`Post ${post.uuid} published partially - some accounts failed`);
        return { success: true };
    }

    post.status = 3;
    post.scheduleStatus = 2;
    await post.save();
    logger.error(`Post ${post.uuid} failed to publish to all accounts`);
    return { success: false };
}

/**
 * Publishes scheduled one-time posts (status=SCHEDULED, scheduleStatus=PENDING).
 */
async function publishScheduledPosts() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;

        async.waterfall([
            function (callback) {
                logger.info('Fetching scheduled posts...');
                const now = new Date();
                db.Post.findAll({
                    where: {
                        status: 1,
                        scheduleStatus: 0,
                        recurringType: RECURRING_ONE_TIME,
                        [Op.or]: [
                            { scheduledAt: null },
                            { scheduledAt: { [Op.lte]: now } }
                        ]
                    },
                    include: postIncludes
                })
                    .then((posts) => {
                        logger.info(`Found ${posts.length} scheduled posts to process`);
                        callback(null, posts);
                    })
                    .catch((error) => {
                        logger.error('Error fetching scheduled posts:', error);
                        callback(error);
                    });
            },

            function (posts, callback) {
                if (posts.length === 0) {
                    logger.info('No scheduled posts to process');
                    return callback(null, null, []);
                }
                logger.info('Creating job batch for scheduled posts...');
                db.JobBatch.create({
                    name: 'Publish Scheduled Posts',
                    totalJobs: posts.length,
                    pendingJobs: posts.length,
                    failedJobs: 0,
                    options: {
                        type: 'publish-scheduled',
                        startedAt: new Date()
                    }
                })
                    .then((batch) => {
                        jobBatch = batch;
                        logger.info(`Job batch created: ${batch.uuid}`);
                        callback(null, batch, posts);
                    })
                    .catch((error) => {
                        logger.error('Error creating job batch:', error);
                        callback(error);
                    });
            },

            function (batch, posts, callback) {
                if (!batch || posts.length === 0) {
                    return callback(null, batch, { processed: 0, successful: 0, failed: 0 });
                }

                const results = { processed: 0, successful: 0, failed: 0 };
                const failedJobIds = [];

                async.eachSeries(posts, (post, postCallback) => {
                    (async () => {
                        try {
                            post.scheduleStatus = 1;
                            await post.save();

                            logger.info(`Processing post ${post.uuid}`);

                            const accountResults = await publishPostToAccounts(post);
                            const outcome = await finalizeOneTimePost(post, accountResults);

                            if (outcome.success) {
                                results.successful++;
                            } else {
                                results.failed++;
                                failedJobIds.push(post.uuid);
                            }

                            batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                            if (failedJobIds.length > 0) {
                                batch.failedJobs = failedJobIds.length;
                                batch.failedJobIds = failedJobIds;
                            }
                            await batch.save();

                            results.processed++;
                            postCallback();
                        } catch (error) {
                            logger.error(`Error processing post ${post.uuid}:`, error);

                            try {
                                post.status = 3;
                                post.scheduleStatus = 2;
                                await post.save();
                            } catch (saveError) {
                                logger.error(`Error saving failed post ${post.uuid}:`, saveError);
                            }

                            results.failed++;
                            failedJobIds.push(post.uuid);
                            results.processed++;

                            batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                            batch.failedJobs = results.failed;
                            batch.failedJobIds = failedJobIds;
                            await batch.save();

                            postCallback();
                        }
                    })();
                }, async (error) => {
                    if (error) {
                        logger.error('Error in post processing loop:', error);
                        if (jobBatch) {
                            try {
                                jobBatch.cancelledAt = new Date();
                                await jobBatch.save();
                            } catch (batchError) {
                                logger.error('Error updating batch on error:', batchError);
                            }
                        }
                        return callback(error);
                    }

                    if (jobBatch) {
                        try {
                            jobBatch.finishedAt = new Date();
                            jobBatch.pendingJobs = 0;
                            jobBatch.failedJobs = results.failed;
                            jobBatch.failedJobIds = failedJobIds;
                            await jobBatch.save();
                            logger.info(`Job batch ${jobBatch.uuid} completed`);
                        } catch (batchError) {
                            logger.error('Error finalizing batch:', batchError);
                        }
                    }

                    callback(null, jobBatch, results);
                });
            }
        ], (error, batch, results) => {
            if (error) {
                logger.error('Error in publish scheduled posts waterfall:', error);
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.save().catch((err) => {
                        logger.error('Error marking batch as cancelled:', err);
                    });
                }
                return reject(error);
            }

            logger.info('Publish scheduled posts completed:', {
                batchUuid: batch ? batch.uuid : null,
                results: results
            });
            resolve({
                batch: batch,
                results: results
            });
        });
    });
}

async function run() {
    logger.info('Publish scheduled posts started');
    const result = await publishScheduledPosts();
    logger.info('Publish scheduled posts finished', {
        batchUuid: result.batch?.uuid ?? null,
        results: result.results
    });
    return result;
}

module.exports = {
    schedule,
    run
};
