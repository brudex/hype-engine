const logger = require('../../../../utils/logger');
const { graphPost } = require('../lib/graph');

const LOG = 'Meta IG publish';

/**
 * Publish to Instagram Business account (two-step: create container → publish).
 * Requires a public image URL.
 *
 * @param {object} ctx
 * @param {object} ctx.credentials - from resolveMetaCredentials (provider instagram)
 * @param {string} ctx.caption
 * @param {string|null} ctx.publicImageUrl
 */
async function publishToInstagram({ credentials, caption, publicImageUrl }) {
    const { instagramId, accessToken, apiVersion, accountUuid, pageId } = credentials;

    if (!instagramId) {
        return { success: false, error: 'Missing Instagram Business account ID' };
    }
    if (!accessToken) {
        return { success: false, error: 'Missing page access token for Instagram account' };
    }
    if (!publicImageUrl) {
        return {
            success: false,
            error: 'Instagram posts require at least one image with a public URL (configure SITEURL so media is reachable by Meta)'
        };
    }

    logger.info(`${LOG} start`, {
        accountUuid,
        instagramId,
        linkedPageId: pageId,
        apiVersion,
        imageUrlHost: (() => {
            try {
                return new URL(publicImageUrl).host;
            } catch {
                return null;
            }
        })(),
        captionLength: caption ? caption.length : 0
    });

    const mediaParams = {
        image_url: publicImageUrl
    };
    if (caption) mediaParams.caption = caption;

    const createResult = await graphPost(
        apiVersion,
        `${instagramId}/media`,
        mediaParams,
        accessToken,
        'IG media container'
    );

    if (!createResult.ok) {
        return { success: false, error: createResult.error };
    }

    const creationId = createResult.data.id;
    if (!creationId) {
        logger.error(`${LOG} missing creation_id`, { accountUuid, graphResponse: createResult.data });
        return { success: false, error: 'Instagram media container created but no creation id returned' };
    }

    const publishResult = await graphPost(
        apiVersion,
        `${instagramId}/media_publish`,
        { creation_id: creationId },
        accessToken,
        'IG media_publish'
    );

    if (!publishResult.ok) {
        return { success: false, error: publishResult.error };
    }

    const providerPostId = String(publishResult.data.id || creationId || `instagram_${Date.now()}`);

    logger.info(`${LOG} success`, {
        accountUuid,
        instagramId,
        providerPostId,
        creationId: String(creationId)
    });

    return {
        success: true,
        providerPostId,
        data: {
            platform: 'instagram',
            publishedAt: new Date(),
            instagramId,
            creationId: String(creationId),
            mediaId: publishResult.data.id || null
        }
    };
}

module.exports = {
    publishToInstagram
};
