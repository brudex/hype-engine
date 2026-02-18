const crypto = require('crypto');
const logger = require('../../../utils/logger');

/**
 * Credentials: { clientId, clientSecret } (from LinkedIn app).
 * @typedef {{ clientId: string, clientSecret: string }} LinkedInAppCredentials
 */

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_ME_URL = 'https://api.linkedin.com/v2/me';

/** Default OAuth scopes: r_liteprofile (basic profile), w_member_social (share). Omit r_emailaddress unless your app has that product in the LinkedIn Developer Portal. */
const DEFAULT_SCOPE = 'r_liteprofile w_member_social';

/**
 * Generate OAuth 2.0 authorization URL and CSRF state. Caller must store state (e.g. in placeholder account data) and validate on callback.
 * @param {LinkedInAppCredentials} credentials - { clientId, clientSecret }
 * @param {string} callbackUrl - Full callback URL (must match LinkedIn app redirect_uri)
 * @param {string} [scope] - Optional scope string (default: r_liteprofile w_member_social)
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
    console.log('LinkedIn auth link:', url);
    console.log('LinkedIn state:', state);
    logger.info('LinkedIn auth link:', { url, state });
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

    const res = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        logger.error('LinkedIn token exchange failed', { status: res.status, data });
        const errMsg = data.error_description || data.error || res.statusText || 'Token exchange failed';
        throw new Error(errMsg);
    }
    if (!data.access_token) throw new Error('LinkedIn did not return an access_token');
    return {
        access_token: data.access_token,
        expires_in: data.expires_in != null ? data.expires_in : 5184000
    };
}

/**
 * Get current member id from LinkedIn (for storing provider_user_id).
 * @param {string} accessToken - Bearer token
 * @returns {Promise<{ id: string }>}
 */
async function getProfile(accessToken) {
    const res = await fetch(LINKEDIN_ME_URL, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        logger.error('LinkedIn /v2/me failed', { status: res.status, data });
        const errMsg = data.message || data.error || res.statusText || 'Profile fetch failed';
        throw new Error(errMsg);
    }
    if (!data.id) throw new Error('LinkedIn profile did not return id');
    return { id: data.id };
}

module.exports = {
    generateAuthLink,
    exchangeCodeForToken,
    getProfile
};
