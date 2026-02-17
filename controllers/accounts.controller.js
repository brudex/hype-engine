const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { encryptObject } = require('../utils/encryption');
const socialaccountApiDefinitions = require('../services/socialaccount-api-definitions');

const AccountsController = {};

/**
 * Get all accounts (optionally filtered by project)
 * @route GET /dashboard/accounts
 * @route GET /dashboard/projects/:projectUuid/accounts
 */
AccountsController.index = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const userUuid = req.user?.uuid;

        // Build where clause
        const where = {};
        if (projectUuid) {
            // Verify project belongs to user
            const project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });
            if (!project) {
                req.flash('error', 'Project not found');
                return res.redirect('/dashboard/projects');
            }
            where.projectUuid = projectUuid;
        }

        const accounts = await db.Account.findAll({
            where: where,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.Project,
                    as: 'project',
                    attributes: ['uuid', 'name']
                }
            ]
        });

        // Format accounts for frontend
        const formattedAccounts = accounts.map(account => ({
            id: account.id,
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            providerId: account.providerId,
            authorized: account.authorized,
            projectUuid: account.projectUuid,
            project: account.project ? {
                uuid: account.project.uuid,
                name: account.project.name
            } : null,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt,
            updated_at: account.updatedAt
        }));

        // Check service configuration status for this project (if projectUuid is provided)
        const serviceWhere = {};
        if (projectUuid) {
            serviceWhere.projectUuid = projectUuid;
        }
        
        const services = await db.Service.findAll({
            where: serviceWhere
        });
        const isConfiguredService = {};
        const isServiceActive = {};

        services.forEach(service => {
            isConfiguredService[service.name] = !!service.configuration;
            isServiceActive[service.name] = service.active;
        });

        // Build serializable service definitions for API key forms (same as project show)
        const serviceDefinitions = {};
        const platformNames = socialaccountApiDefinitions.getServiceNames();
        for (const name of platformNames) {
            const serviceDef = socialaccountApiDefinitions.getService(name);
            if (serviceDef && typeof serviceDef.form === 'function') {
                const formFields = serviceDef.form.call(serviceDef);
                serviceDefinitions[name] = {
                    nameLocalized: serviceDef.nameLocalized || name,
                    formFields: Array.isArray(formFields) ? formFields : []
                };
            }
        }

        res.render('dashboard/accounts/index', {
            accounts: formattedAccounts,
            is_configured_service: isConfiguredService,
            is_service_active: isServiceActive,
            projectUuid: projectUuid,
            serviceDefinitions: serviceDefinitions,
            currentPage: 'accounts',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Accounts index error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts',
            error: error.message
        });
    }
};

/**
 * Update account
 * @route PUT /dashboard/accounts/:uuid
 * @route PUT /api/accounts/:uuid
 */
AccountsController.update = async (req, res) => {
    try {
        const { uuid } = req.params;
        
        const account = await db.Account.findOne({ where: { uuid } });
        
        if (!account) {
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }
            req.flash('error', 'Account not found');
            return res.redirect('back');
        }

        // TODO: Implement account refresh logic with social provider
        // For now, just update basic info if provided
        if (req.body.name) {
            account.name = req.body.name;
        }
        if (req.body.username) {
            account.username = req.body.username;
        }

        await account.save();

        if (req.path.startsWith('/api/')) {
            return res.json({
                success: true,
                message: 'Account updated successfully',
                data: {
                    id: account.id,
                    uuid: account.uuid,
                    name: account.name,
                    username: account.username,
                    provider: account.provider,
                    authorized: account.authorized
                }
            });
        }

        req.flash('success', 'Account updated successfully');
        res.redirect('back');
    } catch (error) {
        logger.error('Account update error:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update account',
                error: error.message
            });
        }
        req.flash('error', 'Failed to update account');
        res.redirect('back');
    }
};

/**
 * Get accounts list (API)
 * @route GET /api/accounts
 */
AccountsController.getAccounts = async (req, res) => {
    try {
        const { projectUuid } = req.params;

        // Build where clause
        const where = {};
        if (projectUuid) {
            where.projectUuid = projectUuid;
        }

        const accounts = await db.Account.findAll({
            where: where,
            order: [['createdAt', 'DESC']]
        }); 

        // Format accounts for frontend
        const formattedAccounts = accounts.map(account => ({
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            providerId: account.providerId,
            authorized: account.authorized,
            projectUuid: account.projectUuid,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt,
            updated_at: account.updatedAt
        }));

        res.json({
            success: true,
            data: formattedAccounts
        });
    } catch (error) {
        logger.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts',
            error: error.message
        });
    }
};

/**
 * Get single account (API)
 * @route GET /api/accounts/:uuid
 */
AccountsController.getAccount = async (req, res) => {
    try {
        const { uuid } = req.params;
        const account = await db.Account.findOne({ where: { uuid } });
        
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: account.id,
                uuid: account.uuid,
                name: account.name,
                username: account.username,
                provider: account.provider,
                providerId: account.providerId,
                authorized: account.authorized,
                image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
                created_at: account.createdAt,
                updated_at: account.updatedAt
            }
        });
    } catch (error) {
        logger.error('Get account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account',
            error: error.message
        });
    }
};

/**
 * Delete account
 * @route DELETE /dashboard/accounts/:uuid
 * @route DELETE /api/accounts/:uuid
 */
AccountsController.delete = async (req, res) => {
    try {
        const { uuid } = req.params;
        
        const account = await db.Account.findOne({ where: { uuid } });
        
        if (!account) {
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }
            req.flash('error', 'Account not found');
            return res.redirect('back');
        }

        // TODO: Revoke token if provider supports it
        
        await account.destroy();

        if (req.path.startsWith('/api/')) {
            return res.json({
                success: true,
                message: 'Account deleted successfully'
            });
        }

        req.flash('success', 'Account deleted successfully');
        res.redirect('back');
    } catch (error) {
        logger.error('Account delete error:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete account',
                error: error.message
            });
        }
        req.flash('error', 'Failed to delete account');
        res.redirect('back');
    }
};

/**
 * Start connect flow for a platform and project.
 * Validates project ownership and redirects to dashboard accounts with project/connect context.
 * @route GET /integrations/:platformName/connect/:projectUuid
 */
AccountsController.connectIntegration = async (req, res) => {
    try {
        const { platformName, projectUuid } = req.params;
        console.log('connectIntegration', platformName, projectUuid);
        logger.info('connectIntegration', platformName, projectUuid);
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
        console.log('Oauth Connect Request for Project: project', project.dataValues);
        logger.info('Oauth Connect Request for Project: project', project.dataValues);
        if (!project) {
            req.flash('error', 'Project not found. projectUuid=' + projectUuid + ' does not exist or you do not have access. Go to Projects and open the project first, then try Connect again.');
            return res.redirect('/dashboard/error');
        }

        const platform = (platformName || '').toLowerCase();
        console.log('Oauth Connect Request for Platform: platform', platform);
        logger.info('Oauth Connect Request for Platform: platform', platform);
        // X (Twitter) OAuth 1.0a: generate auth link and redirect to X
        if (platform === 'twitter' || platform === 'x') {
            logger.info('X connect flow started', { projectUuid, userUuid });

            const twitterPlatform = require('../services/platform/twitter');
            const oauthService = await db.OauthService.findOne({ where: { name: 'twitter' } });
            if (!oauthService || !oauthService.configuration) {
                logger.warn('X connect: Twitter OAuth not configured', { hasService: !!oauthService, hasConfig: !!(oauthService && oauthService.configuration) });
                const reason = !oauthService ? 'OAuth service "twitter" not found in database.' : 'OAuth service "twitter" has no configuration saved.';
                req.flash('error', 'Twitter (X) is not configured. ' + reason + ' Go to Dashboard → OAuth Connect, add Twitter, and enter Consumer Key and Consumer Secret from the X Developer Portal.');
                return res.redirect('/dashboard/error');
            }
            let config = oauthService.configuration;
            console.log('Oauth Connect Request for OAuth Service: oauthService', oauthService.dataValues);
            logger.info('Oauth Connect Request for OAuth Service: oauthService', oauthService.dataValues);
            if (typeof config === 'string') config = JSON.parse(config);
            const appKey = config.consumer_key || config.client_id;
            const appSecret = config.consumer_secret || config.client_secret;

            const configKeys = Object.keys(config || {}).filter(k => k !== 'consumer_secret' && k !== 'client_secret');
            logger.info('X connect: using OAuth config', {
                projectUuid,
                hasAppKey: !!appKey,
                hasAppSecret: !!appSecret,
                configKeysPresent: configKeys
            });

            if (!appKey || !appSecret) {
                logger.warn('X connect: missing credentials', { hasAppKey: !!appKey, hasAppSecret: !!appSecret });
                const missing = [];
                if (!appKey) missing.push('Consumer Key (consumer_key or client_id)');
                if (!appSecret) missing.push('Consumer Secret (consumer_secret or client_secret)');
                req.flash('error', 'Twitter (X) credentials incomplete. Missing: ' + missing.join(', ') + '. Edit the Twitter service in OAuth Connect and save both values from the X Developer Portal.');
                return res.redirect('/dashboard/error');
            }
            const baseUrl = "https://hypeengine.cachetechs.com";
            const callbackUrl = baseUrl + '/integrations/x/callback';
            logger.info('X connect: generating auth link', { callbackUrl, baseUrl });

            try {
                const { url, oauth_token, oauth_token_secret } = await twitterPlatform.generateAuthLink(
                    { appKey, appSecret },
                    callbackUrl
                );

                let placeholderAccount = await db.Account.findOne({
                    where: { projectUuid, provider: 'twitter' }
                });
                if (!placeholderAccount) {
                    placeholderAccount = await db.Account.create({
                        uuid: uuidv4(),
                        projectUuid,
                        name: 'X (pending)',
                        username: null,
                        provider: 'twitter',
                        providerId: 'pending-' + oauth_token,
                        authMethod: 'oauth',
                        accessToken: oauth_token,
                        apiKey: encryptObject({}),
                        authorized: false,
                        active: false,
                        data: { oauth_token, oauth_token_secret },
                        media: null
                    });
                } else {
                    placeholderAccount.providerId = 'pending-' + oauth_token;
                    placeholderAccount.data = { oauth_token, oauth_token_secret };
                    placeholderAccount.authorized = false;
                    placeholderAccount.accessToken = oauth_token;
                    placeholderAccount.active = false;
                    await placeholderAccount.save();
                }

                logger.info('X connect: redirecting to X', { hasUrl: !!url, projectUuid, accountUuid: placeholderAccount.uuid });
                return res.redirect(url);
            } catch (err) {
                logger.error('X generateAuthLink error:', err);
                const errMsg = err.response
                    ? 'X API returned ' + (err.response.status || '') + ': ' + (err.response.data?.error || err.message || 'Request failed')
                    : (err.message || 'Failed to get X authorization link');
                req.flash('error', 'Failed to start X connection. ' + errMsg + ' Check that your callback URL in the X Developer Portal matches: ' + (req.protocol || 'https') + '://' + (req.get('host') || '') + '/dashboard/integrations/x/callback');
                return res.redirect('/dashboard/error');
            }
        }

        return res.redirect('/dashboard/accounts?project=' + encodeURIComponent(projectUuid) + '&connect=' + encodeURIComponent(platform));
    } catch (error) {
        logger.error('Connect integration error:', error);
        const errMsg = (error && error.message) ? error.message : String(error);
        req.flash('error', 'Connect integration failed. ' + errMsg + ' (Step: connectIntegration; platform=' + (req.params.platformName || '') + ', projectUuid=' + (req.params.projectUuid || '') + ')');
        res.redirect('/dashboard/error');
    }
};

/**
 * Connect status page – shown after OAuth callback with success/error flash.
 * @route GET /dashboard/accounts/connect-status/:accountUuid
 */
AccountsController.connectStatus = async (req, res) => {
    try {
        const { accountUuid } = req.params;
        const userUuid = req.user?.uuid;
        if (!userUuid) {
            req.flash('error', 'Please log in to view this page');
            return res.redirect('/auth/login');
        }
        const account = await db.Account.findOne({
            where: { uuid: accountUuid },
            include: [{ model: db.Project, as: 'project', attributes: ['uuid', 'name'] }]
        });
        if (!account) {
            req.flash('error', 'Account not found');
            return res.redirect('/dashboard/accounts');
        }
        const project = await db.Project.findOne({
            where: { uuid: account.projectUuid, userUuid }
        });
        if (!project) {
            req.flash('error', 'You do not have access to this account');
            return res.redirect('/dashboard/accounts');
        }
        const platformLabel = (account.provider || 'twitter').toLowerCase() === 'twitter' ? 'X (Twitter)' : (account.provider || 'Account');
        const isConnected = !!account.authorized;
        res.render('dashboard/accounts/connect-status', {
            layout: 'layouts/dashboard/index',
            currentPage: 'accounts',
            account: {
                uuid: account.uuid,
                name: account.name,
                username: account.username,
                provider: account.provider,
                projectUuid: account.projectUuid,
                projectName: account.project ? account.project.name : null,
                authorized: isConnected
            },
            platformLabel,
            isConnected
        });
    } catch (error) {
        logger.error('Connect status error:', error);
        req.flash('error', 'Failed to load connect status');
        res.redirect('/dashboard/accounts');
    }
};

/**
 * Save API key configuration as an Account with authMethod=apikey
 * Encrypts the configuration and stores in Account.apiKey
 * @route POST /api/accounts/configure-apikey/:platformName
 * @body {string} projectUuid - Project UUID
 * @body {object} configuration - API key fields (e.g. client_id, client_secret, tier)
 */
AccountsController.saveApiKeyConfiguration = async (req, res) => {
    try {
        const { platformName } = req.params;
        const { projectUuid, configuration } = req.body;
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!projectUuid) {
            return res.status(400).json({
                success: false,
                message: 'projectUuid is required'
            });
        }

        const provider = (platformName || '').toLowerCase();
        const serviceDef = socialaccountApiDefinitions.getService(provider);
        if (!serviceDef) {
            return res.status(400).json({
                success: false,
                message: 'Unsupported platform'
            });
        }

        const configObj = configuration && typeof configuration === 'object' ? configuration : {};
        const validation = socialaccountApiDefinitions.validateServiceConfiguration(provider, configObj);
        if (validation.error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.error
            });
        }

        const project = await db.Project.findOne({
            where: { uuid: projectUuid, userUuid }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const encryptedApiKey = encryptObject(validation.value);
        const name = serviceDef.nameLocalized || provider;
        const providerId = `apikey-${projectUuid}-${provider}`;

        let account = await db.Account.findOne({
            where: {
                projectUuid,
                provider,
                authMethod: 'apikey'
            }
        });

        if (account) {
            account.apiKey = encryptedApiKey;
            account.name = name;
            account.authorized = true;
            account.active = true;
            account.accessToken = 'apikey';
            await account.save();
        } else {
            account = await db.Account.create({
                uuid: uuidv4(),
                projectUuid,
                name,
                username: null,
                provider,
                providerId,
                authMethod: 'apikey',
                accessToken: 'apikey',
                apiKey: encryptedApiKey,
                authorized: true,
                active: true,
                data: null,
                media: null
            });
        }

        return res.json({
            success: true,
            message: 'API key configuration saved',
            data: {
                uuid: account.uuid,
                name: account.name,
                provider: account.provider,
                projectUuid: account.projectUuid
            }
        });
    } catch (error) {
        logger.error('Save API key configuration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to save API key configuration',
            error: error.message
        });
    }
};

module.exports = AccountsController;

