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
 * X (Twitter) OAuth 1.0a callback – X redirects here with ?oauth_token=...&oauth_verifier=...
 * @route GET /dashboard/integrations/x/callback
 */
CallbackController.x = async (req, res) => {
    console.log('X OAuth callback request: req.query', req.query);
    logger.info('X OAuth callback request: req.query', req.query);
    const { oauth_token, oauth_verifier, denied, error: oauthError } = req.query;

    if (oauthError || denied) {
        logger.warn('X OAuth callback user denied or error:', { oauthError, denied });
        req.flash('error', 'X authorization was denied or returned an error. Reason: ' + (oauthError || denied || 'user_denied') + '. You can try connecting again from Accounts.');
        return res.redirect('/dashboard/error');
    }

    if (!oauth_token || !oauth_verifier) {
        logger.warn('X OAuth callback missing oauth_token or oauth_verifier');
        req.flash('error', 'X callback: invalid response. Missing oauth_token or oauth_verifier in the callback URL. This can happen if you did not complete the flow on X or the link was altered. Try connecting again from Accounts.');
        return res.redirect('/dashboard/error');
    }

    const stored = req.session && req.session.xConnect && req.session.xConnect[oauth_token];
    if (!stored) {
        logger.warn('X OAuth callback invalid or expired request token');
        req.flash('error', 'X callback: request token invalid or expired. The connection session may have expired. Please start again from Dashboard → Accounts → Connect account for your project.');
        return res.redirect('/dashboard/error');
    }

    const { oauth_token_secret, projectUuid, userUuid } = stored;

    try {
        const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
        if (!oauthService || !oauthService.configuration) {
            req.flash('error', 'X callback: Twitter OAuth is not configured. Configure Twitter in Dashboard → OAuth Connect, then try connecting your X account again.');
            return res.redirect('/dashboard/error');
        }
        let config = oauthService.configuration;
        if (typeof config === 'string') config = JSON.parse(config);
        const appKey = config.consumer_key || config.client_id;
        const appSecret = config.consumer_secret || config.client_secret;
        if (!appKey || !appSecret) {
            req.flash('error', 'X callback: Twitter OAuth service has no Consumer Key or Secret. Edit the Twitter service in OAuth Connect and save both values.');
            return res.redirect('/dashboard/error');
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

        logger.info('X account connected', { accountUuid: account.uuid, screenName, userId });
        return res.redirect('/dashboard/accounts?project=' + encodeURIComponent(projectUuid) + '&x_connected=1');
    } catch (err) {
        logger.error('X callback error:', err);
        if (req.session && req.session.xConnect && req.session.xConnect[oauth_token]) {
            delete req.session.xConnect[oauth_token];
        }
        const errMsg = err.response
            ? 'X API error ' + (err.response.status || '') + ': ' + (err.response.data?.error || err.message || 'Token exchange failed')
            : (err.message || String(err));
        req.flash('error', 'X callback failed. ' + errMsg + ' (Step: exchange request token for access token). Try connecting again from Accounts; if it persists, check OAuth Connect Twitter config and callback URL in the X Developer Portal.');
        return res.redirect('/dashboard/error');
    }
};

module.exports = CallbackController;
