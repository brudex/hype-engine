const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * Facebook Platform Service
 * Tests Facebook API credentials
 */
class FacebookService {
    /**
     * Test Facebook API credentials
     * @param {object} configuration - Service configuration
     * @returns {Promise<object>} - Test result
     */
    static async testCredentials(configuration) {
        try {
            const { app_id, app_secret, api_version = 'v24.0' } = configuration;

            if (!app_id || !app_secret) {
                return {
                    success: false,
                    message: 'Missing required credentials',
                    error: 'app_id and app_secret are required'
                };
            }

            // Facebook Graph API - Test credentials by getting app access token
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
                // Verify the token by making a test API call
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
     * @param {object} post - Post model instance
     * @param {object} postVersion - PostVersion model instance
     * @param {array} tags - Array of Tag model instances
     * @param {object} account - Account model instance
     * @returns {Promise<object>} - Publish result
     */
    static async publishPost(post, postVersion, tags, account) {
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

            // TODO: Implement actual Facebook Graph API publishing
            // This is a placeholder implementation
            // You'll need to:
            // 1. Upload media if mediaUuids exist
            // 2. Format text with tags if needed
            // 3. Call Facebook Graph API to create post
            // 4. Return provider post ID

            logger.info(`Publishing to Facebook for account ${account.uuid}`);
            
            // Placeholder response
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
}

module.exports = FacebookService;

