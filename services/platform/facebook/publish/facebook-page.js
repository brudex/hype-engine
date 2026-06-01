const logger = require('../../../../utils/logger');
const { graphPost } = require('../lib/graph');

const LOG = 'Meta FB publish';

/**
 * Publish to a Facebook Page via Graph API.
 * Text-only → /{page-id}/feed
 * With image → /{page-id}/photos (public image URL)
 *
 * @param {object} ctx
 * @param {object} ctx.credentials - from resolveMetaCredentials (provider facebook)
 * @param {string} ctx.caption
 * @param {string|null} ctx.publicImageUrl
 */
async function publishToFacebookPage({ credentials, caption, publicImageUrl }) {
    const { pageId, accessToken, apiVersion, accountUuid } = credentials;
    if (!pageId) {
        return { success: false, error: 'Missing Facebook Page ID for account' };
    }
    if (!accessToken) {
        return { success: false, error: 'Missing page access token for account' };
    }
    if (!caption && !publicImageUrl) {
        return { success: false, error: 'Post must have text or an image' };
    }

    logger.info(`${LOG} start`, {
        accountUuid,
        pageId,
        apiVersion,
        hasCaption: !!caption,
        hasImage: !!publicImageUrl
    });

    let result;
    if (publicImageUrl) {
        const params = { url: publicImageUrl };
        if (caption) params.caption = caption;
        result = await graphPost(
            apiVersion,
            `${pageId}/photos`,
            params,
            accessToken,
            'Page photo'
        );
    } else {
        result = await graphPost(
            apiVersion,
            `${pageId}/feed`,
            { message: caption },
            accessToken,
            'Page feed'
        );
    }

    if (!result.ok) {
        return { success: false, error: result.error };
    }

    const providerPostId = String(result.data.id || result.data.post_id || `facebook_${Date.now()}`);

    logger.info(`${LOG} success`, { accountUuid, pageId, providerPostId });

    return {
        success: true,
        providerPostId,
        data: {
            platform: 'facebook',
            publishedAt: new Date(),
            pageId,
            graphId: result.data.id || null,
            postId: result.data.post_id || null
        }
    };
}

module.exports = {
    publishToFacebookPage
};
