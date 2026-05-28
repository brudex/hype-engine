const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { publishPostToAccounts } = require('./lib/publish-post-accounts');
const { getPostPublishIncludes } = require('./lib/post-publish-includes');
const {
    RECURRING_DAILY,
    RECURRING_WEEKLY,
    isRecurringDueNow
} = require('./lib/recurring-schedule');

const schedule = '* * * * *'; // every minute (matches recurringTime to the minute, UTC)

/**
 * After publish: keep series active for the next occurrence.
 */
async function finalizeRecurringPost(post, accountResults) {
    const allSucceeded = accountResults.every((r) => r.success);
    const anySucceeded = accountResults.some((r) => r.success);

    if (allSucceeded || anySucceeded) {
        post.status = 1; // SCHEDULED — series stays active
        post.scheduleStatus = 0; // PENDING
        post.publishedAt = new Date();
        await post.save();
        if (!allSucceeded) {
            logger.warn(`Recurring post ${post.uuid} published partially - some accounts failed`);
        } else {
            logger.info(`Recurring post ${post.uuid} published successfully to all accounts`);
        }
        return { success: true, partial: !allSucceeded };
    }

    post.status = 3; // FAILED — stop series on total failure
    post.scheduleStatus = 2; // PROCESSED
    await post.save();
    logger.error(`Recurring post ${post.uuid} failed to publish to all accounts`);
    return { success: false, partial: false };
}

/**
 * Publishes daily/weekly recurring posts when recurringTime matches (UTC).
 */
async function publishRecurringPosts() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;
        const now = new Date();

        async.waterfall([
            function (callback) {
                logger.info('Fetching recurring posts...');

                db.Post.findAll({
                    where: {
                        status: 1, // SCHEDULED
                        scheduleStatus: 0, // PENDING
                        recurringType: { [Op.in]: [RECURRING_DAILY, RECURRING_WEEKLY] },
                        recurringTime: { [Op.ne]: null },
                        [Op.or]: [
                            { recurringEndAt: null },
                            { recurringEndAt: { [Op.gte]: now } }
                        ]
                    },
                    include: getPostPublishIncludes()
                })
                    .then((posts) => {
                        const due = posts.filter((post) => isRecurringDueNow(post, now));
                        logger.info(`Found ${due.length} recurring posts due now (${posts.length} candidates)`);
                        callback(null, due);
                    })
                    .catch((error) => {
                        logger.error('Error fetching recurring posts:', error);
                        callback(error);
                    });
            },

            function (posts, callback) {
                if (posts.length === 0) {
                    logger.info('No recurring posts due now');
                    return callback(null, null, []);
                }

                db.JobBatch.create({
                    name: 'Publish Recurring Posts',
                    totalJobs: posts.length,
                    pendingJobs: posts.length,
                    failedJobs: 0,
                    options: {
                        type: 'publish-recurring',
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
                if (!batch || !Array.isArray(posts) || posts.length === 0) {
                    return callback(null, batch, { processed: 0, successful: 0, failed: 0, skipped: 0 });
                }

                const results = { processed: 0, successful: 0, failed: 0, skipped: 0 };
                const failedJobIds = [];

                async.eachSeries(posts, (post, postCallback) => {
                    (async () => {
                        try {
                            if (!post || typeof post.save !== 'function') {
                                throw new Error('Invalid post instance in publish recurring batch');
                            }

                            post.scheduleStatus = 1; // PROCESSING
                            await post.save();

                            logger.info(`Processing recurring post ${post.uuid}`, {
                                recurringType: post.recurringType,
                                recurringTime: post.recurringTime,
                                recurringDays: post.recurringDays
                            });

                            const accountResults = await publishPostToAccounts(post);
                            const outcome = await finalizeRecurringPost(post, accountResults);

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
                            const postUuid = post && post.uuid ? post.uuid : 'unknown';
                            logger.error(`Error processing recurring post ${postUuid}:`, error);

                            try {
                                if (post && typeof post.save === 'function') {
                                    post.status = 3;
                                    post.scheduleStatus = 2;
                                    await post.save();
                                }
                            } catch (saveError) {
                                logger.error(`Error saving failed recurring post ${postUuid}:`, saveError);
                            }

                            results.failed++;
                            if (post && post.uuid) {
                                failedJobIds.push(post.uuid);
                            }
                            results.processed++;

                            if (batch) {
                                batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                                batch.failedJobs = failedJobIds.length;
                                batch.failedJobIds = failedJobIds;
                                await batch.save();
                            }

                            postCallback();
                        }
                    })().catch((err) => postCallback(err));
                }, async (error) => {
                    if (error) {
                        if (jobBatch) {
                            jobBatch.cancelledAt = new Date();
                            await jobBatch.save().catch(() => {});
                        }
                        return callback(error);
                    }

                    if (jobBatch) {
                        jobBatch.finishedAt = new Date();
                        jobBatch.pendingJobs = 0;
                        jobBatch.failedJobs = failedJobIds.length;
                        jobBatch.failedJobIds = failedJobIds;
                        await jobBatch.save();
                    }

                    callback(null, jobBatch, results);
                });
            }
        ], (error, batch, results) => {
            if (error) {
                logger.error('Error in publish recurring posts waterfall:', error);
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.save().catch(() => {});
                }
                return reject(error);
            }

            resolve({ batch, results: results || { processed: 0, successful: 0, failed: 0, skipped: 0 } });
        });
    });
}

async function run() {
    logger.info('Publish recurring posts started');
    const result = await publishRecurringPosts();
    logger.info('Publish recurring posts finished', {
        batchUuid: result.batch?.uuid ?? null,
        results: result.results
    });
    return result;
}

module.exports = {
    schedule,
    run
};
