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
 * Handle X webhook CRC (Challenge-Response Check) verification.
 * Loads Twitter OAuth config, computes response_token, returns it or an error code.
 * @param {string} crc_token - From req.query.crc_token
 * @param {string} [nonce] - From req.query.nonce (logged only)
 * @returns {Promise<{ responseToken: string | null, errorCode?: string }>}
 */
async function handleWebHookVerification(crc_token, nonce) {
    const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
    if (!oauthService || !oauthService.configuration) {
        logger.warn('X CRC: Twitter OAuth not configured');
        return { responseToken: null, errorCode: 'twitter_not_configured' };
    }
    let config = oauthService.configuration;
    if (typeof config === 'string') {
        try {
            config = JSON.parse(config);
        } catch (parseErr) {
            logger.error('X CRC: configuration is not valid JSON', { message: parseErr.message });
            return { responseToken: null, errorCode: 'invalid_config_format' };
        }
    }
    const consumerSecret = config && (config.consumer_secret || config.client_secret);
    if (!consumerSecret) {
        logger.warn('X CRC: Consumer Secret missing');
        return { responseToken: null, errorCode: 'consumer_secret_missing' };
    }
    try {
        const responseToken = generateCrcResponseToken(crc_token, consumerSecret);
        logger.info('X CRC response sent', { nonce: nonce || null });
        return { responseToken };
    } catch (err) {
        logger.error('X CRC error (details for troubleshooting)', {
            message: err.message,
            code: err.code,
            name: err.name,
            step: 'crc_lookup_or_compute'
        });
        return { responseToken: null, errorCode: err.message || 'crc_failed' };
    }
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
            const result = await handleWebHookVerification(crc_token, nonce);
            return sendCrcResponse(result.responseToken, result.errorCode);
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

        const pendingAccounts = await db.Account.findAll({
            where: { provider: 'twitter' ,accessToken: oauth_token},
            attributes: ['uuid', 'projectUuid', 'data']
        });
        const placeholderAccount = pendingAccounts[0] || null;
        if (!placeholderAccount || !placeholderAccount.data || !placeholderAccount.data.oauth_token_secret) {
            logger.warn('X OAuth callback: no account found with this request token', {
                oauthTokenPresent: !!oauth_token,
                checkedCount: pendingAccounts.length
            });
            return res.status(200).json({
                success: false,
                message: 'Request token invalid or expired',
                error: 'invalid_or_expired_token'
            });
        }

        const oauth_token_secret = placeholderAccount.data.oauth_token_secret;
        const projectUuid = placeholderAccount.projectUuid;
        const pendingAccountUuid = placeholderAccount.uuid;

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

        console.log('Calling exchangeRequestToken with: oauth_token', oauth_token);
        console.log('Calling exchangeRequestToken with: oauth_token_secret', oauth_token_secret);
        console.log('Calling exchangeRequestToken with: oauth_verifier', oauth_verifier);
        console.log('Calling exchangeRequestToken with: appKey' + appKey);
        console.log('Calling exchangeRequestToken with: appSecret' + appSecret);
        logger.info('Calling exchangeRequestToken with: oauth_token' + oauth_token);
        logger.info('Calling exchangeRequestToken with: oauth_token_secret' + oauth_token_secret);
        logger.info('Calling exchangeRequestToken with: oauth_verifier' + oauth_verifier);
        logger.info('Calling exchangeRequestToken with: appKey' + appKey);
        logger.info('Calling exchangeRequestToken with: appSecret' + appSecret);
        const { accessToken, accessSecret, userId, screenName } = await twitterPlatform.exchangeRequestToken(
            oauth_token,
            oauth_token_secret,
            oauth_verifier,
            { appKey, appSecret }
        );
        logger.info('exchangeRequestToken result: accessToken', accessToken);
        logger.info('exchangeRequestToken result: accessSecret', accessSecret);
        logger.info('exchangeRequestToken result: userId', userId);
        logger.info('exchangeRequestToken result: screenName', screenName);
        console.log('exchangeRequestToken result: accessToken', accessToken);
        console.log('exchangeRequestToken result: accessSecret', accessSecret);
        console.log('exchangeRequestToken result: userId', userId);
        console.log('exchangeRequestToken result: screenName', screenName);

        const providerId = String(userId);
        const name = screenName ? `@${screenName}` : `X ${providerId}`;

        const updateAccountWithCredentials = async (acc) => {
            const oauthData = {
                accessSecret: accessSecret,
                accessToken: accessToken,
                userId: userId,
                screenName: screenName
            };
            acc.accessToken = JSON.stringify(oauthData);
            acc.data = oauthData;
            acc.name = name;
            acc.username = screenName || null;
            acc.projectUuid = projectUuid;
            acc.providerId = providerId;
            acc.authorized = true;
            acc.active = true;
            acc.authMethod = 'oauth';
            acc.apiKey = '';
            await account.save();
        };

        let account = await db.Account.findOne({ where: { uuid: pendingAccountUuid } });
        if (account) {
            await updateAccountWithCredentials(account);
            
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
            await updateAccountWithCredentials(account);
        }

        logger.info('X account connected', { accountUuid: account.uuid, screenName, userId, projectUuid });
        console.log('X account connected', { accountUuid: account.uuid, screenName, userId, projectUuid });
        req.flash('success', name + ' has been successfully connected to X (Twitter) for this project. You can now use this account to post.');
        return res.redirect(302, '/dashboard/accounts/connect-status/' + account.uuid);
    } catch (err) {
        logger.error('X OAuth callback error', {
            message: err?.message,
            step: 'exchange_or_save',
            ...(err?.response && { httpStatus: err.response.status, responseData: err.response.data })
        });
        if (isCrcRequest) {
            return sendCrcResponse(null, err.message || 'crc_failed');
        }
        const errMsg = err.message || String(err);
        const flashMsg = typeof errMsg === 'string' && errMsg.length > 0 ? errMsg : 'X connection failed. Please try again.';
        req.flash('error', flashMsg);
        const oauthToken = req.query && req.query.oauth_token;
        let redirectUrl = '/dashboard/accounts';
        if (oauthToken) {
            const pending = await db.Account.findOne({
                where: { provider: 'twitter', accessToken: oauthToken },
                attributes: ['uuid']
            });
            if (pending && pending.uuid) redirectUrl = '/dashboard/accounts/connect-status/' + pending.uuid;
        }
        return res.redirect(302, redirectUrl);
    }
};

module.exports = CallbackController;
