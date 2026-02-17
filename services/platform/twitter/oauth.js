const { TwitterApi } = require('twitter-api-v2');
const logger = require('../../../utils/logger');

/**
 * Credentials object: { appKey, appSecret } (Consumer Key / Consumer Secret).
 * @typedef {{ appKey: string, appSecret: string }} TwitterAppCredentials
 */

/**
 * Generate OAuth 1.0a auth link for "Connect with X".
 * Caller must store oauth_token_secret (e.g. in session keyed by oauth_token) for the callback step.
 * @param {TwitterAppCredentials} credentials - { appKey, appSecret }
 * @param {string} callbackUrl - Full callback URL (must match X app settings)
 * @returns {Promise<{ url: string, oauth_token: string, oauth_token_secret: string }>}
 */
async function generateAuthLink(credentials, callbackUrl) {
    const client = new TwitterApi({
        appKey: credentials.appKey,
        appSecret: credentials.appSecret
    });

    const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(callbackUrl);
    return { url, oauth_token, oauth_token_secret };
}

/**
 * Exchange request token + verifier for permanent user access token and secret (OAuth 1.0a step 2).
 * @param {string} oauthToken - From callback query (oauth_token)
 * @param {string} oauthTokenSecret - Stored when generating the auth link
 * @param {string} oauthVerifier - From callback query (oauth_verifier)
 * @param {TwitterAppCredentials} credentials - Same app credentials used in generateAuthLink
 * @returns {Promise<{ accessToken: string, accessSecret: string, userId: string, screenName: string }>}
 */
async function exchangeRequestToken(oauthToken, oauthTokenSecret, oauthVerifier, credentials) {
    const clientUser = new TwitterApi({
        appKey: credentials.appKey,
        appSecret: credentials.appSecret,
        accessToken: oauthToken,
        accessSecret: oauthTokenSecret
    });

    try {
        const { accessToken, accessSecret, userId, screenName } = await clientUser.login(oauthVerifier);
        return { accessToken, accessSecret, userId, screenName };
    } catch (err) {
        logger.error('Twitter OAuth login failed:', err?.message || err);
        const msg = err?.message || String(err);
        throw new Error(msg.includes('verifier') || msg.includes('invalid') ? 'Invalid or expired authorization. Please try connecting again.' : `X login failed: ${msg}`);
    }
}

/**
 * Create a TwitterApi client for a connected account (e.g. to post tweets).
 * Use the account's accessToken and data.accessSecret.
 * @param {string} appKey - Consumer Key
 * @param {string} appSecret - Consumer Secret
 * @param {string} accessToken - User access token (from Account.accessToken)
 * @param {string} accessSecret - User access secret (from Account.data.accessSecret)
 * @returns {import('twitter-api-v2').TwitterApi}
 */
function createUserClient(appKey, appSecret, accessToken, accessSecret) {
    return new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret
    });
}

module.exports = {
    generateAuthLink,
    exchangeRequestToken,
    createUserClient
};
