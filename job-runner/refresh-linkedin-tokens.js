const db = require('../models');
const logger = require('../utils/logger');
const linkedinPlatform = require('../services/platform/linkedin');

/**
 * Refresh LinkedIn access tokens that are expired or expiring within the next 7 days.
 * Runs daily; only accounts that need refresh are updated.
 */
async function refreshLinkedInTokens() {
    try {
        const oauthService = await db.OauthService.findOne({ where: { name: 'linkedin' } });
        if (!oauthService || !oauthService.configuration) {
            logger.info('Refresh LinkedIn tokens: LinkedIn OAuth not configured, skipping');
            return { refreshed: 0, skipped: 0, failed: 0 };
        }
        const config = typeof oauthService.configuration === 'string' ? JSON.parse(oauthService.configuration) : oauthService.configuration;
        const credentials = { clientId: config.client_id || config.clientId, clientSecret: config.client_secret || config.clientSecret };
        if (!credentials.clientId || !credentials.clientSecret) {
            logger.warn('Refresh LinkedIn tokens: missing client_id or client_secret');
            return { refreshed: 0, skipped: 0, failed: 0 };
        }

        const accounts = await db.Account.findAll({
            where: { provider: 'linkedin', authorized: true },
            attributes: ['id', 'uuid', 'accessToken', 'data']
        });

        let refreshed = 0;
        let failed = 0;
        for (const account of accounts) {
            try {
                const before = account.accessToken;
                await linkedinPlatform.ensureLinkedInTokenFresh(account, credentials);
                const after = account.accessToken;
                if (after !== before) refreshed++;
            } catch (err) {
                logger.error('Refresh LinkedIn tokens: account failed', { accountUuid: account.uuid, message: err?.message });
                failed++;
            }
        }

        logger.info('Refresh LinkedIn tokens completed', { total: accounts.length, refreshed, failed });
        return { total: accounts.length, refreshed, skipped: accounts.length - refreshed - failed, failed };
    } catch (error) {
        logger.error('Refresh LinkedIn tokens error', { message: error?.message });
        throw error;
    }
}

module.exports = refreshLinkedInTokens;
