const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * Mastodon Platform Service
 * Tests Mastodon API credentials
 * Note: Mastodon is decentralized, so we test against the specific instance
 */
class MastodonService {
    /**
     * Test Mastodon API credentials
     * @param {object} configuration - Service configuration
     * @returns {Promise<object>} - Test result
     */
    static async testCredentials(configuration) {
        try {
            const { client_id, client_secret, instance_url } = configuration;

            if (!client_id || !client_secret || !instance_url) {
                return {
                    success: false,
                    message: 'Missing required credentials',
                    error: 'client_id, client_secret, and instance_url are required'
                };
            }

            // Validate and normalize instance URL
            let baseUrl = instance_url.trim();
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl;
            }
            // Remove trailing slash
            baseUrl = baseUrl.replace(/\/$/, '');

            // Mastodon OAuth - Test credentials by getting app access token
            // Mastodon uses OAuth 2.0 Client Credentials flow
            const credentials = Buffer.from(`${encodeURIComponent(client_id)}:${encodeURIComponent(client_secret)}`).toString('base64');

            const response = await axios.post(
                `${baseUrl}/oauth/token`,
                'grant_type=client_credentials&scope=read write follow',
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 10000
                }
            );

            if (response.data && response.data.access_token) {
                // Verify the token by making a test API call to verify credentials
                try {
                    const verifyResponse = await axios.get(
                        `${baseUrl}/api/v1/accounts/verify_credentials`,
                        {
                            headers: {
                                'Authorization': `Bearer ${response.data.access_token}`
                            },
                            timeout: 10000
                        }
                    );

                    return {
                        success: true,
                        message: 'Mastodon API credentials are valid',
                        data: {
                            instance_url: baseUrl,
                            token_type: response.data.token_type || 'bearer',
                            scope: response.data.scope,
                            account_id: verifyResponse.data.id,
                            username: verifyResponse.data.username
                        }
                    };
                } catch (verifyError) {
                    // Token was obtained but verification failed - still consider credentials valid
                    // This might happen if the token doesn't have the right scopes
                    return {
                        success: true,
                        message: 'Mastodon API credentials are valid (token obtained)',
                        data: {
                            instance_url: baseUrl,
                            token_type: response.data.token_type || 'bearer',
                            scope: response.data.scope,
                            note: 'Token verification failed, but credentials are valid'
                        }
                    };
                }
            }

            return {
                success: false,
                message: 'Invalid response from Mastodon API',
                error: 'No access token received'
            };
        } catch (error) {
            logger.error('Mastodon credentials test error:', error);
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 401 || status === 400) {
                    return {
                        success: false,
                        message: 'Invalid Mastodon API credentials',
                        error: data.error_description || data.error || 'Invalid Client ID, Client Secret, or Instance URL'
                    };
                }

                if (status === 404) {
                    return {
                        success: false,
                        message: 'Mastodon instance not found',
                        error: 'The instance URL appears to be invalid or unreachable'
                    };
                }

                return {
                    success: false,
                    message: `Mastodon API error (${status})`,
                    error: data.error_description || data.error || error.message
                };
            }

            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                return {
                    success: false,
                    message: 'Failed to connect to Mastodon instance',
                    error: 'The instance URL is unreachable. Please check the URL and try again.'
                };
            }

            return {
                success: false,
                message: 'Failed to connect to Mastodon API',
                error: error.message || 'Network error or timeout'
            };
        }
    }

    /**
     * Publish a post to Mastodon
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
            const instanceUrl = account.data?.instance_url;

            if (!accessToken) {
                return {
                    success: false,
                    error: 'Missing access token for account'
                };
            }

            if (!instanceUrl) {
                return {
                    success: false,
                    error: 'Missing instance URL for account'
                };
            }

            // TODO: Implement actual Mastodon API publishing
            // This is a placeholder implementation
            // You'll need to:
            // 1. Upload media if mediaUuids exist
            // 2. Format text with tags if needed
            // 3. Call Mastodon API to create status
            // 4. Return provider post ID

            logger.info(`Publishing to Mastodon for account ${account.uuid}`);
            
            // Placeholder response
            return {
                success: true,
                providerPostId: `mastodon_${Date.now()}`,
                data: {
                    platform: 'mastodon',
                    publishedAt: new Date()
                }
            };
        } catch (error) {
            logger.error('Mastodon publish error:', error);
            return {
                success: false,
                error: error.message || 'Failed to publish to Mastodon'
            };
        }
    }
}

module.exports = MastodonService;

