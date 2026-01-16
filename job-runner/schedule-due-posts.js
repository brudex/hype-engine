const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Schedule Due Posts Job Runner
 * Checks posts where scheduledAt time has passed and marks them as SCHEDULED
 * Uses async waterfall to process due posts
 * Tracks batch progress using JobBatch model
 * This prepares posts for the publish-scheduled job runner
 */
async function scheduleDuePosts() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;
        
        async.waterfall([
            // Step 1: Create job batch
            function(callback) {
                logger.info('Creating job batch for scheduling due posts...');
                
                db.JobBatch.create({
                    name: 'Schedule Due Posts',
                    totalJobs: 0,
                    pendingJobs: 0,
                    failedJobs: 0,
                    options: {
                        type: 'schedule-due-posts',
                        startedAt: new Date()
                    }
                })
                .then(batch => {
                    jobBatch = batch;
                    logger.info(`Job batch created: ${batch.uuid}`);
                    callback(null, batch);
                })
                .catch(error => {
                    logger.error('Error creating job batch:', error);
                    callback(error);
                });
            },
            
            // Step 2: Select all due posts (scheduledAt <= now, status=0)
            function(batch, callback) {
                logger.info('Fetching due posts...');
                const now = new Date();
                
                db.Post.findAll({
                    where: {
                        scheduledAt: {
                            [Op.lte]: now, // scheduledAt is less than or equal to now (time has passed)
                            [Op.ne]: null  // scheduledAt is not null
                        },
                        status: 0 // DRAFT - only schedule posts that are still in draft
                    }
                })
                .then(posts => {
                    logger.info(`Found ${posts.length} posts with due scheduledAt times`);
                    
                    // Update batch with total jobs count
                    batch.totalJobs = posts.length;
                    batch.pendingJobs = posts.length;
                    return batch.save().then(() => {
                        callback(null, batch, posts);
                    });
                })
                .catch(error => {
                    logger.error('Error fetching due posts:', error);
                    callback(error);
                });
            },
            
            // Step 3: Process each post
            function(batch, posts, callback) {
                if (posts.length === 0) {
                    logger.info('No due posts to schedule');
                    // Mark batch as finished
                    batch.finishedAt = new Date();
                    batch.pendingJobs = 0;
                    return batch.save().then(() => {
                        return callback(null, batch, { checked: 0, scheduled: 0 });
                    });
                }
                
                const results = {
                    checked: posts.length,
                    scheduled: 0
                };
                const failedJobIds = [];
                
                // Process posts sequentially
                async.eachSeries(posts, (post, postCallback) => {
                    // Use async IIFE to handle async/await
                    (async () => {
                        try {
                            logger.info(`Processing post ${post.uuid} (scheduledAt: ${post.scheduledAt})`);
                            
                            // Verify the post has accounts before scheduling
                            const accountCount = await db.PostAccount.count({
                                where: {
                                    postUuid: post.uuid
                                }
                            });
                            
                            if (accountCount === 0) {
                                logger.warn(`Post ${post.uuid} has no accounts, skipping scheduling`);
                                // Update batch progress even for skipped posts
                                batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                                await batch.save();
                                postCallback();
                                return;
                            }
                            
                            // Mark as SCHEDULED and PENDING
                            post.status = 1; // SCHEDULED
                            post.scheduleStatus = 0; // PENDING
                            await post.save();
                            
                            results.scheduled++;
                            logger.info(`Post ${post.uuid} marked as SCHEDULED (scheduledAt: ${post.scheduledAt})`);
                            
                            // Update batch progress
                            batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                            await batch.save();
                            
                            postCallback();
                            
                        } catch (error) {
                            logger.error(`Error scheduling post ${post.uuid}:`, error);
                            
                            // Track failed post
                            failedJobIds.push(post.uuid);
                            
                            // Update batch progress
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
                        // Mark batch as failed
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
                    
                    // Mark batch as finished
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
                // Ensure batch is marked as cancelled if error occurred
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.save().catch(err => {
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

module.exports = scheduleDuePosts;
