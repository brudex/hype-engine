const crypto = require('crypto');
const axios = require('axios');
const logger = require('../../../utils/logger');

/** Scopes for Page posting (user token → /me/accounts → page access token). */
const DEFAULT_SCOPES = [
    'public_profile',
    'pages_show_list',
    'pages_manage_posts',
    'pages_read_engagement',
    'pages_manage_metadata',
    'instagram_basic',
    'instagram_content_publish',
    'pages_messaging'
].join(',');

/**
 * @param {{ appId: string, redirectUri: string, apiVersion?: string }} opts
 * @returns {{ url: string, state: string }}
 */
function generateAuthLink({ appId, redirectUri, apiVersion = 'v24.0' }) {
    if (!appId) throw new Error('Facebook app_id is required');
    const state = crypto.randomBytes(16).toString('hex');
    const v = apiVersion.replace(/^\//, '');
    const payload = {
        client_id: appId,
        redirect_uri: redirectUri,
        state,
        response_type: 'code',
        scope: DEFAULT_SCOPES
    };
    logger.info('Facebook auth link payload', { payload });
    console.log('Facebook auth link payload', payload);
    const params = new URLSearchParams(payload);
    const url = `https://www.facebook.com/${v}/dialog/oauth?${params.toString()}`;
    logger.info('Facebook auth link', { state: state.slice(0, 8) + '...' });
    return { url, state };
}

/**
 * Exchange authorization code for short-lived user access token.
 */
async function exchangeCodeForToken(code, redirectUri, appId, appSecret, apiVersion = 'v24.0') {
    const v = apiVersion.replace(/^\//, '');
    const res = await axios.get(`https://graph.facebook.com/${v}/oauth/access_token`, {
        params: {
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code
        },
        validateStatus: () => true
    });
    const data = res.data || {};
    if (res.status !== 200 || !data.access_token) {
        const errObj = data.error;
        const msg =
            (errObj && typeof errObj === 'object' && errObj.message) ||
            data.error_description ||
            (typeof data.error === 'string' ? data.error : null) ||
            `Token exchange failed (${res.status})`;
        logger.error('Facebook token exchange failed', {
            status: res.status,
            redirectUri,
            graphResponse: data
        });
        throw new Error(msg);
    }
    return { access_token: data.access_token, expires_in: data.expires_in };
}

/**
 * Exchange short-lived user token for long-lived (≈60 days).
 */
async function exchangeToLongLivedUserToken(shortToken, appId, appSecret, apiVersion = 'v24.0') {
    const v = apiVersion.replace(/^\//, '');
    const res = await axios.get(`https://graph.facebook.com/${v}/oauth/access_token`, {
        params: {
            grant_type: 'fb_exchange_token',
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: shortToken
        },
        validateStatus: () => true
    });
    const data = res.data || {};
    if (res.status !== 200 || !data.access_token) {
        logger.warn('Facebook long-lived exchange skipped or failed', { status: res.status });
        return { access_token: shortToken, expires_in: null };
    }
    return { access_token: data.access_token, expires_in: data.expires_in };
}

/**
 * Pages the user can manage (includes page access_token for posting).
 */
async function getManagedPages(userAccessToken, apiVersion = 'v24.0') {
    const v = apiVersion.replace(/^\//, '');
    const res = await axios.get(`https://graph.facebook.com/${v}/me/accounts`, {
        params: {
            access_token: userAccessToken,
            fields: 'id,name,access_token,tasks'
        },
        validateStatus: () => true
    });
    const data = res.data || {};
    if (res.status !== 200) {
        const msg = data.error?.message || data.error || `me/accounts failed (${res.status})`;
        throw new Error(msg);
    }
    return Array.isArray(data.data) ? data.data : [];
}

/**
 * Find the Instagram business account linked to a Facebook Page (if any).
 */
async function getInstagramBusinessAccount(pageId, pageAccessToken, apiVersion = 'v24.0') {
    const v = apiVersion.replace(/^\//, '');
    const res = await axios.get(`https://graph.facebook.com/${v}/${pageId}`, {
        params: {
            fields: 'instagram_business_account{id,username,name}',
            access_token: pageAccessToken
        },
        validateStatus: () => true
    });
    const data = res.data || {};
    if (res.status !== 200) {
        const msg = data.error?.message || data.error || `page lookup failed (${res.status})`;
        throw new Error(msg);
    }
    return data.instagram_business_account || null;
}

module.exports = {
    generateAuthLink,
    exchangeCodeForToken,
    exchangeToLongLivedUserToken,
    getManagedPages,
    getInstagramBusinessAccount,
    DEFAULT_SCOPES
};
