const axios = require('axios');
const logger = require('../../../utils/logger');
const { resolveMetaCredentials } = require('./lib/credentials');
const { buildCaption } = require('./lib/content');
const { loadMediaByUuids, getPublicMediaUrl, isImageMedia } = require('./lib/media');
const { publishToFacebookPage } = require('./publish/facebook-page');
const { publishToInstagram } = require('./publish/instagram');

/**
 * Test Facebook API credentials (app id + secret).
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
 * Resolve first suitable public image URL from post media UUIDs.
 */
async function resolvePublicImageUrl(mediaUuids) {
    const records = await loadMediaByUuids(mediaUuids);
    for (const media of records) {
        if (!isImageMedia(media)) continue;
        const url = getPublicMediaUrl(media);
        if (url) return url;
    }
    return null;
}

/**
 * Dispatch publish to Facebook Page or Instagram Business publisher.
 */
async function publishPost(post, postVersion, tags, account) {
    const credentials = resolveMetaCredentials(account);
    const caption = buildCaption(postVersion, tags);
    const publicImageUrl = await resolvePublicImageUrl(
        Array.isArray(postVersion.media) ? postVersion.media : []
    );

    logger.info('Meta publish dispatch', {
        postUuid: post?.uuid,
        accountUuid: credentials.accountUuid,
        provider: credentials.provider,
        apiVersion: credentials.apiVersion,
        hasCaption: !!caption,
        hasPublicImage: !!publicImageUrl
    });

    try {
        if (credentials.provider === 'instagram') {
            return await publishToInstagram({ credentials, caption, publicImageUrl });
        }
        if (credentials.provider === 'facebook') {
            return await publishToFacebookPage({ credentials, caption, publicImageUrl });
        }
        return {
            success: false,
            error: `Unsupported Meta provider for publish: ${credentials.provider}`
        };
    } catch (error) {
        const logKey = credentials.provider === 'instagram' ? 'Meta IG publish' : 'Meta FB publish';
        logger.error(`${logKey} unexpected error`, {
            accountUuid: credentials.accountUuid,
            message: error?.message,
            ...(error?.response && { httpStatus: error.response.status, responseData: error.response.data })
        });
        return {
            success: false,
            error: error.message || `Failed to publish to ${credentials.provider}`
        };
    }
}

module.exports = {
    testCredentials,
    publishPost,
    resolveMetaCredentials,
    publishToFacebookPage,
    publishToInstagram
};
