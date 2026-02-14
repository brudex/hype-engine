const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const DashboardController = {};

/**
 * Get dashboard
 * @route GET /dashboard
 */
DashboardController.index = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.redirect('/auth/login');
        }

        res.render('dashboard/dashboard/index', {
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Dashboard error:', error);
        res.status(500).render('error', {
            message: 'Failed to load dashboard',
            error: error.message,
            layout: 'layouts/dashboard/index'
        });
    }
};

/**
 * Dashboard error page – shows flash messages (e.g. from connectIntegration failures).
 * @route GET /dashboard/error
 */
DashboardController.errorPage = (req, res) => {
    res.render('dashboard/error', {
        layout: 'layouts/dashboard/index',
        currentPage: 'error'
    });
};

/**
 * Get global dashboard metrics (all projects)
 * @route GET /api/dashboard/global
 */
DashboardController.getGlobalMetrics = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Get all projects for user
        const projects = await db.Project.findAll({
            where: { userUuid: userUuid },
            order: [['createdAt', 'DESC']]
        });

        const projectUuids = projects.map(p => p.uuid);

        // Get aggregated metrics
        const [
            totalAccounts,
            totalPosts,
            scheduledPosts,
            publishedPosts,
            draftPosts,
            failedPosts,
            accountsByProject,
            postsByProject
        ] = await Promise.all([
            // Total accounts
            db.Account.count({
                where: { projectUuid: { [Op.in]: projectUuids } }
            }),
            // Total posts
            db.Post.count({
                where: { projectUuid: { [Op.in]: projectUuids } }
            }),
            // Scheduled posts
            db.Post.count({
                where: { 
                    projectUuid: { [Op.in]: projectUuids },
                    status: 1 // SCHEDULED
                }
            }),
            // Published posts
            db.Post.count({
                where: { 
                    projectUuid: { [Op.in]: projectUuids },
                    status: 2 // PUBLISHED
                }
            }),
            // Draft posts
            db.Post.count({
                where: { 
                    projectUuid: { [Op.in]: projectUuids },
                    status: 0 // DRAFT
                }
            }),
            // Failed posts
            db.Post.count({
                where: { 
                    projectUuid: { [Op.in]: projectUuids },
                    status: 3 // FAILED
                }
            }),
            // Accounts by project
            db.Account.findAll({
                where: { projectUuid: { [Op.in]: projectUuids } },
                attributes: [
                    'projectUuid',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
                ],
                group: ['projectUuid'],
                raw: true
            }),
            // Posts by project
            db.Post.findAll({
                where: { projectUuid: { [Op.in]: projectUuids } },
                attributes: [
                    'projectUuid',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
                ],
                group: ['projectUuid'],
                raw: true
            })
        ]);

        // Create maps for project stats
        const accountCountMap = {};
        accountsByProject.forEach(item => {
            accountCountMap[item.projectUuid] = parseInt(item.count) || 0;
        });

        const postCountMap = {};
        postsByProject.forEach(item => {
            postCountMap[item.projectUuid] = parseInt(item.count) || 0;
        });

        // Format projects with stats
        const projectsWithStats = projects.map(project => {
            const accountCount = accountCountMap[project.uuid] || 0;
            const postCount = postCountMap[project.uuid] || 0;
            
            // Determine if project needs attention (no accounts or has failed posts)
            const needsAttention = accountCount === 0 || false; // Can enhance with failed posts check
            
            return {
                uuid: project.uuid,
                name: project.name,
                description: project.description,
                imageUrl: project.imageUrl,
                accountCount: accountCount,
                postCount: postCount,
                needsAttention: needsAttention,
                createdAt: project.createdAt
            };
        });

        // Get unauthorized accounts count
        const unauthorizedAccounts = await db.Account.count({
            where: { 
                projectUuid: { [Op.in]: projectUuids },
                authorized: false
            }
        });

        res.json({
            success: true,
            data: {
                metrics: {
                    totalAccounts,
                    totalPosts,
                    scheduledPosts,
                    publishedPosts,
                    draftPosts,
                    failedPosts,
                    unauthorizedAccounts
                },
                projects: projectsWithStats
            }
        });
    } catch (error) {
        logger.error('Global dashboard metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch global metrics',
            error: error.message
        });
    }
};

/**
 * Get project-specific dashboard metrics
 * @route GET /api/dashboard/project/:projectUuid
 */
DashboardController.getProjectMetrics = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
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

        // Get project accounts
        const accounts = await db.Account.findAll({
            where: { projectUuid: projectUuid },
            order: [['createdAt', 'DESC']]
        });

        // Format accounts
        const formattedAccounts = accounts.map(account => ({
            id: account.id,
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            providerId: account.providerId,
            authorized: account.authorized,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt
        }));

        // Get post counts by status
        const [
            totalPosts,
            scheduledPosts,
            publishedPosts,
            draftPosts,
            failedPosts
        ] = await Promise.all([
            db.Post.count({ where: { projectUuid: projectUuid } }),
            db.Post.count({ where: { projectUuid: projectUuid, status: 1 } }),
            db.Post.count({ where: { projectUuid: projectUuid, status: 2 } }),
            db.Post.count({ where: { projectUuid: projectUuid, status: 0 } }),
            db.Post.count({ where: { projectUuid: projectUuid, status: 3 } })
        ]);

        // Get upcoming scheduled posts (next 7 days)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() +7);
        
        const upcomingPosts = await db.Post.findAll({
            where: {
                projectUuid: projectUuid,
                status: 1 // SCHEDULED
                // scheduledAt: {
                //     [Op.between]: [new Date(), sevenDaysFromNow]
                // }
            },
            order: [['scheduledAt', 'ASC']],
            limit: 10,
            include: [{
                model: db.Account,
                as: 'accounts',
                attributes: ['uuid', 'name', 'provider', 'media']
            }]
        });

        // Get recently published posts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 40); //todo change to 7

        const recentPosts = await db.Post.findAll({
            where: {
                projectUuid: projectUuid,
                status: 2 // PUBLISHED
                // publishedAt: {
                //     [Op.gte]: sevenDaysAgo
                // }
            },
            order: [['publishedAt', 'DESC']],
            limit: 10,
            include: [{
                model: db.Account,
                as: 'accounts',
                attributes: ['uuid', 'name', 'provider', 'media']
            }]
        });

        // Format posts
        const formatPost = (post) => ({
            uuid: post.uuid,
            status: post.status,
            scheduledAt: post.scheduledAt,
            publishedAt: post.publishedAt,
            accounts: post.accounts ? post.accounts.map(acc => ({
                uuid: acc.uuid,
                name: acc.name,
                provider: acc.provider,
                image: acc.media ? (typeof acc.media === 'string' ? JSON.parse(acc.media).url : acc.media.url) || null : null
            })) : []
        });

        res.json({
            success: true,
            data: {
                project: {
                    uuid: project.uuid,
                    name: project.name,
                    description: project.description,
                    imageUrl: project.imageUrl
                },
                metrics: {
                    totalAccounts: accounts.length,
                    authorizedAccounts: accounts.filter(a => a.authorized).length,
                    unauthorizedAccounts: accounts.filter(a => !a.authorized).length,
                    totalPosts,
                    scheduledPosts,
                    publishedPosts,
                    draftPosts,
                    failedPosts
                },
                accounts: formattedAccounts,
                upcomingPosts: upcomingPosts.map(formatPost),
                recentPosts: recentPosts.map(formatPost)
            }
        });
    } catch (error) {
        logger.error('Project dashboard metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project metrics',
            error: error.message
        });
    }
};

module.exports = DashboardController;

