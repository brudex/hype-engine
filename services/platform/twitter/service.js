const axios = require('axios');
const logger = require('../../../utils/logger');
const { createUserClient } = require('./oauth');

/**
 * Test Twitter API credentials
 * @param {object} configuration - Service configuration
 * @returns {Promise<object>} - Test result
 */
async function testCredentials(configuration) {
    try {
        const client_id = configuration.consumer_key || configuration.client_id;
        const client_secret = configuration.consumer_secret || configuration.client_secret;
        const tier = configuration.tier;

        if (!client_id || !client_secret) {
            return {
                success: false,
                message: 'Missing required credentials',
                error: 'Consumer Key and Consumer Secret (or client_id and client_secret) are required'
            };
        }

        const credentials = Buffer.from(`${encodeURIComponent(client_id)}:${encodeURIComponent(client_secret)}`).toString('base64');

        const response = await axios.post(
            'https://api.twitter.com/oauth2/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                timeout: 10000
            }
        );

        if (response.data && response.data.access_token) {
            return {
                success: true,
                message: 'Twitter API credentials are valid',
                data: {
                    token_type: response.data.token_type,
                    tier: tier || 'unknown'
                }
            };
        }

        return {
            success: false,
            message: 'Invalid response from Twitter API',
            error: 'No access token received'
        };
    } catch (error) {
        logger.error('Twitter credentials test error:', error);

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 401) {
                return {
                    success: false,
                    message: 'Invalid Twitter API credentials',
                    error: data.error || 'Unauthorized - Check your API Key and Secret'
                };
            }
            if (status === 403) {
                return {
                    success: false,
                    message: 'Twitter API access forbidden',
                    error: data.error || 'Forbidden - Check your API permissions'
                };
            }
            return {
                success: false,
                message: `Twitter API error (${status})`,
                error: data.error || error.message
            };
        }

        return {
            success: false,
            message: 'Failed to connect to Twitter API',
            error: error.message || 'Network error or timeout'
        };
    }
}

/**
 * Parse account.accessToken (JSON string or object) to get user tokens for X/Twitter API.
 * Expected format: { accessToken, accessSecret, userId?, screenName? }
 */
function parseAccountTokens(account) {
    let data = account.accessToken;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
    if (!data || !data.accessToken || !data.accessSecret) return null;
    return { accessToken: data.accessToken, accessSecret: data.accessSecret };
}

/**
 * Publish a post to X (Twitter) using twitter-api-v2 with user OAuth 1.0a tokens.
 * App credentials (consumer_key, consumer_secret) from OauthService; user tokens from Account.accessToken JSON.
 * @param {object} post - Post model instance
 * @param {object} postVersion - PostVersion model instance
 * @param {array} tags - Array of Tag model instances
 * @param {object} account - Account model instance (provider=twitter, accessToken JSON with accessToken/accessSecret)
 * @returns {Promise<object>} - Publish result
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        const text = (postVersion.content || '').trim();
        if (!text) {
            return {
                success: false,
                error: 'Post content is empty'
            };
        }

        const userTokens = parseAccountTokens(account);
        if (!userTokens) {
            return {
                success: false,
                error: 'Missing or invalid access token for account (need accessToken and accessSecret in accessToken JSON)'
            };
        }

        // see top of file for `const db = require('../../../models');`
        const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
        if (!oauthService || !oauthService.configuration) {
            return {
                success: false,
                error: 'Twitter (X) OAuth is not configured. Add consumer_key and consumer_secret in OAuth Connect.'
            };
        }
        const config = typeof oauthService.configuration === 'string' ? JSON.parse(oauthService.configuration) : oauthService.configuration;
        const appKey = config.consumer_key || config.client_id;
        const appSecret = config.consumer_secret || config.client_secret;
        if (!appKey || !appSecret) {
            return {
                success: false,
                error: 'Twitter (X) consumer_key and consumer_secret are required in OAuth Connect.'
            };
        }

        const client = createUserClient(appKey, appSecret, userTokens.accessToken, userTokens.accessSecret);

        logger.info(`Publishing to X for account ${account.uuid}`);

        const result = await client.v2.tweet(text);

        const tweetId = result?.data?.id;
        return {
            success: true,
            providerPostId: tweetId ? String(tweetId) : `twitter_${Date.now()}`,
            data: {
                platform: 'twitter',
                publishedAt: new Date(),
                tweetId: tweetId || null
            }
        };
    } catch (error) {
        logger.error('Twitter publish error:', error);
        const message = error?.message || error?.code || String(error);
        return {
            success: false,
            error: message || 'Failed to publish to Twitter'
        };
    }
}

module.exports = {
    testCredentials,
    publishPost
};
