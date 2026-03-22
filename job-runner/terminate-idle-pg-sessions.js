const db = require('../models');
const logger = require('../utils/logger');

/**
 * Terminate idle PostgreSQL backends for the current database (not the caller's session).
 *
 * Reference / diagnostics (run manually in psql or any SQL client):
 *   SHOW max_connections;
 *
 *   SELECT pid, usename, application_name, client_addr, state, state_change,
 *          LEFT(query, 80) AS query_preview
 *   FROM pg_stat_activity
 *   WHERE datname = current_database()
 *   ORDER BY state_change;
 *
 * Termination (this job):
 *   SELECT pg_terminate_backend(pid)
 *   FROM pg_stat_activity
 *   WHERE datname = current_database()
 *     AND state = 'idle'
 *     AND pid <> pg_backend_pid();
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
    logger.info('Terminate idle PG sessions completed', {
        backendsConsidered: rows.length,
        terminated: ok,
        terminateFailed: no
    });
    return { backendsConsidered: rows.length, terminated: ok, terminateFailed: no };
}

module.exports = terminateIdlePgSessions;
