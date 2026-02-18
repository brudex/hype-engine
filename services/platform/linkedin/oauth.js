const crypto = require('crypto');
const axios = require('axios');
const logger = require('../../../utils/logger');

/**
 * Credentials: { clientId, clientSecret } (from LinkedIn app).
 * @typedef {{ clientId: string, clientSecret: string }} LinkedInAppCredentials
 */

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_ME_URL = 'https://api.linkedin.com/v2/me';

/** Default OAuth scopes: openid + profile (name/photo), w_member_social (share). Must match scopes authorized for your app in LinkedIn Developer Portal. */
const DEFAULT_SCOPE = 'openid profile w_member_social';

/**
 * Generate OAuth 2.0 authorization URL and CSRF state. Caller must store state (e.g. in placeholder account data) and validate on callback.
 * @param {LinkedInAppCredentials} credentials - { clientId, clientSecret }
 * @param {string} callbackUrl - Full callback URL (must match LinkedIn app redirect_uri)
 * @param {string} [scope] - Optional scope string (default: openid profile w_member_social)
 * @returns {{ url: string, state: string }}
 */
function generateAuthLink(credentials, callbackUrl, scope = DEFAULT_SCOPE) {
    const clientId = credentials.clientId || credentials.client_id;
    if (!clientId) throw new Error('LinkedIn client_id is required');
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: callbackUrl,
        scope: scope.trim(),
        state
    });
    const url = `${LINKEDIN_AUTH_URL}?${params.toString()}`;
    logger.info('LinkedIn auth link', { state: state?.slice(0, 8) + '...' });
    return { url, state };
}

/**
 * Exchange authorization code for access token.
 * @param {string} code - From callback query (code)
 * @param {string} redirectUri - Must match the redirect_uri used in the auth request
 * @param {LinkedInAppCredentials} credentials - { clientId, clientSecret }
 * @returns {Promise<{ access_token: string, expires_in: number }>}
 */
async function exchangeCodeForToken(code, redirectUri, credentials) {
    const clientId = credentials.clientId || credentials.client_id;
    const clientSecret = credentials.clientSecret || credentials.client_secret;
    if (!clientId || !clientSecret) throw new Error('LinkedIn client_id and client_secret are required');

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
    }).toString();

    const res = await axios.post(LINKEDIN_TOKEN_URL, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        validateStatus: () => true
    });
    const data = res.data && typeof res.data === 'object' ? res.data : {};
    logger.info('LinkedIn token exchange', { status: res.status, error: data.error, error_description: data.error_description });
    if (res.status !== 200) {
        logger.error('LinkedIn token exchange failed', { status: res.status, error: data.error, error_description: data.error_description });
        const errMsg = data.error_description || data.error || res.statusText || 'Token exchange failed';
        throw new Error(errMsg);
    }
    if (!data.access_token) throw new Error('LinkedIn did not return an access_token');
    logger.info('LinkedIn token exchange success', { hasIdToken: !!data.id_token });
    return {
        access_token: data.access_token,
        expires_in: data.expires_in != null ? data.expires_in : 5184000,
        refresh_token: data.refresh_token || null,
        id_token: data.id_token || null
    };
}

/**
 * Decode LinkedIn OpenID id_token (JWT) to get member id and name. Avoids calling /v2/me which can return NO_VERSION/ACCESS_DENIED.
 * @param {string} idToken - id_token from token response (optional)
 * @returns {{ id: string, name?: string } | null} - id is sub claim; name if present
 */
function getProfileFromIdToken(idToken) {
    if (!idToken || typeof idToken !== 'string') return null;
    try {
        const parts = idToken.split('.');
        if (parts.length !== 3) return null;
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
        const sub = payload.sub;
        if (!sub) return null;
        const name = payload.name || (payload.given_name && payload.family_name ? `${payload.given_name} ${payload.family_name}`.trim() : null) || null;
        return { id: sub, name: name || undefined };
    } catch (e) {
        logger.warn('LinkedIn id_token decode failed', { message: e?.message });
        return null;
    }
}

/**
 * Get current member id from LinkedIn (for storing provider_user_id).
 * @param {string} accessToken - Bearer token
 * @returns {Promise<{ id: string }>}
 */
async function getProfile(accessToken) {
    const res = await axios.get(LINKEDIN_ME_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
        },
        validateStatus: () => true
    });
    const data = res.data && typeof res.data === 'object' ? res.data : {};
    logger.info('LinkedIn /v2/me', { status: res.status });
    if (res.status !== 200) {
        logger.error('LinkedIn /v2/me failed', { status: res.status, code: data.code, message: data.message });
        const errMsg = data.message || data.error || res.statusText || 'Profile fetch failed';
        throw new Error(errMsg);
    }
    if (!data.id) throw new Error('LinkedIn profile did not return id');
    return { id: data.id, name: data.localizedFirstName || data.firstName ? [data.localizedFirstName || data.firstName, data.localizedLastName || data.lastName].filter(Boolean).join(' ') : undefined };
}

module.exports = {
    generateAuthLink,
    exchangeCodeForToken,
    getProfile,
    getProfileFromIdToken
};
