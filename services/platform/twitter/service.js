const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../../utils/logger');
const { createUserClient } = require('./oauth');
const db = require('../../../models');

/** Max images per tweet (X limit is 4) */
const MAX_MEDIA_PER_TWEET = 4;

/** Strip HTML tags and decode common entities for plain-text posting (e.g. Twitter). */
function stripHtml(html) {
    if (html == null || typeof html !== 'string') return '';
    let text = String(html)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
    Object.keys(entities).forEach((key) => { text = text.split(key).join(entities[key]); });
    return text;
}

/** Build hashtag string from Tag array (tag.name = hashtag name). X hashtags: letters, numbers, underscore only. */
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
 * Load Media records by UUIDs (preserves order). Path is relative to public folder.
 * @param {string[]} mediaUuids - Array of Media UUIDs from postVersion.media
 * @returns {Promise<import('../../../models').Media[]>}
 */
async function loadMediaByUuids(mediaUuids) {
    if (!Array.isArray(mediaUuids) || mediaUuids.length === 0) return [];
    const list = [];
    for (const uuid of mediaUuids) {
        const media = await db.Media.findOne({ where: { uuid: String(uuid).trim() } });
        if (media) list.push(media);
    }
    return list;
}

/**
 * Upload images to X (v1 media API) and return media IDs for v2.tweet. Max 4 images per tweet.
 * @param {object} client - TwitterApi instance (user client)
 * @param {object[]} mediaRecords - Media model instances (path relative to public, mimeType)
 * @param {string} publicRoot - Absolute path to public directory
 * @returns {Promise<string[]>} - Media IDs
 */
async function uploadMediaToTwitter(client, mediaRecords, publicRoot) {
    const mediaIds = [];
    const toUpload = mediaRecords.slice(0, MAX_MEDIA_PER_TWEET);
    for (const media of toUpload) {
        const filePath = path.join(publicRoot, media.path);
        let buffer;
        try {
            buffer = await fs.readFile(filePath);
        } catch (err) {
            logger.warn('Twitter: could not read media file', { path: media.path, error: err?.message });
            continue;
        }
        const mimeType = media.mimeType || 'image/jpeg';
        try {
            console.log('Uploading media to Twitter >>>>', media.path);
            console.log('Mime Type >>>>', mimeType);
            logger.info('Uploading media to Twitter >>>>'+ media.path);
            const mediaId = await client.v1.uploadMedia(buffer, { mimeType });
            console.log('Upload complete Media ID >>>>', mediaId);
            logger.info('Upload complete Media ID >>>>'+ mediaId);
            if (mediaId) mediaIds.push(mediaId);
        } catch (err) {
            logger.warn('Twitter: media upload failed', { path: media.path, error: err?.message });
        }
    }
    console.log('Returning Media IDs >>>>', mediaIds);
    logger.info('Returning Media IDs >>>>'+ mediaIds);
    return mediaIds;
}

/**
 * Publish a post to X (Twitter) using twitter-api-v2 with user OAuth 1.0a tokens.
 * Supports text and images (postVersion.media = array of Media UUIDs; Media.path is relative to public).
 * @param {object} post - Post model instance
 * @param {object} postVersion - PostVersion model instance
 * @param {array} tags - Array of Tag model instances
 * @param {object} account - Account model instance (provider=twitter, accessToken JSON with accessToken/accessSecret)
 * @returns {Promise<object>} - Publish result
 */
async function publishPost(post, postVersion, tags, account) {
    try {
        const rawContent = postVersion.content || '';
        const content = stripHtml(rawContent).trim();
        const hashtagsSuffix = buildHashtagsSuffix(tags || []);
        const text = content + hashtagsSuffix;
        console.log('Text >>>>', text); 
        logger.info('Text >>>>', text);
        const mediaUuids = Array.isArray(postVersion.media) ? postVersion.media : [];
        if (!text.trim() && mediaUuids.length === 0) {
            return {
                success: false,
                error: 'Post must have content or at least one image'
            };
        }

        const userTokens = parseAccountTokens(account);
        if (!userTokens) {
            return {
                success: false,
                error: 'Missing or invalid access token for account (need accessToken and accessSecret in accessToken JSON)'
            };
        }

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

        const publicRoot = path.join(__dirname, '../../../public');
        const mediaRecords = await loadMediaByUuids(mediaUuids);
        const mediaIds = await uploadMediaToTwitter(client, mediaRecords, publicRoot);

        logger.info(`Publishing to X for account ${account.uuid}`, { hasText: !!text, mediaCount: mediaIds.length });

        const tweetParams = mediaIds.length > 0 ? { media: { media_ids: mediaIds } } : undefined;
        console.log('Tweet Params >>>>', tweetParams);
        logger.info('Tweet Params >>>>'+ tweetParams);
        const result = await client.v2.tweet(text || undefined, tweetParams);
        console.log('Tweet Result >>>>', result);
        logger.info('Tweet Result >>>>'+ result);
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
