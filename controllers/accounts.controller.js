const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { encryptObject } = require('../utils/encryption');
const socialaccountApiDefinitions = require('../services/socialaccount-api-definitions');

const AccountsController = {};

/**
 * Clear dependent rows before account delete. Keeps post_histories (audit log).
 * @param {string} accountUuid
 * @param {import('sequelize').Transaction} [transaction]
 */
async function removeAccountDependencies(accountUuid, transaction) {
    const opts = transaction ? { transaction } : {};

    await db.PostAccount.destroy({ where: { accountUuid }, ...opts });

    if (db.Metric) {
        await db.Metric.destroy({ where: { accountUuid }, ...opts });
    }
    if (db.Audience) {
        await db.Audience.destroy({ where: { accountUuid }, ...opts });
    }
    if (db.FacebookInsight) {
        await db.FacebookInsight.destroy({ where: { accountUuid }, ...opts });
    }
    if (db.ImportedPost) {
        await db.ImportedPost.destroy({ where: { accountUuid }, ...opts });
    }
    if (db.PostVersion) {
        await db.PostVersion.update(
            { accountUuid: '' },
            { where: { accountUuid }, ...opts }
        );
    }
}

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
            active: account.active,
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
 * Update account (active only)
 * @route PUT /dashboard/accounts/:uuid
 * @route PUT /api/accounts/:uuid
 * @body { boolean } active - Set account active (true/false) for Activate/Deactivate
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

        if (typeof req.body.active === 'boolean') {
            account.active = req.body.active;
        }

        await account.save();

        if (req.path.startsWith('/api/')) {
            return res.json({
                success: true,
                message: 'Account updated successfully',
                data: {
                    uuid: account.uuid,
                    active: account.active
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
            active: account.active,
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
 * Remove a linked Facebook account (OAuth Page connection).
 * Public path so it can be linked from Meta / bookmarks; requires login and ownership.
 * @route GET /delete-account/facebook?accountUuid=...
 */
AccountsController.deleteFacebookAccount = async (req, res) => {
    try {
        const accountUuid = req.query.accountUuid || req.query.uuid;
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            req.flash('error', 'Please log in to remove your Facebook connection.');
            return res.redirect('/auth/login');
        }

        if (!accountUuid) {
            req.flash('error', 'Missing accountUuid. Open Accounts and use the remove link for your Facebook Page.');
            return res.redirect('/dashboard/accounts');
        }

        const account = await db.Account.findOne({
            where: { uuid: accountUuid, provider: 'facebook' }
        });

        if (!account) {
            req.flash('error', 'Facebook account not found or it is not a Facebook connection.');
            return res.redirect('/dashboard/accounts');
        }

        const project = await db.Project.findOne({
            where: { uuid: account.projectUuid, userUuid }
        });

        if (!project) {
            req.flash('error', 'You do not have permission to remove this account.');
            return res.redirect('/dashboard/accounts');
        }

        const projectUuid = account.projectUuid;
        const removedUuid = account.uuid;

        await removeAccountDependencies(removedUuid);

        await account.destroy();

        logger.info('Facebook account deleted', {
            accountUuid: removedUuid,
            projectUuid,
            userUuid
        });

        req.flash('success', 'Facebook account has been disconnected and removed.');
        return res.redirect('/dashboard/accounts/' + projectUuid);
    } catch (error) {
        logger.error('deleteFacebookAccount error:', error);
        req.flash('error', 'Failed to remove Facebook account.');
        return res.redirect('/dashboard/accounts');
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

        const accountUuid = account.uuid;
        await removeAccountDependencies(accountUuid);

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

