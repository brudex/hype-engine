const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const ReportsController = {};

/**
 * Render reports page
 * @route GET /dashboard/reports
 * @route GET /dashboard/reports/:projectUuid
 */
ReportsController.index = async (req, res) => {
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

        res.render('dashboard/reports/index', {
            projectUuid: projectUuid || null,
            currentPage: 'reports',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Reports index error:', error);
        req.flash('error', 'Failed to load reports');
        res.redirect('/dashboard/projects');
    }
};

/**
 * Get reports data for a project
 * @route POST /dashboard/api/reports/project/:projectUuid
 */
ReportsController.getReports = async (req, res) => {
    try {
        console.log('Get reports payload', req.body);
        // Get projectUuid from URL params or body (prefer URL params)
        const projectUuid = req.params.projectUuid || req.body.projectUuid;
        const { startDate, endDate, selectedAccounts } = req.body;
        const userUuid = req.user?.uuid;

        if (!projectUuid) {
            return res.status(400).json({
                success: false,
                message: 'Project UUID is required'
            });
        }

        // Verify project belongs to user
        const project = await db.Project.findOne({
            where: {
                uuid: projectUuid,
                userUuid: userUuid
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Parse dates from ISO strings and convert to DATEONLY format (YYYY-MM-DD)
        const startDateObj = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDateObj = endDate ? new Date(endDate) : new Date();
        const start = startDateObj.toISOString().split('T')[0];
        const end = endDateObj.toISOString().split('T')[0];

        // Build where clause for accounts
        const accountWhere = {
            projectUuid: projectUuid
        };
        // Filter by selected accounts if provided
        if (selectedAccounts && Array.isArray(selectedAccounts) && selectedAccounts.length > 0) {
            accountWhere.uuid = {
                [Op.in]: selectedAccounts
            };
        }

        // Get accounts for the project
        const accounts = await db.Account.findAll({
            where: accountWhere,
            order: [['name', 'ASC']]
        });

        // Get metrics for all accounts in the project
        const metricsWhere = {
            projectUuid: projectUuid,
            date: {
                [Op.between]: [start, end]
            }
        };
        // Filter by selected accounts if provided
        if (selectedAccounts && Array.isArray(selectedAccounts) && selectedAccounts.length > 0) {
            metricsWhere.accountUuid = {
                [Op.in]: selectedAccounts
            };
        }

        const metrics = await db.Metric.findAll({
            where: metricsWhere,
            include: [{
                model: db.Account,
                as: 'account',
                attributes: ['uuid', 'name', 'username', 'provider']
            }],
            order: [['date', 'ASC']]
        });

        // Get audience data
        const audienceWhere = {
            projectUuid: projectUuid,
            date: {
                [Op.between]: [start, end]
            }
        };
        // Filter by selected accounts if provided
        if (selectedAccounts && Array.isArray(selectedAccounts) && selectedAccounts.length > 0) {
            audienceWhere.accountUuid = {
                [Op.in]: selectedAccounts
            };
        }

        const audience = await db.Audience.findAll({
            where: audienceWhere,
            include: [{
                model: db.Account,
                as: 'account',
                attributes: ['uuid', 'name', 'username', 'provider']
            }],
            order: [['date', 'ASC']]
        });

        // Get Facebook insights for Facebook accounts
        // Include 'facebook' provider as well (seeder uses facebook, facebook_page, facebook_group)
        const facebookAccountUuids = accounts
            .filter(acc => acc.provider === 'facebook' || acc.provider === 'facebook_page' || acc.provider === 'facebook_group')
            .map(acc => acc.uuid);

        let facebookInsights = [];
        if (facebookAccountUuids.length > 0) {
            const insightsWhere = {
                projectUuid: projectUuid,
                accountUuid: {
                    [Op.in]: facebookAccountUuids
                },
                date: {
                    [Op.between]: [start, end]
                }
            };
            // Filter by selected accounts if provided
            if (selectedAccounts && Array.isArray(selectedAccounts) && selectedAccounts.length > 0) {
                // Only include Facebook accounts that are in selectedAccounts
                const selectedFacebookAccounts = facebookAccountUuids.filter(uuid => 
                    selectedAccounts.includes(uuid)
                );
                if (selectedFacebookAccounts.length > 0) {
                    insightsWhere.accountUuid = {
                        [Op.in]: selectedFacebookAccounts
                    };
                } else {
                    // No selected Facebook accounts, return empty
                    insightsWhere.accountUuid = {
                        [Op.in]: []
                    };
                }
            }

            // Debug logging
            console.log('Facebook Insights Query:', {
                facebookAccountUuids,
                insightsWhere,
                start,
                end
            });

            facebookInsights = await db.FacebookInsight.findAll({
                where: insightsWhere,
                include: [{
                    model: db.Account,
                    as: 'account',
                    attributes: ['uuid', 'name', 'username', 'provider'],
                    required: false // Use LEFT JOIN to include insights even if account is missing
                }],
                order: [['date', 'ASC']]
            });

            console.log('Facebook Insights Found:', facebookInsights.length);
        } else {
            console.log('No Facebook accounts found for project:', projectUuid);
        }

        // Format response
        const report = {
            project: {
                uuid: project.uuid,
                name: project.name
            },
            period: {
                start_date: start,
                end_date: end
            },
            accounts: accounts.map(acc => ({
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider
            })),
            metrics: metrics.map(m => ({
                accountUuid: m.accountUuid,
                account: m.account ? {
                    uuid: m.account.uuid,
                    name: m.account.name,
                    username: m.account.username,
                    provider: m.account.provider
                } : null,
                date: m.date,
                data: m.data
            })),
            audience: audience.map(a => ({
                accountUuid: a.accountUuid,
                account: a.account ? {
                    uuid: a.account.uuid,
                    name: a.account.name,
                    username: a.account.username,
                    provider: a.account.provider
                } : null,
                date: a.date,
                total: a.total
            })),
            facebook_insights: facebookInsights.map(fi => ({
                accountUuid: fi.accountUuid,
                account: fi.account ? {
                    uuid: fi.account.uuid,
                    name: fi.account.name,
                    username: fi.account.username,
                    provider: fi.account.provider
                } : null,
                date: fi.date,
                type: fi.type,
                value: fi.value
            }))
        };

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        logger.error('Get reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports',
            error: error.message
        });
    }
};

module.exports = ReportsController;

