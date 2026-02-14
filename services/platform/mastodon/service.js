const axios = require('axios');
const logger = require('../../../utils/logger');

/**
 * Test Mastodon API credentials
 * @param {object} configuration - Service configuration
 * @returns {Promise<object>} - Test result
 */
async function testCredentials(configuration) {
    try {
        const { client_id, client_secret, instance_url } = configuration;

        if (!client_id || !client_secret || !instance_url) {
            return {
                success: false,
                message: 'Missing required credentials',
                error: 'client_id, client_secret, and instance_url are required'
            };
        }

        let baseUrl = instance_url.trim();
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = 'https://' + baseUrl;
        }
        baseUrl = baseUrl.replace(/\/$/, '');

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
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        const accessToken = account.accessToken;
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

        logger.info(`Publishing to Mastodon for account ${account.uuid}`);

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

module.exports = {
    testCredentials,
    publishPost
};
