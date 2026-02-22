const axios = require('axios');
const logger = require('../../../utils/logger');
const db = require('../../../models');
const { refreshAccessToken } = require('./oauth');

const LINKEDIN_POSTS_API = 'https://api.linkedin.com/rest/posts';
const LINKEDIN_API_VERSION = '202402';

function stripHtml(html) {
    if (html == null || typeof html !== 'string') return '';
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
function buildHashtagsSuffix(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return '';
    const parts = [];
    for (const tag of tags) {
        const name = tag?.name;
        if (name == null || typeof name !== 'string') continue;
        const clean = String(name).trim().replace(/#/g, '').replace(/[^\w]/g, '');
        if (clean.length > 0) parts.push('#' + clean);
    }
    return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

/** Refresh if token expires in fewer than this many days */
const REFRESH_DAYS_BEFORE = 7;
const REFRESH_MS_BEFORE = REFRESH_DAYS_BEFORE * 24 * 60 * 60 * 1000;

/**
 * Test LinkedIn API credentials
 * @param {object} configuration - Service configuration
 * @returns {Promise<object>} - Test result
 */
async function testCredentials(configuration) {
    try {
        const { client_id, client_secret } = configuration;

        if (!client_id || !client_secret) {
            return {
                success: false,
                message: 'Missing required credentials',
                error: 'client_id and client_secret are required'
            };
        }

        const credentials = Buffer.from(`${encodeURIComponent(client_id)}:${encodeURIComponent(client_secret)}`).toString('base64');

        const response = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            }
        );
      

        if (response.data && response.data.access_token) {
            return {
                success: true,
                message: 'LinkedIn API credentials are valid',
                data: {
                    token_type: response.data.token_type || 'bearer',
                    expires_in: response.data.expires_in
                }
            };
        }

        return {
            success: false,
            message: 'Invalid response from LinkedIn API',
            error: 'No access token received'
        };
    } catch (error) {
        logger.error('LinkedIn credentials test error:', error);

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 401 || status === 400) {
                return {
                    success: false,
                    message: 'Invalid LinkedIn API credentials',
                    error: data.error_description || data.error || 'Invalid Client ID or Client Secret'
                };
            }
            return {
                success: false,
                message: `LinkedIn API error (${status})`,
                error: data.error_description || data.error || error.message
            };
        }

        return {
            success: false,
            message: 'Failed to connect to LinkedIn API',
            error: error.message || 'Network error or timeout'
        };
    }
}

/**
 * Ensure LinkedIn account has a valid access token. Refreshes if expired or expiring within REFRESH_DAYS_BEFORE.
 * Updates account.accessToken and account.data in DB if refreshed.
 * @param {object} account - Sequelize Account model (provider=linkedin, accessToken JSON string)
 * @param {{ clientId: string, clientSecret: string }} credentials - LinkedIn app credentials
 * @returns {Promise<string>} - access_token to use for API calls
 */
async function ensureLinkedInTokenFresh(account, credentials) {
    let data = account.accessToken;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            logger.warn('LinkedIn ensureLinkedInTokenFresh: invalid accessToken JSON', { accountUuid: account.uuid });
            return data ? String(data) : null;
        }
    }
    if (!data || !data.access_token) return null;

    const now = Date.now();
    let expiresAtMs = null;
    if (data.expires_at) {
        expiresAtMs = new Date(data.expires_at).getTime();
    } else if (data.expires_in != null) {
        expiresAtMs = now + data.expires_in * 1000;
    }
    if (expiresAtMs != null && expiresAtMs > now + REFRESH_MS_BEFORE) {
        return data.access_token;
    }

    const refreshToken = data.refresh_token;
    if (!refreshToken) {
        logger.warn('LinkedIn ensureLinkedInTokenFresh: no refresh_token, using current access_token', { accountUuid: account.uuid });
        return data.access_token;
    }

    try {
        const tokenResponse = await refreshAccessToken(refreshToken, credentials);
        const expiresAt = tokenResponse.expires_in != null ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString() : null;
        const oauthData = {
            access_token: tokenResponse.access_token,
            expires_in: tokenResponse.expires_in,
            expires_at: expiresAt,
            refresh_token: tokenResponse.refresh_token || refreshToken
        };
        account.accessToken = JSON.stringify(oauthData);
        account.data = oauthData;
        await account.save();
        logger.info('LinkedIn token refreshed', { accountUuid: account.uuid });
        return tokenResponse.access_token;
    } catch (err) {
        logger.error('LinkedIn token refresh failed', { accountUuid: account.uuid, message: err?.message });
        return data.access_token;
    }
}

/**
 * Publish a post to LinkedIn via Posts API (REST). Text-only; author is member (urn:li:person:{providerId}). Uses w_member_social.
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        let credentials = null;
        try {
            const oauthService = await db.OauthService.findOne({ where: { name: 'linkedin' } });
            if (oauthService && oauthService.configuration) {
                const config = typeof oauthService.configuration === 'string' ? JSON.parse(oauthService.configuration) : oauthService.configuration;
                credentials = { clientId: config.client_id || config.clientId, clientSecret: config.client_secret || config.clientSecret };
            }
        } catch (e) {
            logger.warn('LinkedIn publish: could not load OAuth config', { message: e?.message });
        }

        const accessToken = credentials
            ? await ensureLinkedInTokenFresh(account, credentials)
            : (typeof account.accessToken === 'string' ? (() => { try { return JSON.parse(account.accessToken).access_token; } catch { return account.accessToken; } })() : account.accessToken?.access_token);

        const providerId = account.providerId;

        if (!accessToken) {
            return {
                success: false,
                error: 'Missing access token for account'
            };
        }

        if (!providerId) {
            return {
                success: false,
                error: 'Missing person URN for account'
            };
        }

        const rawContent = postVersion.content || '';
        const content = stripHtml(rawContent).trim();
        const hashtagsSuffix = buildHashtagsSuffix(tags || []);
        const commentary = content + hashtagsSuffix;
        if (!commentary.trim()) {
            return {
                success: false,
                error: 'Post must have content or hashtags'
            };
        }

        const authorUrn = String(providerId).startsWith('urn:li:person:')
            ? providerId
            : `urn:li:person:${providerId}`;

        const body = {
            author: authorUrn,
            commentary: commentary.trim(),
            visibility: 'PUBLIC',
            distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: []
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false
        };

        logger.info(`Publishing to LinkedIn for account ${account.uuid}`);

        const response = await axios.post(LINKEDIN_POSTS_API, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Linkedin-Version': LINKEDIN_API_VERSION,
                'X-Restli-Protocol-Version': '2.0.0'
            },
            validateStatus: (status) => status >= 200 && status < 300
        });

        const postId = response.headers && (response.headers['x-restli-id'] || response.headers['X-Restli-Id']);
        const providerPostId = postId ? String(postId) : `linkedin_${Date.now()}`;

        return {
            success: true,
            providerPostId,
            data: {
                platform: 'linkedin',
                publishedAt: new Date(),
                postId: postId || null
            }
        };
    } catch (error) {
        logger.error('LinkedIn publish error:', error);
        const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to publish to LinkedIn';
        return {
            success: false,
            error: message
        };
    }
}

module.exports = {
    testCredentials,
    publishPost,
    ensureLinkedInTokenFresh
};
