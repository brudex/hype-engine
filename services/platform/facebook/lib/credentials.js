/**
 * Resolve Meta (Facebook / Instagram) credentials from a connected Account row.
 */

function parseStoredTokenPayload(account) {
    let raw = account.accessToken;
    if (raw == null) {
        return account.data && typeof account.data === 'object' ? { ...account.data } : {};
    }
    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed.startsWith('{')) {
            try {
                return JSON.parse(trimmed);
            } catch (_) {
                return { access_token: trimmed };
            }
        }
        return { access_token: trimmed };
    }
    if (typeof raw === 'object') {
        return { ...raw };
    }
    return {};
}

/**
 * @param {object} account - Sequelize Account (provider facebook | instagram)
 * @returns {{
 *   provider: string,
 *   accountUuid: string,
 *   apiVersion: string,
 *   accessToken: string|null,
 *   pageId: string|null,
 *   instagramId: string|null
 * }}
 */
function resolveMetaCredentials(account) {
    const provider = String(account.provider || 'facebook').toLowerCase();
    const data = parseStoredTokenPayload(account);
    const apiVersion = String(data.api_version || 'v24.0').replace(/^\//, '');
    const accessToken = data.access_token ? String(data.access_token) : null;

    const pageId =
        data.page_id != null
            ? String(data.page_id)
            : provider === 'facebook'
              ? String(account.providerId || '')
              : null;

    const instagramId =
        data.instagram_id != null
            ? String(data.instagram_id)
            : provider === 'instagram'
              ? String(account.providerId || '')
              : null;

    return {
        provider,
        accountUuid: account.uuid,
        apiVersion,
        accessToken,
        pageId: pageId || null,
        instagramId: instagramId || null
    };
}

module.exports = {
    parseStoredTokenPayload,
    resolveMetaCredentials
};
