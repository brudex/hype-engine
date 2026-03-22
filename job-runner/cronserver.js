const cron = require('node-cron');
const logger = require('../utils/logger');
const scheduleDuePosts = require('./schedule-due-posts');
const publishScheduledPosts = require('./publish-scheduled');
const cleanupLogs = require('./cleanup-logs');
const refreshLinkedInTokens = require('./refresh-linkedin-tokens');
const terminateIdlePgSessions = require('./terminate-idle-pg-sessions');

// Module-level state
let isPublishing = false; // Flag to prevent concurrent publish operations
let isScheduling = false; // Flag to prevent concurrent schedule operations
let isCleaning = false; // Flag to prevent concurrent cleanup operations
let isRefreshingLinkedIn = false; // Flag to prevent concurrent LinkedIn token refresh
let isTerminatingIdlePg = false; // Flag to prevent concurrent idle PG session cleanup

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
            logger.info('Cron: Schedule due posts completed', {
                batchUuid: result.batch?.uuid ?? null,
                results: result.results
            });
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
            logger.info('Cron: Publish scheduled posts completed', {
                batchUuid: result.batch?.uuid ?? null,
                results: result.results
            });
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
 * Refresh LinkedIn tokens job - Run once a day at 2:00 AM UTC (tokens expiring within 7 days are refreshed)
 */
function startRefreshLinkedInTokensJob() {
    logger.info('Starting refresh LinkedIn tokens cron job (daily at 2:00 AM UTC)...');

    cron.schedule('0 2 * * *', async () => {
        if (isRefreshingLinkedIn) {
            logger.warn('Cron: Refresh LinkedIn tokens already running, skipping...');
            return;
        }
        try {
            isRefreshingLinkedIn = true;
            logger.info('Cron: Running refresh LinkedIn tokens job...');
            const result = await refreshLinkedInTokens();
            logger.info('Cron: Refresh LinkedIn tokens completed', result);
        } catch (error) {
            logger.error('Cron: Refresh LinkedIn tokens error:', error);
        } finally {
            isRefreshingLinkedIn = false;
        }
    }, {
        scheduled: true,
        timezone: 'Etc/UTC'
    });

    logger.info('Refresh LinkedIn tokens cron job started');
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

/**
 * Terminate idle PostgreSQL sessions for the app database - Run every 30 minutes
 */
function startTerminateIdlePgSessionsJob() {
    logger.info('Starting terminate idle PostgreSQL sessions cron job (every 30 minutes)...');

    cron.schedule('*/30 * * * *', async () => {
        if (isTerminatingIdlePg) {
            logger.warn('Cron: Terminate idle PG sessions already running, skipping...');
            return;
        }
        try {
            isTerminatingIdlePg = true;
            logger.info('Cron: Running terminate idle PostgreSQL sessions job...');
            const result = await terminateIdlePgSessions();
            logger.info('Cron: Terminate idle PostgreSQL sessions completed', result);
        } catch (error) {
            logger.error('Cron: Terminate idle PostgreSQL sessions error:', error);
        } finally {
            isTerminatingIdlePg = false;
        }
    }, {
        scheduled: true,
        timezone: 'Etc/UTC'
    });

    logger.info('Terminate idle PostgreSQL sessions cron job started');
}

// Auto-start all cron jobs when this file is required
logger.info('Initializing cron server...');
setTimeout(() => {
    startScheduleDuePostsJob();
    startPublishScheduledJob();
    startRefreshLinkedInTokensJob();
    startCleanupLogsJob();
    startTerminateIdlePgSessionsJob();

    logger.info('Cron server initialized with all scheduled jobs');
    logger.info('Cron Schedule Information:');
    logger.info('  - Schedule Due Posts: Every 3 minutes (*/3 * * * *)');
    logger.info('  - Publish Scheduled Posts: Every 1 minute (* * * * *)');
    logger.info('  - Refresh LinkedIn Tokens: Daily at 2:00 AM UTC (0 2 * * *)');
    logger.info('  - Cleanup Logs: Daily at 12:00 AM (0 0 * * *)');
    logger.info('  - Terminate Idle PG Sessions: Every 30 minutes (*/30 * * * *)');
}, 10000);


