const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const PlatformServiceFactory = require('../services/platform');

/**
 * Publish Scheduled Posts Job Runner
 * Uses async waterfall to process scheduled posts
 * Tracks batch progress using JobBatch model
 */
async function publishScheduledPosts() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;
        
        async.waterfall([
            // Step 1: Fetch scheduled posts (status=1, scheduleStatus=0)
            function(callback) {
                logger.info('Fetching scheduled posts...');
                const now = new Date();
                db.Post.findAll({
                    where: {
                        status: 1, // SCHEDULED
                        scheduleStatus: 0, // PENDING,
                        [Op.or]: [
                            { scheduledAt: null },
                            { scheduledAt: { [Op.lte]: now } }
                        ],
                    },
                    include: [
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
                    ]
                })
                .then(posts => {
                    logger.info(`Found ${posts.length} scheduled posts to process`);
                    callback(null, posts);
                })
                .catch(error => {
                    logger.error('Error fetching scheduled posts:', error);
                    callback(error);
                });
            },
            
            // Step 2: Create job batch only if there are posts to process
            function(posts, callback) {
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
                .then(batch => {
                    jobBatch = batch;
                    logger.info(`Job batch created: ${batch.uuid}`);
                    callback(null, batch, posts);
                })
                .catch(error => {
                    logger.error('Error creating job batch:', error);
                    callback(error);
                });
            },
            
            // Step 3: Process each post
            function(batch, posts, callback) {
                if (!batch || posts.length === 0) {
                    return callback(null, batch, { processed: 0, successful: 0, failed: 0 });
                }
                
                const results = {
                    processed: 0,
                    successful: 0,
                    failed: 0
                };
                const failedJobIds = [];
                
                // Process posts sequentially
                async.eachSeries(posts, (post, postCallback) => {
                    // Use async IIFE to handle async/await
                    (async () => {
                        try {
                            // Mark post as processing
                            post.scheduleStatus = 1; // PROCESSING
                            await post.save();
                            
                            logger.info(`Processing post ${post.uuid}`);
                            
                            // Get post versions or original version
                            let postVersions = post.versions || [];
                            
                            // If no versions, try to get original version
                            if (postVersions.length === 0) {
                                postVersions = await db.PostVersion.findAll({
                                    where: {
                                        postUuid: post.uuid,
                                        isOriginal: true
                                    }
                                });
                            }
                            
                            if (postVersions.length === 0) {
                                throw new Error('No post versions found');
                            }
                            
                            // Publish to each account
                            const accountResults = [];
                            for (const account of post.accounts) {
                                try {
                                    // Find version for this account, or use first available
                                    let postVersion = postVersions.find(v => v.accountUuid === account.uuid);
                                    if (!postVersion) {
                                        postVersion = postVersions.find(v => v.isOriginal === true) || postVersions[0];
                                    }
                                    
                                    if (!postVersion) {
                                        throw new Error(`No version found for account ${account.uuid}`);
                                    }
                                    
                                    // Get platform service
                                    const platformService = PlatformServiceFactory.getService(account.provider);
                                    
                                    if (!platformService || !platformService.publishPost) {
                                        throw new Error(`Publish not implemented for platform: ${account.provider}`);
                                    }
                                    
                                    // Publish post
                                    const publishResult = await platformService.publishPost(
                                        post,
                                        postVersion,
                                        post.tags || [],
                                        account
                                    );
                                    
                                    accountResults.push({
                                        accountUuid: account.uuid,
                                        success: publishResult.success,
                                        error: publishResult.error,
                                        providerPostId: publishResult.providerPostId
                                    });
                                    
                                    // Update post-account pivot table if successful
                                    if (publishResult.success && publishResult.providerPostId) {
                                        const postAccount = await db.PostAccount.findOne({
                                            where: {
                                                postUuid: post.uuid,
                                                accountUuid: account.uuid
                                            }
                                        });
                                        if (postAccount) {
                                            postAccount.providerPostId = publishResult.providerPostId;
                                            postAccount.errors = null;
                                            postAccount.data = publishResult.data || null;
                                            await postAccount.save();
                                        }
                                    } else if (!publishResult.success) {
                                        // Store errors in pivot table
                                        const postAccount = await db.PostAccount.findOne({
                                            where: {
                                                postUuid: post.uuid,
                                                accountUuid: account.uuid
                                            }
                                        });
                                        if (postAccount) {
                                            postAccount.errors = publishResult.error || 'Unknown error';
                                            await postAccount.save();
                                        }
                                    }
                                    
                                } catch (accountError) {
                                    logger.error(`Error publishing to account ${account.uuid}:`, accountError);
                                    accountResults.push({
                                        accountUuid: account.uuid,
                                        success: false,
                                        error: accountError.message
                                    });
                                    
                                    // Store error in pivot table
                                    const postAccount = await db.PostAccount.findOne({
                                        where: {
                                            postUuid: post.uuid,
                                            accountUuid: account.uuid
                                        }
                                    });
                                    if (postAccount) {
                                        postAccount.errors = accountError.message;
                                        await postAccount.save();
                                    }
                                }
                            }
                            
                            // Check if all accounts succeeded
                            const allSucceeded = accountResults.every(r => r.success);
                            const anySucceeded = accountResults.some(r => r.success);
                            
                            if (allSucceeded) {
                                // All accounts succeeded
                                post.status = 2; // PUBLISHED
                                post.publishedAt = new Date();
                                post.scheduleStatus = 2; // PROCESSED
                                await post.save();
                                results.successful++;
                                logger.info(`Post ${post.uuid} published successfully to all accounts`);
                            } else if (anySucceeded) {
                                // Some succeeded, some failed - mark as published but log partial failure
                                post.status = 2; // PUBLISHED
                                post.publishedAt = new Date();
                                post.scheduleStatus = 2; // PROCESSED
                                await post.save();
                                results.successful++;
                                logger.warn(`Post ${post.uuid} published partially - some accounts failed`);
                            } else {
                                // All failed
                                post.status = 3; // FAILED
                                post.scheduleStatus = 2; // PROCESSED
                                await post.save();
                                results.failed++;
                                failedJobIds.push(post.uuid);
                                logger.error(`Post ${post.uuid} failed to publish to all accounts`);
                            }
                            
                            // Update batch progress
                            batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                            if (results.failed > 0) {
                                batch.failedJobs = results.failed;
                                batch.failedJobIds = failedJobIds;
                            }
                            await batch.save();
                            
                            results.processed++;
                            postCallback();
                            
                        } catch (error) {
                            logger.error(`Error processing post ${post.uuid}:`, error);
                            
                            // Mark post as failed
                            try {
                                post.status = 3; // FAILED
                                post.scheduleStatus = 2; // PROCESSED
                                await post.save();
                            } catch (saveError) {
                                logger.error(`Error saving failed post ${post.uuid}:`, saveError);
                            }
                            
                            results.failed++;
                            failedJobIds.push(post.uuid);
                            results.processed++;
                            
                            // Update batch progress
                            try {
                                batch.pendingJobs = Math.max(0, batch.pendingJobs - 1);
                                batch.failedJobs = results.failed;
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
                // Ensure batch is marked as cancelled if error occurred
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.save().catch(err => {
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

module.exports = publishScheduledPosts;
