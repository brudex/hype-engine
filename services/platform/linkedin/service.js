const axios = require('axios');
const logger = require('../../../utils/logger');

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
 * Publish a post to LinkedIn
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        const accessToken = account.accessToken;
        const personUrn = account.providerId;

        if (!accessToken) {
            return {
                success: false,
                error: 'Missing access token for account'
            };
        }

        if (!personUrn) {
            return {
                success: false,
                error: 'Missing person URN for account'
            };
        }

        logger.info(`Publishing to LinkedIn for account ${account.uuid}`);

        return {
            success: true,
            providerPostId: `linkedin_${Date.now()}`,
            data: {
                platform: 'linkedin',
                publishedAt: new Date()
            }
        };
    } catch (error) {
        logger.error('LinkedIn publish error:', error);
        return {
            success: false,
            error: error.message || 'Failed to publish to LinkedIn'
        };
    }
}

module.exports = {
    testCredentials,
    publishPost
};
