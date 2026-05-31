const db = require('../../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { encryptObject } = require('../../utils/encryption');
const twitterPlatform = require('../../services/platform/twitter');
const linkedinPlatform = require('../../services/platform/linkedin');
const facebookPlatform = require('../../services/platform/facebook');

const IntegrationController = {};
const siteUrl = (process.env.SITEURL || 'https://hypeengine.cachetechs.com').replace(/\/+$/, '');

/**
 * Handle X (Twitter) OAuth: load config and generate auth link. Does not redirect or create account.
 * @param {string} projectUuid - Project UUID
 * @returns {Promise<{ redirectUrl: string, provider: string, oauth_token: string, oauth_token_secret: string }>} - Data for placeholder account and redirect
 * @throws {Error} On missing config or generateAuthLink failure
 */
async function handleTwitterLinkGeneration(projectUuid) {
    const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
    if (!oauthService || !oauthService.configuration) {
        logger.warn('X connect: Twitter OAuth not configured', { hasService: !!oauthService, hasConfig: !!(oauthService && oauthService.configuration) });
        const reason = !oauthService ? 'OAuth service "twitter" not found in database.' : 'OAuth service "twitter" has no configuration saved.';
        throw new Error('Twitter (X) is not configured. ' + reason + ' Go to Dashboard → OAuth Connect, add Twitter, and enter Consumer Key and Consumer Secret from the X Developer Portal.');
    }
    let config = oauthService.configuration;
    if (typeof config === 'string') config = JSON.parse(config);
    const appKey = config.consumer_key || config.client_id;
    const appSecret = config.consumer_secret || config.client_secret;

    if (!appKey || !appSecret) {
        logger.warn('X connect: missing credentials', { hasAppKey: !!appKey, hasAppSecret: !!appSecret });
        const missing = [];
        if (!appKey) missing.push('Consumer Key (consumer_key or client_id)');
        if (!appSecret) missing.push('Consumer Secret (consumer_secret or client_secret)');
        throw new Error('Twitter (X) credentials incomplete. Missing: ' + missing.join(', ') + '. Edit the Twitter service in OAuth Connect and save both values from the X Developer Portal.');
    }
    const callbackUrl = siteUrl + '/integrations/x/callback';
    logger.info('X connect: generating auth link', { callbackUrl, baseUrl: siteUrl });
    const { url, oauth_token, oauth_token_secret } = await twitterPlatform.generateAuthLink(
        { appKey, appSecret },
        callbackUrl
    );
    const placeholderProviderId = 'pending-' + oauth_token;
    const placeholderName = 'X (pending)';
    return {
        redirectUrl: url,
        provider: 'twitter',
        oauth_token,
        providerId: placeholderProviderId,
        name: placeholderName,
        token: oauth_token,
        oauth_token_secret,
        data: { oauth_token, oauth_token_secret }
    };
}

/**
 * Handle LinkedIn OAuth: load config and generate auth link. Does not redirect or create account.
 * @param {string} projectUuid - Project UUID
 * @returns {Promise<{ redirectUrl: string, provider: string, state: string }>} - Data for placeholder account and redirect
 * @throws {Error} On missing config or link generation failure
 */
async function handleLinkedInLinkGeneration(projectUuid) {
    const oauthService = await db.OauthService.findOne({ where: { name: 'linkedin' } });
    if (!oauthService || !oauthService.configuration) {
        logger.warn('LinkedIn connect: OAuth not configured', { hasService: !!oauthService, hasConfig: !!(oauthService && oauthService.configuration) });
        const reason = !oauthService ? 'OAuth service "linkedin" not found in database.' : 'OAuth service "linkedin" has no configuration saved.';
        throw new Error('LinkedIn is not configured. ' + reason + ' Go to Dashboard → OAuth Connect, add LinkedIn, and enter Client ID and Client Secret.');
    }
    let config = oauthService.configuration;
    if (typeof config === 'string') config = JSON.parse(config);
    const clientId = config.client_id || config.clientId;
    const clientSecret = config.client_secret || config.clientSecret;
    if (!clientId || !clientSecret) {
        throw new Error('LinkedIn credentials incomplete. Enter Client ID and Client Secret in OAuth Connect.');
    }
    const callbackUrl = siteUrl + '/integrations/linkedin/callback?projectUuid=' + projectUuid;
    logger.info('LinkedIn connect: generating auth link', { callbackUrl });
    const { url, state } = linkedinPlatform.generateAuthLink(
        { clientId, clientSecret },
        callbackUrl
    );
    const placeholderProviderId = 'pending-' + state;
    const placeholderName = 'LinkedIn (pending)';
    console.log('LinkedIn auth link:', url);
    console.log('LinkedIn state:', state);
    logger.info('LinkedIn auth link:', { url, state });
    logger.info('LinkedIn auth link:', { url, state });
    return {
        redirectUrl: url,
        provider: 'linkedin',
        token: state,
        providerId: placeholderProviderId,
        name: placeholderName,
        state,
        data: { state }
    };
}

/**
 * Facebook OAuth 2.0: build auth URL with state; redirect_uri has no query (must match Meta app settings).
 * @param {string} projectUuid
 */
async function handleFacebookLinkGeneration(projectUuid) {
    const oauthService = await db.OauthService.findOne({ where: { name: 'facebook' } });
    if (!oauthService || !oauthService.configuration) {
        const reason = !oauthService
            ? 'OAuth service "facebook" not found in database.'
            : 'OAuth service "facebook" has no configuration saved.';
        throw new Error('Facebook is not configured. ' + reason + ' Go to Dashboard → OAuth Connect, add Facebook, and enter App ID and App Secret.');
    }
    let config = oauthService.configuration;
    if (typeof config === 'string') config = JSON.parse(config);
    const appId = config.app_id || config.client_id;
    const appSecret = config.app_secret || config.client_secret;
    const apiVersion = config.api_version || 'v24.0';
    if (!appId || !appSecret) {
        throw new Error('Facebook credentials incomplete. Enter App ID and App Secret in OAuth Connect.');
    }
    const callbackUrl =
        String(config.redirect_uri || '').trim() || siteUrl + '/integrations/facebook/callback';
    const { url, state } = facebookPlatform.generateAuthLink({
        appId,
        redirectUri: callbackUrl,
        apiVersion
    });
    const placeholderProviderId = 'pending-' + state;
    const placeholderName = 'Facebook (pending)';
    return {
        redirectUrl: url,
        provider: 'facebook',
        token: state,
        providerId: placeholderProviderId,
        name: placeholderName,
        state,
        data: { state }
    };
}

/**
 * Start connect flow for a platform and project.
 * Validates project ownership and redirects to OAuth provider or dashboard accounts.
 * @route GET /dashboard/integrations/:platformName/connect/:projectUuid
 */
IntegrationController.connectIntegration = async (req, res) => {
    try {
        const { platformName, projectUuid } = req.params;
        logger.info('connectIntegration', { platformName, projectUuid });
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            req.flash('error', 'Please log in to connect an account');
            return res.redirect('/auth/login');
        }

        if (!platformName || !projectUuid) {
            req.flash('error', 'Invalid integration or project. Required: platformName and projectUuid in URL. Received: platformName=' + (platformName || '(missing)') + ', projectUuid=' + (projectUuid || '(missing)') + '. Check the link that brought you here.');
            return res.redirect('/dashboard/error');
        }

        const project = await db.Project.findOne({
            where: { uuid: projectUuid }
        });
        if (!project) {
            req.flash('error', 'Project not found. projectUuid=' + projectUuid + ' does not exist or you do not have access. Go to Projects and open the project first, then try Connect again.');
            return res.redirect('/dashboard/error');
        }

        const platform = (platformName || '').toLowerCase();
        logger.info('Oauth Connect Request', { platform, projectUuid, userUuid });

        let linkResult = null;
        logger.info('Generating Link for Platform >>>>', { platform });
        if (platform === 'twitter' || platform === 'x') {
            linkResult = await handleTwitterLinkGeneration(projectUuid);
        } else if (platform === 'linkedin') {
            linkResult = await handleLinkedInLinkGeneration(projectUuid);
        } else if (platform === 'facebook') {
            linkResult = await handleFacebookLinkGeneration(projectUuid);
        }
        logger.info('Connect Integration LinkResult >>>>', { linkResult });
        console.log('Connect Integration LinkResult >>>>', linkResult);
        if (linkResult) {
            const { redirectUrl, provider } = linkResult;
            let placeholderAccount = await db.Account.findOne({
                where: {
                    projectUuid,
                    provider,
                    [Op.or]: [
                        { authorized: false },
                        { providerId: { [Op.like]: 'pending-%' } }
                    ]
                }
            });
            logger.info('LinkResult Data >>>>', { linkResult });
            
            console.log('LinkResult Data >>>>', linkResult);
            if (!placeholderAccount) {
                placeholderAccount = await db.Account.create({
                    uuid: uuidv4(),
                    projectUuid,
                    name: linkResult.name,
                    username: null,
                    provider,
                    providerId: linkResult.providerId,
                    authMethod: 'oauth',
                    accessToken: linkResult.token,
                    apiKey: encryptObject({}),
                    authorized: false,
                    active: false,
                    data: linkResult.data,
                    media: null
                });
            } else {
                placeholderAccount.providerId = linkResult.providerId;
                placeholderAccount.data = linkResult.data;
                placeholderAccount.authorized = false;
                placeholderAccount.accessToken =
                    linkResult.token || (provider === 'linkedin' || provider === 'facebook' ? 'pending' : placeholderAccount.accessToken);
                placeholderAccount.active = false;
                placeholderAccount.name = linkResult.name;
                placeholderAccount.providerId = linkResult.providerId;
                await placeholderAccount.save();
            }
            logger.info('Connect: redirecting to provider', { provider, projectUuid, accountUuid: placeholderAccount.uuid });
            return res.redirect(redirectUrl);
        }
        req.flash('error', 'Connect is not supported for this platform. Supported: Twitter/X, LinkedIn, Facebook.');
        return res.redirect('/dashboard/error');
    } catch (error) {
        logger.error('Connect integration error:', error);
        const errMsg = (error && error.message) ? error.message : String(error);
        req.flash('error', errMsg);
        return res.redirect('/dashboard/error');
    }
};

module.exports = IntegrationController;
