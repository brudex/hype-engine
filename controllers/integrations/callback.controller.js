const crypto = require('crypto');
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
 * Generate CRC response_token for X webhook verification.
 * X expects exactly: { "response_token": "sha256=<base64>" }.
 * HMAC-SHA256(consumer_secret, crc_token), then base64-encode and prefix "sha256=".
 * @param {string} crc_token - Token from X (req.query.crc_token)
 * @param {string} consumer_secret - Twitter/X Consumer Secret (will be trimmed)
 * @returns {string} response_token e.g. "sha256=EqvHPHlg6ibHALsy+0r1FHXKvbaiRaoxoJSAeWOsY/o="
 */
function generateCrcResponseToken(crc_token, consumer_secret) {
    if (!crc_token || !consumer_secret) {
        throw new Error('Missing crc_token or consumer_secret');
    }
    const secret = String(consumer_secret).trim();
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(String(crc_token));
    const digestBase64 = hmac.digest('base64');
    return `sha256=${digestBase64}`;
}

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
 * X (Twitter) callback – handles:
 * 1. CRC (Challenge-Response Check): ?crc_token=...&nonce=... → { response_token: "sha256=..." }
 *    (nonce is sent by X for their tracking; we do not use it in the response.)
 * 2. OAuth 1.0a callback: ?oauth_token=...&oauth_verifier=... → connect account, return JSON
 *
 * If the X Developer Portal shows "500" or verification failed, it means X could not validate
 * our response. Check: (1) Webhook URL in X portal matches this endpoint exactly (HTTPS),
 * (2) Consumer Secret in Dashboard → OAuth Connect → Twitter is from the same X app as the webhook.
 * @route GET /integrations/x/callback
 */
CallbackController.x = async (req, res) => {
    // X portal only accepts this exact shape; extra keys can cause verification to fail (shown as 500 on X).
    const sendCrcResponse = (responseToken, errorCode) => {
        res.set('Content-Type', 'application/json');
        res.status(200);
        return res.json({ response_token: responseToken != null ? responseToken : null });
    };

    const isCrcRequest = !!(req && req.query && req.query.crc_token);

    try {
        const { crc_token, nonce, oauth_token, oauth_verifier, denied, error: oauthError } = req.query;

        logger.info('X callback request', {
            queryKeys: Object.keys(req.query || {}),
            hasCrcToken: !!crc_token,
            hasSession: !!(req.session && req.session.id),
            hasXConnect: !!(req.session && req.session.xConnect)
        });

        // CRC: X webhook verification (Challenge-Response Check)
        if (crc_token) {
            try {
                const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
                if (!oauthService || !oauthService.configuration) {
                    logger.warn('X CRC: Twitter OAuth not configured');
                    return sendCrcResponse(null, 'twitter_not_configured');
                }
                let config = oauthService.configuration;
                if (typeof config === 'string') {
                    try {
                        config = JSON.parse(config);
                    } catch (parseErr) {
                        logger.error('X CRC: configuration is not valid JSON', { message: parseErr.message });
                        return sendCrcResponse(null, 'invalid_config_format');
                    }
                }
                const consumerSecret = config && (config.consumer_secret || config.client_secret);
                if (!consumerSecret) {
                    logger.warn('X CRC: Consumer Secret missing');
                    return sendCrcResponse(null, 'consumer_secret_missing');
                }
                const responseToken = generateCrcResponseToken(crc_token, consumerSecret);
                logger.info('X CRC response sent', { nonce: nonce || null });
                return sendCrcResponse(responseToken);
            } catch (err) {
                logger.error('X CRC error (details for troubleshooting)', {
                    message: err.message,
                    code: err.code,
                    name: err.name,
                    step: 'crc_lookup_or_compute'
                });
                return sendCrcResponse(null, err.message || 'crc_failed');
            }
        }

        // OAuth 1.0a callback flow
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
        if (isCrcRequest) {
            return sendCrcResponse(null, err.message || 'crc_failed');
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
