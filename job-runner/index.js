const cron = require('node-cron');
const logger = require('../utils/logger');

const scheduleDuePostsCron = require('./schedule-due-posts-cron');
const publishScheduledCron = require('./publish-scheduled-cron');
const publishRecurringCron = require('./publish-recurring-cron');
const refreshLinkedInTokensCron = require('./refresh-linkedin-tokens-cron');
const cleanupLogsCron = require('./cleanup-logs-cron');
const terminateIdlePgSessionsCron = require('./terminate-idle-pg-sessions-cron');

// node-cron v2 / tz-offset requires IANA names (not "UTC")
const CRON_TIMEZONE = 'Etc/UTC';

/**
 * All registered cron jobs ({ name, schedule, run }).
 * Each *-cron.js module exports { schedule, run }.
 */
const registeredCrons = [
    { name: 'schedule-due-posts', ...scheduleDuePostsCron },
    { name: 'publish-scheduled', ...publishScheduledCron },
    { name: 'publish-recurring', ...publishRecurringCron },
    { name: 'refresh-linkedin-tokens', ...refreshLinkedInTokensCron },
    { name: 'cleanup-logs', ...cleanupLogsCron },
    { name: 'terminate-idle-pg-sessions', ...terminateIdlePgSessionsCron }
];

const running = {};

function registerCronJob({ name, schedule, run }) {
    if (!cron.validate(schedule)) {
        logger.error(`Invalid cron expression for ${name}`, { schedule });
        return;
    }

    logger.info(`Starting cron job: ${name}`, { schedule, timezone: CRON_TIMEZONE });

    cron.schedule(
        schedule,
        async () => {
            if (running[name]) {
                logger.warn(`Cron: ${name} already running, skipping...`);
                return;
            }
            try {
                running[name] = true;
                logger.info(`Cron: Running ${name}...`);
                const result = await run();
                logger.info(`Cron: ${name} completed`, result);
            } catch (error) {
                logger.error(`Cron: ${name} error:`, error);
            } finally {
                running[name] = false;
            }
        },
        {
            scheduled: true,
            timezone: CRON_TIMEZONE
        }
    );

    logger.info(`Cron job registered: ${name}`);
}

function startCronServer() {
    logger.info('Initializing cron server...');

    for (const cronJob of registeredCrons) {
        registerCronJob(cronJob);
    }

    logger.info('Cron server initialized', {
        timezone: CRON_TIMEZONE,
        jobs: registeredCrons.map(({ name, schedule }) => ({ name, schedule }))
    });
}

// Delay start until DB/models are ready (same as legacy cronserver)
const START_DELAY_MS = 10000;
setTimeout(startCronServer, START_DELAY_MS);

module.exports = {
    registeredCrons,
    startCronServer,
    registerCronJob,
    CRON_TIMEZONE
};
