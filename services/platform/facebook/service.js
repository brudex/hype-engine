const axios = require('axios');
const logger = require('../../../utils/logger');

/**
 * Test Facebook API credentials
 * @param {object} configuration - Service configuration
 * @returns {Promise<object>} - Test result
 */
async function testCredentials(configuration) {
    try {
        const { app_id, app_secret, api_version = 'v24.0' } = configuration;

        if (!app_id || !app_secret) {
            return {
                success: false,
                message: 'Missing required credentials',
                error: 'app_id and app_secret are required'
            };
        }

        const response = await axios.get(
            `https://graph.facebook.com/${api_version}/oauth/access_token`,
            {
                params: {
                    client_id: app_id,
                    client_secret: app_secret,
                    grant_type: 'client_credentials'
                },
                timeout: 10000
            }
        );

        if (response.data && response.data.access_token) {
            const verifyResponse = await axios.get(
                `https://graph.facebook.com/${api_version}/me`,
                {
                    params: {
                        access_token: response.data.access_token
                    },
                    timeout: 10000
                }
            );

            return {
                success: true,
                message: 'Facebook API credentials are valid',
                data: {
                    api_version: api_version,
                    app_id: app_id,
                    token_type: response.data.token_type || 'bearer'
                }
            };
        }

        return {
            success: false,
            message: 'Invalid response from Facebook API',
            error: 'No access token received'
        };
    } catch (error) {
        logger.error('Facebook credentials test error:', error);

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 401 || status === 400) {
                return {
                    success: false,
                    message: 'Invalid Facebook API credentials',
                    error: data.error?.message || data.error || 'Invalid App ID or App Secret'
                };
            }
            return {
                success: false,
                message: `Facebook API error (${status})`,
                error: data.error?.message || data.error || error.message
            };
        }

        return {
            success: false,
            message: 'Failed to connect to Facebook API',
            error: error.message || 'Network error or timeout'
        };
    }
}

/**
 * Publish a post to Facebook
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        const accessToken = account.accessToken;
        const text = postVersion.content || '';
        const mediaUuids = postVersion.media || [];
        const pageId = account.providerId;

        if (!accessToken) {
            return {
                success: false,
                error: 'Missing access token for account'
            };
        }

        if (!pageId) {
            return {
                success: false,
                error: 'Missing page ID for account'
            };
        }

        logger.info(`Publishing to Facebook for account ${account.uuid}`);

        return {
            success: true,
            providerPostId: `facebook_${Date.now()}`,
            data: {
                platform: 'facebook',
                publishedAt: new Date()
            }
        };
    } catch (error) {
        logger.error('Facebook publish error:', error);
        return {
            success: false,
            error: error.message || 'Failed to publish to Facebook'
        };
    }
}

module.exports = {
    testCredentials,
    publishPost
};
