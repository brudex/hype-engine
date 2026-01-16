const db = require('../../models');
const logger = require('../../utils/logger');

const ProjectsApiController = {};

/**
 * List projects
 * GET /api/v1/projects
 */
ProjectsApiController.list = async (req, res) => {
    try {
        const userUuid = req.user.uuid;

        const projects = await db.Project.findAll({
            where: {
                userUuid: userUuid
            },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    attributes: ['uuid', 'name', 'username', 'provider', 'providerId', 'media', 'authorized', 'createdAt']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedProjects = projects.map(project => ({
            uuid: project.uuid,
            name: project.name,
            description: project.description,
            image_url: project.imageUrl,
            accounts: (project.accounts || []).map(account => ({
                uuid: account.uuid,
                name: account.name,
                username: account.username,
                provider: account.provider,
                provider_id: account.providerId,
                authorized: account.authorized,
                image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
                created_at: account.createdAt
            })),
            created_at: project.createdAt,
            updated_at: project.updatedAt
        }));

        res.json({
            success: true,
            data: formattedProjects
        });
    } catch (error) {
        logger.error('API v1 - List projects error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch projects'
        });
    }
};

/**
 * Get a project
 * GET /api/v1/projects/:projectUuid
 */
ProjectsApiController.get = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const userUuid = req.user.uuid;

        const project = await db.Project.findOne({
            where: {
                uuid: projectUuid,
                userUuid: userUuid
            },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    attributes: ['uuid', 'name', 'username', 'provider', 'providerId', 'media', 'authorized', 'createdAt']
                }
            ]
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const formattedProject = {
            uuid: project.uuid,
            name: project.name,
            description: project.description,
            image_url: project.imageUrl,
            accounts: (project.accounts || []).map(account => ({
                uuid: account.uuid,
                name: account.name,
                username: account.username,
                provider: account.provider,
                provider_id: account.providerId,
                authorized: account.authorized,
                image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
                created_at: account.createdAt
            })),
            created_at: project.createdAt,
            updated_at: project.updatedAt
        };

        res.json({
            success: true,
            data: formattedProject
        });
    } catch (error) {
        logger.error('API v1 - Get project error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch project'
        });
    }
};

module.exports = ProjectsApiController;

