const db = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

const AccountsApiController = {};

/**
 * List accounts
 * GET /api/v1/{projectUuid}/accounts
 */
AccountsApiController.list = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const userUuid = req.user.uuid;

        // Build where clause
        const where = {};
        if (projectUuid) {
            where.projectUuid = projectUuid;
        } else {
            // If no project specified, get all projects for user
            const projects = await db.Project.findAll({
                where: { userUuid },
                attributes: ['uuid']
            });
            where.projectUuid = { [Op.in]: projects.map(p => p.uuid) };
        }

        const accounts = await db.Account.findAll({
            where: where,
            order: [['createdAt', 'DESC']]
        });

        const formattedAccounts = accounts.map(account => ({
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            provider_id: account.providerId,
            authorized: account.authorized,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt
        }));

        res.json({
            success: true,
            data: formattedAccounts
        });
    } catch (error) {
        logger.error('API v1 - List accounts error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch accounts'
        });
    }
};

/**
 * Get an account
 * GET /api/v1/{projectUuid}/accounts/{accountUuid}
 */
AccountsApiController.get = async (req, res) => {
    try {
        const { accountUuid } = req.params;
        const { projectUuid } = req.params;
        const userUuid = req.user.uuid;

        const where = { uuid: accountUuid };
        if (projectUuid) {
            where.projectUuid = projectUuid;
        }

        const account = await db.Account.findOne({
            where: where
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Account not found'
            });
        }

        // Verify account belongs to user's project
        if (account.projectUuid) {
            const project = await db.Project.findOne({
                where: {
                    uuid: account.projectUuid,
                    userUuid: userUuid
                }
            });

            if (!project) {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Account not accessible'
                });
            }
        }

        const formattedAccount = {
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            provider_id: account.providerId,
            authorized: account.authorized,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt
        };

        res.json({
            success: true,
            data: formattedAccount
        });
    } catch (error) {
        logger.error('API v1 - Get account error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch account'
        });
    }
};

module.exports = AccountsApiController;
