const db = require('../models');
const logger = require('../utils/logger');

const schedule = '*/30 * * * *'; // every 30 minutes

/**
 * Terminate idle PostgreSQL backends for the current database (not the caller's session).
 */
async function terminateIdlePgSessions() {
    const sql = `
        SELECT pg_terminate_backend(pid) AS terminated
        FROM pg_stat_activity
        WHERE datname = current_database()
          AND state = 'idle'
          AND pid <> pg_backend_pid()
    `;
    const rows = await db.sequelize.query(sql, {
        type: db.Sequelize.QueryTypes.SELECT
    });
    const ok = rows.filter((r) => r.terminated === true).length;
    const no = rows.filter((r) => r.terminated === false).length;
    return { backendsConsidered: rows.length, terminated: ok, terminateFailed: no };
}

async function run() {
    logger.info('Terminate idle PostgreSQL sessions started');
    const result = await terminateIdlePgSessions();
    logger.info('Terminate idle PostgreSQL sessions finished', result);
    return result;
}

module.exports = {
    schedule,
    run
};
