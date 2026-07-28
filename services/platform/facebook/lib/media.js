const path = require('path');
const db = require('../../../../models');
const config = require('../../../../config/config');

const siteUrl = config.siteurl;

/** Load Media records by UUID (preserves order). */
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
 * Absolute URL for Meta APIs (Instagram image_url, Facebook photo url).
 * @param {object} media - Media model instance
 * @returns {string|null}
 */
function getPublicMediaUrl(media) {
    if (!media || !media.path) return null;
    if (media.disk === 'external_media') {
        const p = String(media.path);
        return p.startsWith('http') ? p : null;
    }
    const relative = String(media.path).replace(/^\/+/, '');
    return `${siteUrl}/${relative}`;
}

/**
 * Local filesystem path under public/ for optional validation.
 */
function getLocalMediaPath(media) {
    if (!media || !media.path || media.disk === 'external_media') return null;
    const publicRoot = path.join(__dirname, '../../../../public');
    return path.join(publicRoot, String(media.path).replace(/^\/+/, ''));
}

function isImageMedia(media) {
    const mime = (media?.mimeType || '').toLowerCase();
    return mime.startsWith('image/');
}

module.exports = {
    loadMediaByUuids,
    getPublicMediaUrl,
    getLocalMediaPath,
    isImageMedia,
    siteUrl
};
