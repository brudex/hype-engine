const axios = require('axios');
const logger = require('../../../utils/logger');

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
 * Publish a post to Twitter
 * @param {object} post - Post model instance
 * @param {object} postVersion - PostVersion model instance
 * @param {array} tags - Array of Tag model instances
 * @param {object} account - Account model instance
 * @returns {Promise<object>} - Publish result
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        const accessToken = account.accessToken;
        const text = postVersion.content || '';
        const mediaUuids = postVersion.media || [];

        if (!accessToken) {
            return {
                success: false,
                error: 'Missing access token for account'
            };
        }

        // TODO: Implement actual Twitter API publishing
        logger.info(`Publishing to Twitter for account ${account.uuid}`);

        return {
            success: true,
            providerPostId: `twitter_${Date.now()}`,
            data: {
                platform: 'twitter',
                publishedAt: new Date()
            }
        };
    } catch (error) {
        logger.error('Twitter publish error:', error);
        return {
            success: false,
            error: error.message || 'Failed to publish to Twitter'
        };
    }
}

module.exports = {
    testCredentials,
    publishPost
};
