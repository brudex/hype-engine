const async = require('async');
const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const schedule = '0 0 * * *'; // daily at midnight UTC

/**
 * Deletes logs older than 3 days from the database.
 */
async function cleanupLogs() {
    return new Promise((resolve, reject) => {
        let jobBatch = null;

        async.waterfall([
            function (callback) {
                logger.info('Creating job batch for log cleanup...');

                db.JobBatch.create({
                    name: 'Cleanup Old Logs',
                    totalJobs: 1,
                    pendingJobs: 1,
                    failedJobs: 0,
                    options: {
                        type: 'cleanup-logs',
                        startedAt: new Date(),
                        daysToKeep: 3
                    }
                })
                    .then((batch) => {
                        jobBatch = batch;
                        logger.info(`Job batch created: ${batch.uuid}`);
                        callback(null, batch);
                    })
                    .catch((error) => {
                        logger.error('Error creating job batch:', error);
                        callback(error);
                    });
            },

            function (batch, callback) {
                logger.info('Counting logs to be deleted...');
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 3);

                db.Log.count({
                    where: {
                        createdAt: {
                            [Op.lt]: cutoffDate
                        }
                    }
                })
                    .then((count) => {
                        logger.info(`Found ${count} logs older than 3 days`);
                        callback(null, batch, count);
                    })
                    .catch((error) => {
                        logger.error('Error counting logs:', error);
                        callback(error);
                    });
            },

            function (batch, logCount, callback) {
                if (logCount === 0) {
                    logger.info('No logs to cleanup');
                    batch.finishedAt = new Date();
                    batch.pendingJobs = 0;
                    return batch.save().then(() => {
                        callback(null, batch, { deleted: 0 });
                    });
                }

                logger.info(`Deleting ${logCount} logs older than 3 days...`);

                db.Log.cleanup(3)
                    .then((deletedCount) => {
                        logger.info(`Successfully deleted ${deletedCount} logs`);

                        batch.finishedAt = new Date();
                        batch.pendingJobs = 0;
                        return batch.save().then(() => {
                            callback(null, batch, { deleted: deletedCount });
                        });
                    })
                    .catch((error) => {
                        logger.error('Error deleting logs:', error);

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
                if (jobBatch && !jobBatch.finishedAt && !jobBatch.cancelledAt) {
                    jobBatch.cancelledAt = new Date();
                    jobBatch.failedJobs = 1;
                    jobBatch.pendingJobs = 0;
                    jobBatch.save().catch((err) => {
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

async function run() {
    logger.info('Cleanup logs started');
    const result = await cleanupLogs();
    logger.info('Cleanup logs finished', {
        batchUuid: result.batch?.uuid ?? null,
        results: result.results
    });
    return result;
}

module.exports = {
    schedule,
    run
};
