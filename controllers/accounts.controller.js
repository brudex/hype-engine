const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

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

        res.render('dashboard/accounts/index', {
            accounts: formattedAccounts,
            is_configured_service: isConfiguredService,
            is_service_active: isServiceActive,
            projectUuid: projectUuid,
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

module.exports = AccountsController;

