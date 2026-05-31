const crypto = require('crypto');
const db = require('../../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { encryptObject } = require('../../utils/encryption');
const twitterPlatform = require('../../services/platform/twitter');
const linkedinPlatform = require('../../services/platform/linkedin');
const facebookPlatform = require('../../services/platform/facebook');

/** Must match `integration.controller.js` — same string used in authorize `redirect_uri` and token exchange. */
const siteUrl = (process.env.SITEURL || 'https://hypeengine.cachetechs.com').replace(/\/+$/, '');

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
                accountTier: 'Free',
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

/**
 * LinkedIn OAuth 2.0 callback. Validates state (CSRF), exchanges code for token, fetches profile, saves account.
 * @route GET /integrations/linkedin/callback
 */
CallbackController.linkedIn = async (req, res) => {
    try {
        const { code, state, projectUuid: queryProjectUuid, error: oauthError, error_description } = req.query;

        if (oauthError || error_description) {
            logger.warn('LinkedIn OAuth callback: user denied or error', { oauthError, error_description });
            req.flash('error', error_description || oauthError || 'LinkedIn authorization was denied.');
            return res.redirect(302, '/dashboard/accounts');
        }

        if (!code || !state) {
            logger.warn('LinkedIn OAuth callback: missing code or state', req.query);
            req.flash('error', 'Missing authorization code or state. Please try connecting again.');
            return res.redirect(302, '/dashboard/accounts');
        }

        const placeholderAccount = await db.Account.findOne({
            where: {projectUuid: queryProjectUuid, provider: 'linkedin'},
            attributes: ['uuid', 'projectUuid', 'data']
        });
        if (!placeholderAccount) {
            logger.warn('LinkedIn OAuth callback: no placeholder found for state (and projectUuid if provided)', { stateLength: state.length, queryProjectUuid: queryProjectUuid || null });
            req.flash('error', 'Invalid or expired state. Please try connecting again.');
            return res.redirect(302, '/dashboard/error');
        }

        const projectUuid = placeholderAccount.projectUuid;
        const oauthService = await db.OauthService.findOne({ where: { name: 'linkedin' } });
        if (!oauthService || !oauthService.configuration) {
            req.flash('error', 'LinkedIn OAuth is not configured.');
            return res.redirect(302, '/dashboard/accounts/connect-status/' + placeholderAccount.uuid);
        }
        let config = oauthService.configuration;
        if (typeof config === 'string') config = JSON.parse(config);
        const clientId = config.client_id || config.clientId;
        const clientSecret = config.client_secret || config.clientSecret;
        if (!clientId || !clientSecret) {
            req.flash('error', 'LinkedIn OAuth credentials missing.');
            return res.redirect(302, '/dashboard/accounts/connect-status/' + placeholderAccount.uuid);
        }

        const redirectUri =
            siteUrl + '/integrations/linkedin/callback?projectUuid=' + encodeURIComponent(queryProjectUuid);
        const tokenResponse = await linkedinPlatform.exchangeCodeForToken(
            code,
            redirectUri,
            { clientId, clientSecret }
        );
        const { access_token, expires_in, id_token, refresh_token } = tokenResponse;

        let profile = linkedinPlatform.getProfileFromIdToken(id_token);
        if (!profile) {
            profile = await linkedinPlatform.getProfile(access_token);
        }
        const providerId = String(profile.id);
        const displayName = profile.name || 'LinkedIn ' + providerId;

        const account = await db.Account.findOne({ where: { uuid: placeholderAccount.uuid } });
        if (!account) {
            req.flash('error', 'Account not found.');
            return res.redirect(302, '/dashboard/error');
        }
        const expiresAt = expires_in != null ? new Date(Date.now() + expires_in * 1000).toISOString() : null;
        const oauthData = {
            access_token,
            expires_in,
            profile: profile,
            expires_at: expiresAt,
            refresh_token: refresh_token || undefined
        };
        account.accessToken = JSON.stringify(oauthData);
        account.data = oauthData;
        account.providerId = providerId;
        account.name = displayName;
        account.username = displayName;
        account.projectUuid = projectUuid;
        account.provider = 'linkedin';
        account.authMethod = 'oauth';
        account.apiKey = '';
        account.authorized = true;
        account.active = true;
        await account.save();

        logger.info('LinkedIn account connected', { accountUuid: account.uuid, providerId, projectUuid });
        req.flash('success', 'LinkedIn account has been successfully connected for this project. You can now use this account to post.');
        return res.redirect(302, '/dashboard/accounts/connect-status/' + account.uuid);
    } catch (err) {
        logger.error('LinkedIn OAuth callback error', { message: err?.message });
        req.flash('error', err?.message || 'LinkedIn connection failed. Please try again.');
        const state = req.query && req.query.state;
        const queryProjectUuid = req.query && req.query.projectUuid;
        let redirectUrl = '/dashboard/accounts';
        if (state) {
            const pendingWhere = { provider: 'linkedin', providerId: 'pending-' + state };
            if (queryProjectUuid) pendingWhere.projectUuid = queryProjectUuid;
            const pending = await db.Account.findOne({
                where: pendingWhere,
                attributes: ['uuid']
            });
            if (pending && pending.uuid) redirectUrl = '/dashboard/accounts/connect-status/' + pending.uuid;
        }
        return res.redirect(302, redirectUrl);
    }
};

/**
 * Facebook OAuth callback.
 * Stores each connected Facebook Page as provider=facebook and each linked IG business account as provider=instagram.
 * @route GET /integrations/facebook/callback
 */
CallbackController.facebook = async (req, res) => {
    try {
        const rawCode = req.query.code;
        const rawState = req.query.state;
        const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
        const state = Array.isArray(rawState) ? rawState[0] : rawState;
        const { error: oauthError, error_description, error_reason } = req.query;

        logger.info('Facebook OAuth callback received', {
            queryKeys: Object.keys(req.query || {}),
            hasCode: !!code,
            codeLength: code ? String(code).length : 0,
            hasState: !!state,
            stateLength: state ? String(state).length : 0
        });

        if (oauthError || error_reason) {
            logger.warn('Facebook OAuth callback: denied or error', { oauthError, error_reason, error_description });
            req.flash('error', error_description || oauthError || 'Facebook authorization was denied.');
            return res.redirect(302, '/dashboard/accounts');
        }
        if (!code || !state) {
            logger.warn('Facebook OAuth callback: missing code or state', req.query);
            req.flash('error', 'Missing authorization code or state. Please try connecting again.');
            return res.redirect(302, '/dashboard/accounts');
        }

        const placeholderAccount = await db.Account.findOne({
            where: { provider: 'facebook', providerId: 'pending-' + state },
            attributes: ['uuid', 'projectUuid']
        });
        if (!placeholderAccount) {
            logger.warn('Facebook OAuth callback: placeholder not found', {
                statePrefix: String(state).slice(0, 8),
                providerId: 'pending-' + state
            });
            req.flash('error', 'Invalid or expired state. Please try connecting again.');
            return res.redirect(302, '/dashboard/error');
        }

        const projectUuid = placeholderAccount.projectUuid;
        const oauthService = await db.OauthService.findOne({ where: { name: 'facebook' } });
        if (!oauthService || !oauthService.configuration) {
            logger.warn('Facebook OAuth callback: oauth service not configured');
            req.flash('error', 'Facebook OAuth is not configured.');
            return res.redirect(302, '/dashboard/accounts/connect-status/' + placeholderAccount.uuid);
        }
        let config = oauthService.configuration;
        if (typeof config === 'string') config = JSON.parse(config);
        const appId = String(config.app_id || config.client_id || '').trim();
        const appSecret = String(config.app_secret || config.client_secret || '').trim();
        const apiVersion = String(config.api_version || 'v19.0').trim();
        const redirectUri =
            String(config.redirect_uri || '').trim() || siteUrl + '/integrations/facebook/callback';
        if (!appId || !appSecret) {
            logger.warn('Facebook OAuth callback: missing app credentials');
            req.flash('error', 'Facebook App ID or App Secret missing.');
            return res.redirect(302, '/dashboard/accounts/connect-status/' + placeholderAccount.uuid);
        }

        logger.info('Facebook OAuth callback: exchanging code', {
            redirectUri,
            statePrefix: String(state).slice(0, 8),
            placeholderUuid: placeholderAccount.uuid
        });

        const shortLived = await facebookPlatform.exchangeCodeForToken(code, redirectUri, appId, appSecret, apiVersion);
        logger.info('Facebook OAuth callback: short-lived token received', {
            expiresIn: shortLived.expires_in ?? null
        });

        const longLived = await facebookPlatform.exchangeToLongLivedUserToken(
            shortLived.access_token,
            appId,
            appSecret,
            apiVersion
        );
        logger.info('Facebook OAuth callback: long-lived token ready', {
            expiresIn: longLived.expires_in ?? null,
            usedShortLivedFallback: longLived.expires_in == null
        });

        const permissions = await facebookPlatform.getGrantedPermissions(longLived.access_token, apiVersion);

        const pages = await facebookPlatform.getManagedPages(longLived.access_token, apiVersion);
        if (!pages.length) {
            logger.warn('Facebook OAuth callback: no pages — connect-status will show placeholder', {
                placeholderUuid: placeholderAccount.uuid,
                placeholderName: 'Facebook (pending)',
                projectUuid,
                grantedPermissions: permissions.granted,
                missingRequiredPermissions: permissions.missingRequired
            });
            let flashMsg =
                'No Facebook Pages found for this account. On the Facebook permission screen, select the Page(s) you manage (e.g. HypeEngine) and allow all requested permissions.';
            if (permissions.missingRequired.length) {
                flashMsg +=
                    ' Missing permissions: ' +
                    permissions.missingRequired.join(', ') +
                    '. Disconnect and connect again — we re-request permissions each time.';
            }
            req.flash('error', flashMsg);
            return res.redirect(302, '/dashboard/accounts/connect-status/' + placeholderAccount.uuid);
        }

        logger.info('Facebook OAuth callback: saving connected accounts', {
            pageCount: pages.length,
            pageNames: pages.map((p) => p.name || p.id)
        });

        const userExpiresAt =
            longLived.expires_in != null ? new Date(Date.now() + longLived.expires_in * 1000).toISOString() : null;

        const connectedAccounts = [];
        let reusedPlaceholder = false;

        for (const page of pages) {
            const pageId = String(page.id);
            const pageName = page.name || ('Facebook Page ' + pageId);
            const pageAccessToken = page.access_token;

            let fbAccount = await db.Account.findOne({ where: { provider: 'facebook', providerId: pageId } });
            if (!fbAccount && !reusedPlaceholder) {
                fbAccount = await db.Account.findOne({ where: { uuid: placeholderAccount.uuid } });
                reusedPlaceholder = true;
            }
            if (!fbAccount) {
                fbAccount = await db.Account.create({
                    uuid: uuidv4(),
                    projectUuid,
                    name: pageName,
                    username: pageName,
                    provider: 'facebook',
                    providerId: pageId,
                    authMethod: 'oauth',
                    accessToken: '',
                    apiKey: '',
                    authorized: false,
                    active: false,
                    data: null,
                    media: null
                });
            }

            const fbData = {
                access_token: pageAccessToken,
                page_id: pageId,
                page_name: pageName,
                user_access_token: longLived.access_token,
                user_expires_at: userExpiresAt,
                api_version: apiVersion
            };
            fbAccount.projectUuid = projectUuid;
            fbAccount.provider = 'facebook';
            fbAccount.providerId = pageId;
            fbAccount.name = pageName;
            fbAccount.username = pageName;
            fbAccount.authMethod = 'oauth';
            fbAccount.accessToken = JSON.stringify(fbData);
            fbAccount.data = fbData;
            fbAccount.apiKey = '';
            fbAccount.authorized = true;
            fbAccount.active = true;
            await fbAccount.save();
            connectedAccounts.push({ provider: 'facebook', uuid: fbAccount.uuid, name: pageName });

            let igBusiness = null;
            try {
                igBusiness = await facebookPlatform.getInstagramBusinessAccount(pageId, pageAccessToken, apiVersion);
            } catch (igLookupErr) {
                logger.warn('IG lookup for page failed', { pageId, message: igLookupErr.message });
            }

            if (igBusiness && igBusiness.id) {
                const instagramId = String(igBusiness.id);
                const igName = igBusiness.username || igBusiness.name || ('Instagram ' + instagramId);

                let igAccount = await db.Account.findOne({ where: { provider: 'instagram', providerId: instagramId } });
                if (!igAccount) {
                    igAccount = await db.Account.create({
                        uuid: uuidv4(),
                        projectUuid,
                        name: igName,
                        username: igBusiness.username || null,
                        provider: 'instagram',
                        providerId: instagramId,
                        authMethod: 'oauth',
                        accessToken: '',
                        apiKey: '',
                        authorized: false,
                        active: false,
                        data: null,
                        media: null
                    });
                }

                const igData = {
                    access_token: pageAccessToken,
                    instagram_id: instagramId,
                    instagram_username: igBusiness.username || null,
                    page_id: pageId,
                    page_name: pageName,
                    user_access_token: longLived.access_token,
                    user_expires_at: userExpiresAt,
                    api_version: apiVersion
                };
                igAccount.projectUuid = projectUuid;
                igAccount.provider = 'instagram';
                igAccount.providerId = instagramId;
                igAccount.name = igName;
                igAccount.username = igBusiness.username || null;
                igAccount.authMethod = 'oauth';
                igAccount.accessToken = JSON.stringify(igData);
                igAccount.data = igData;
                igAccount.apiKey = '';
                igAccount.authorized = true;
                igAccount.active = true;
                await igAccount.save();
                connectedAccounts.push({ provider: 'instagram', uuid: igAccount.uuid, name: igName });
            }
        }

        if (!connectedAccounts.length) {
            req.flash('error', 'No Facebook or Instagram accounts were connected.');
            return res.redirect(302, '/dashboard/accounts/connect-status/' + placeholderAccount.uuid);
        }

        const firstAccountUuid = connectedAccounts[0].uuid;
        req.flash('success', `Connected ${connectedAccounts.length} account(s): ${connectedAccounts.map((a) => a.provider).join(', ')}.`);
        logger.info('Facebook OAuth callback: success', {
            connectedCount: connectedAccounts.length,
            redirectTo: '/dashboard/accounts/connect-status/' + firstAccountUuid
        });
        return res.redirect(302, '/dashboard/accounts/connect-status/' + firstAccountUuid);
    } catch (err) {
        logger.error('Facebook OAuth callback error', {
            message: err?.message,
            ...(err?.response && { httpStatus: err.response.status, responseData: err.response.data })
        });
        req.flash('error', err?.message || 'Facebook connection failed. Please try again.');
        const state = req.query && req.query.state;
        let redirectUrl = '/dashboard/accounts';
        if (state) {
            const pending = await db.Account.findOne({
                where: { provider: 'facebook', providerId: 'pending-' + state },
                attributes: ['uuid']
            });
            if (pending && pending.uuid) redirectUrl = '/dashboard/accounts/connect-status/' + pending.uuid;
        }
        logger.info('Facebook OAuth callback: error redirect', { redirectUrl, statePrefix: state ? String(state).slice(0, 8) : null });
        return res.redirect(302, redirectUrl);
    }
};

module.exports = CallbackController;
