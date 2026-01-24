const cron = require('node-cron');
const logger = require('../utils/logger');
const scheduleDuePosts = require('./schedule-due-posts');
const publishScheduledPosts = require('./publish-scheduled');
const cleanupLogs = require('./cleanup-logs');

// Module-level state
let isPublishing = false; // Flag to prevent concurrent publish operations
let isScheduling = false; // Flag to prevent concurrent schedule operations
let isCleaning = false; // Flag to prevent concurrent cleanup operations

/**
 * Schedule due posts job - Run every 3 minutes
 */
function startScheduleDuePostsJob() {
    logger.info('Starting schedule due posts cron job (every 3 minutes)...');
    
    cron.schedule('*/3 * * * *', async () => {
        // Check if another schedule operation is already running
        if (isScheduling) {
            logger.warn('Cron: Schedule due posts already running, skipping...');
            return;
        }

        try {
            isScheduling = true;
            logger.info('Cron: Running schedule due posts job...');
            const result = await scheduleDuePosts();
            logger.info('Cron: Schedule due posts completed', result);
        } catch (error) {
            logger.error('Cron: Schedule due posts error:', error);
        } finally {
            isScheduling = false;
        }
    }, {
        scheduled: true,
        timezone: 'Etc/UTC'
    });
    
    logger.info('Schedule due posts cron job started');
}

/**
 * Publish scheduled posts job - Run every 1 minute (skip if already running)
 */
function startPublishScheduledJob() {
    logger.info('Starting publish scheduled posts cron job (every 1 minute)...');
    
    cron.schedule('* * * * *', async () => {
        // Check if another publish operation is already running
        if (isPublishing) {
            logger.warn('Cron: Publish scheduled posts already running, skipping...');
            return;
        }

        try {
            isPublishing = true;
            logger.info('Cron: Running publish scheduled posts job...');
            const result = await publishScheduledPosts();
            logger.info('Cron: Publish scheduled posts completed', result);
        } catch (error) {
            logger.error('Cron: Publish scheduled posts error:', error);
        } finally {
            isPublishing = false;
        }
    }, {
        scheduled: true,
        timezone: 'Etc/UTC'
    });
    
    logger.info('Publish scheduled posts cron job started');
}

/**
 * Cleanup logs job - Run once a day at 12:00 AM (midnight)
 */
function startCleanupLogsJob() {
    logger.info('Starting cleanup logs cron job (daily at 12:00 AM)...');
    
    cron.schedule('0 0 * * *', async () => {
        // Check if another cleanup operation is already running
        if (isCleaning) {
            logger.warn('Cron: Cleanup logs already running, skipping...');
            return;
        }

        try {
            isCleaning = true;
            logger.info('Cron: Running cleanup logs job...');
            const result = await cleanupLogs();
            logger.info('Cron: Cleanup logs completed', result);
        } catch (error) {
            logger.error('Cron: Cleanup logs error:', error);
        } finally {
            isCleaning = false;
        }
    }, {
        scheduled: true,
        timezone: 'Etc/UTC'
    });
    
    logger.info('Cleanup logs cron job started');
}

// Auto-start all cron jobs when this file is required
logger.info('Initializing cron server...');
setTimeout(() => {
    startScheduleDuePostsJob();
    startPublishScheduledJob();
    startCleanupLogsJob();

    logger.info('Cron server initialized with all scheduled jobs');
    logger.info('Cron Schedule Information:');
    logger.info('  - Schedule Due Posts: Every 3 minutes (*/3 * * * *)');
    logger.info('  - Publish Scheduled Posts: Every 1 minute (* * * * *)');
    logger.info('  - Cleanup Logs: Daily at 12:00 AM (0 0 * * *)');
}, 10000);


