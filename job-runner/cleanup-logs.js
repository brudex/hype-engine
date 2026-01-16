const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Cleanup Logs Job Runner
 * Deletes logs older than 3 days from the database
 * Uses async waterfall to process log cleanup
 * Tracks batch progress using JobBatch model
 */
async function cleanupLogs() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;
        
        async.waterfall([
            // Step 1: Create job batch
            function(callback) {
                logger.info('Creating job batch for log cleanup...');
                
                db.JobBatch.create({
                    name: 'Cleanup Old Logs',
                    totalJobs: 1, // This is a single cleanup operation
                    pendingJobs: 1,
                    failedJobs: 0,
                    options: {
                        type: 'cleanup-logs',
                        startedAt: new Date(),
                        daysToKeep: 3
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
            
            // Step 2: Count logs to be deleted
            function(batch, callback) {
                logger.info('Counting logs to be deleted...');
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 3); // 3 days ago
                
                db.Log.count({
                    where: {
                        createdAt: {
                            [Op.lt]: cutoffDate
                        }
                    }
                })
                .then(count => {
                    logger.info(`Found ${count} logs older than 3 days`);
                    callback(null, batch, count);
                })
                .catch(error => {
                    logger.error('Error counting logs:', error);
                    callback(error);
                });
            },
            
            // Step 3: Delete old logs
            function(batch, logCount, callback) {
                if (logCount === 0) {
                    logger.info('No logs to cleanup');
                    // Mark batch as finished
                    batch.finishedAt = new Date();
                    batch.pendingJobs = 0;
                    return batch.save().then(() => {
                        return callback(null, batch, { deleted: 0 });
                    });
                }
                
                logger.info(`Deleting ${logCount} logs older than 3 days...`);
                
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 3);
                
                // Use the cleanup method from Log model
                db.Log.cleanup(3)
                .then(deletedCount => {
                    logger.info(`Successfully deleted ${deletedCount} logs`);
                    
                    // Mark batch as finished
                    batch.finishedAt = new Date();
                    batch.pendingJobs = 0;
                    return batch.save().then(() => {
                        callback(null, batch, { deleted: deletedCount });
                    });
                })
                .catch(error => {
                    logger.error('Error deleting logs:', error);
                    
                    // Mark batch as failed
                    batch.failedJobs = 1;
                    batch.failedJobIds = ['cleanup-logs-error'];
                    batch.finishedAt = new Date();
                    batch.pendingJobs = 0;
                    
                    return batch.save().then(() => {
                        callback(error);
                    });
                });
            }
        ], (error, batch, results) => {
            if (error) {
                logger.error('Error in cleanup logs waterfall:', error);
                // Ensure batch is marked as cancelled if error occurred
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.failedJobs = 1;
                    jobBatch.pendingJobs = 0;
                    jobBatch.save().catch(err => {
                        logger.error('Error marking batch as cancelled:', err);
                    });
                }
                return reject(error);
            }
            
            logger.info('Cleanup logs completed:', {
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

module.exports = cleanupLogs;
