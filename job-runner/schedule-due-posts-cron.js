const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const schedule = '*/3 * * * *'; // every 3 minutes

const { RECURRING_ONE_TIME } = require('./lib/recurring-schedule');

/**
 * Checks one-time posts where scheduledAt time has passed and marks them as SCHEDULED.
 */
async function scheduleDuePosts() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;

        async.waterfall([
            function (callback) {
                logger.info('Fetching due posts...');
                const now = new Date();

                db.Post.findAll({
                    where: {
                        [Op.or]: [
                            { scheduledAt: null },
                            { scheduledAt: { [Op.lte]: now } }
                        ],
                        status: 0,
                        recurringType: RECURRING_ONE_TIME
                    }
                })
                    .then((posts) => {
                        logger.info(`Found ${posts.length} posts with due scheduledAt times`);
                        callback(null, posts);
                    })
                    .catch((error) => {
                        logger.error('Error fetching due posts:', error);
                        callback(error);
                    });
            },

            function (posts, callback) {
                if (posts.length === 0) {
                    logger.info('No due posts to schedule');
                    return callback(null, null, []);
                }
                logger.info('Creating job batch for scheduling due posts...');
                db.JobBatch.create({
                    name: 'Schedule Due Posts',
                    totalJobs: posts.length,
                    pendingJobs: posts.length,
                    failedJobs: 0,
                    options: {
                        type: 'schedule-due-posts',
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
                    return callback(null, batch, { checked: 0, scheduled: 0 });
                }

                const results = {
                    checked: posts.length,
                    scheduled: 0
                };
                const failedJobIds = [];

                async.eachSeries(posts, (post, postCallback) => {
                    (async () => {
                        try {
                            logger.info(`Processing post ${post.uuid} (scheduledAt: ${post.scheduledAt})`);

                            const accountCount = await db.PostAccount.count({
                                where: {
                                    postUuid: post.uuid
                                }
                            });

                            if (accountCount === 0) {
                                logger.warn(`Post ${post.uuid} has no accounts, skipping scheduling`);
                                batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                                await batch.save();
                                postCallback();
                                return;
                            }

                            post.status = 1;
                            post.scheduleStatus = 0;
                            await post.save();

                            results.scheduled++;
                            logger.info(`Post ${post.uuid} marked as SCHEDULED (scheduledAt: ${post.scheduledAt})`);

                            batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                            await batch.save();

                            postCallback();
                        } catch (error) {
                            logger.error(`Error scheduling post ${post.uuid}:`, error);

                            failedJobIds.push(post.uuid);

                            try {
                                batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                                batch.failedJobs = failedJobIds.length;
                                batch.failedJobIds = failedJobIds;
                                await batch.save();
                            } catch (batchError) {
                                logger.error('Error updating batch:', batchError);
                            }

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
                            jobBatch.failedJobs = failedJobIds.length;
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
                logger.error('Error in schedule due posts waterfall:', error);
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.save().catch((err) => {
                        logger.error('Error marking batch as cancelled:', err);
                    });
                }
                return reject(error);
            }

            logger.info('Schedule due posts completed:', {
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
    logger.info('Schedule due posts started');
    const result = await scheduleDuePosts();
    logger.info('Schedule due posts finished', {
        batchUuid: result.batch?.uuid ?? null,
        results: result.results
    });
    return result;
}

module.exports = {
    schedule,
    run
};
