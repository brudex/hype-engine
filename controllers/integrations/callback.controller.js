const db = require('../../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { encryptObject } = require('../../utils/encryption');
const twitterPlatform = require('../../services/platform/twitter');

/**
 * Social platform OAuth/integration callbacks.
 * Handles redirects from X, Facebook, etc. after user authorizes the app.
 */
const CallbackController = {};

/**
 * Log full error details for troubleshooting (no secrets).
 */
function logXCallbackError(err, context) {
    const detail = {
        message: err && err.message,
        code: err && err.code,
        name: err && err.name,
        step: context
    };
    if (err && err.response) {
        detail.httpStatus = err.response.status;
        detail.responseData = err.response.data;
    }
    if (err && err.stack) {
        detail.stack = err.stack;
    }
    logger.error('X OAuth callback error (details for troubleshooting)', detail);
}

/**
 * X (Twitter) OAuth 1.0a callback – X redirects here with ?oauth_token=...&oauth_verifier=...
 * Always returns 200 with JSON (no flash, no redirects).
 * @route GET /dashboard/integrations/x/callback
 */
CallbackController.x = async (req, res) => {
    try {
        logger.info('X OAuth callback request', {
            queryKeys: Object.keys(req.query || {}),
            hasSession: !!(req.session && req.session.id),
            hasXConnect: !!(req.session && req.session.xConnect)
        });

        const { oauth_token, oauth_verifier, denied, error: oauthError } = req.query;

        if (oauthError || denied) {
            logger.warn('X OAuth callback: user denied or OAuth error', { oauthError, denied });
            return res.status(200).json({
                success: false,
                message: 'X authorization was denied or returned an error',
                error: oauthError || denied || 'user_denied'
            });
        }

        if (!oauth_token || !oauth_verifier) {
            logger.warn('X OAuth callback: missing params', {
                hasOauthToken: !!oauth_token,
                hasOauthVerifier: !!oauth_verifier,
                query: req.query
            });
            return res.status(200).json({
                success: false,
                message: 'Missing oauth_token or oauth_verifier in callback',
                error: 'invalid_callback_params'
            });
        }

        const stored = req.session && req.session.xConnect && req.session.xConnect[oauth_token];
        if (!stored) {
            logger.warn('X OAuth callback: request token not found in session', {
                oauthTokenPresent: !!oauth_token,
                sessionKeys: req.session && req.session.xConnect ? Object.keys(req.session.xConnect) : []
            });
            return res.status(200).json({
                success: false,
                message: 'Request token invalid or expired',
                error: 'invalid_or_expired_token'
            });
        }

        const { oauth_token_secret, projectUuid, userUuid } = stored;

        const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
        if (!oauthService || !oauthService.configuration) {
            logger.warn('X OAuth callback: Twitter not configured', {
                hasService: !!oauthService,
                hasConfig: !!(oauthService && oauthService.configuration)
            });
            return res.status(200).json({
                success: false,
                message: 'Twitter OAuth is not configured',
                error: 'twitter_not_configured'
            });
        }
        let config = oauthService.configuration;
        if (typeof config === 'string') config = JSON.parse(config);
        const appKey = config.consumer_key || config.client_id;
        const appSecret = config.consumer_secret || config.client_secret;
        if (!appKey || !appSecret) {
            logger.warn('X OAuth callback: Twitter credentials missing', { hasAppKey: !!appKey, hasAppSecret: !!appSecret });
            return res.status(200).json({
                success: false,
                message: 'Twitter OAuth has no Consumer Key or Secret',
                error: 'twitter_credentials_missing'
            });
        }

        const { accessToken, accessSecret, userId, screenName } = await twitterPlatform.exchangeRequestToken(
            oauth_token,
            oauth_token_secret,
            oauth_verifier,
            { appKey, appSecret }
        );

        delete req.session.xConnect[oauth_token];

        const providerId = String(userId);
        const name = screenName ? `@${screenName}` : `X ${providerId}`;
        const encryptedApiKey = encryptObject({});

        let account = await db.Account.findOne({
            where: { provider: 'twitter', providerId }
        });

        if (account) {
            account.accessToken = accessToken;
            account.data = account.data || {};
            account.data.accessSecret = accessSecret;
            account.name = name;
            account.username = screenName || null;
            account.projectUuid = projectUuid;
            account.authorized = true;
            account.active = true;
            account.authMethod = 'oauth';
            account.apiKey = encryptedApiKey;
            await account.save();
        } else {
            account = await db.Account.create({
                uuid: uuidv4(),
                projectUuid,
                name,
                username: screenName || null,
                provider: 'twitter',
                providerId,
                authMethod: 'oauth',
                accessToken,
                apiKey: encryptedApiKey,
                authorized: true,
                active: true,
                data: { accessSecret },
                media: null
            });
        }

        logger.info('X account connected', { accountUuid: account.uuid, screenName, userId, projectUuid });
        return res.status(200).json({
            success: true,
            message: 'X account connected',
            data: {
                accountUuid: account.uuid,
                projectUuid,
                screenName: screenName || null,
                userId: String(userId)
            }
        });
    } catch (err) {
        logXCallbackError(err, 'exchange_or_save');
        const token = (req.query && req.query.oauth_token);
        if (req.session && req.session.xConnect && token && req.session.xConnect[token]) {
            delete req.session.xConnect[token];
        }
        const httpStatus = err.response && err.response.status;
        const apiError = err.response && (err.response.data?.error || err.response.data?.errors || err.response.data?.message);
        const errMsg = err.message || String(err);
        return res.status(200).json({
            success: false,
            message: 'X callback failed',
            error: errMsg,
            details: {
                httpStatus: httpStatus || null,
                apiError: apiError != null ? (typeof apiError === 'string' ? apiError : apiError) : null,
                step: 'exchange_request_token'
            }
        });
    }
};

module.exports = CallbackController;
