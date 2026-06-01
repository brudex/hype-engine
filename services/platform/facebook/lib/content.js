/**
 * Post text helpers shared by Facebook Page and Instagram publishers.
 */

function stripHtml(html) {
    if (html == null || typeof html !== 'string') return '';
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

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
 * @param {object} postVersion
 * @param {Array} tags
 * @returns {string}
 */
function buildCaption(postVersion, tags) {
    const content = stripHtml(postVersion?.content || '');
    const suffix = buildHashtagsSuffix(tags || []);
    return (content + suffix).trim();
}

module.exports = {
    stripHtml,
    buildHashtagsSuffix,
    buildCaption
};
