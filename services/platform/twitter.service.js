const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * Twitter Platform Service
 * Tests Twitter API credentials
 */
class TwitterService {
    /**
     * Test Twitter API credentials
     * @param {object} configuration - Service configuration
     * @returns {Promise<object>} - Test result
     */
    static async testCredentials(configuration) {
        try {
            const { client_id, client_secret, tier } = configuration;

            if (!client_id || !client_secret) {
                return {
                    success: false,
                    message: 'Missing required credentials',
                    error: 'client_id and client_secret are required'
                };
            }

            // Twitter API v2 - Test credentials by getting app-only bearer token
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
                } else if (status === 403) {
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
    static async publishPost(post, postVersion, tags, account) {
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
            // This is a placeholder implementation
            // You'll need to:
            // 1. Upload media if mediaUuids exist
            // 2. Format text with tags if needed
            // 3. Call Twitter API v2 to create tweet
            // 4. Return provider post ID

            logger.info(`Publishing to Twitter for account ${account.uuid}`);
            
            // Placeholder response
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
}

module.exports = TwitterService;

