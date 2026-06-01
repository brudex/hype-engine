const axios = require('axios');
const logger = require('../../../../utils/logger');

const LOG_PREFIX = 'Meta Graph';

function graphBaseUrl(apiVersion) {
    const v = String(apiVersion || 'v24.0').replace(/^\//, '');
    return `https://graph.facebook.com/${v}`;
}

function extractGraphError(data, status) {
    const err = data?.error;
    if (err && typeof err === 'object') {
        return err.message || err.error_user_msg || JSON.stringify(err);
    }
    if (typeof data?.error === 'string') return data.error;
    return `Graph API request failed (${status})`;
}

/**
 * POST to Graph API (query params body style used by Meta feed/media endpoints).
 */
async function graphPost(apiVersion, graphPath, params, accessToken, logLabel) {
    const url = `${graphBaseUrl(apiVersion)}/${graphPath}`;
    const res = await axios.post(url, null, {
        params: { ...params, access_token: accessToken },
        validateStatus: () => true,
        timeout: 60000
    });
    const data = res.data || {};
    if (res.status < 200 || res.status >= 300) {
        const message = extractGraphError(data, res.status);
        logger.error(`${LOG_PREFIX} ${logLabel} failed`, {
            status: res.status,
            graphPath,
            message,
            graphResponse: data
        });
        return { ok: false, status: res.status, data, error: message };
    }
    logger.info(`${LOG_PREFIX} ${logLabel} ok`, {
        graphPath,
        status: res.status,
        responseId: data.id || data.post_id || null
    });
    return { ok: true, status: res.status, data };
}

module.exports = {
    graphBaseUrl,
    graphPost,
    extractGraphError,
    LOG_PREFIX
};
