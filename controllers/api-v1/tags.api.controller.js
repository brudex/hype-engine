const db = require('../../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

const TagsApiController = {};

/**
 * List tags
 * GET /api/v1/{projectUuid}/tags
 */
TagsApiController.list = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const tags = await db.Tag.findAll({
            where: {
                projectUuid: projectUuid
            },
            order: [['createdAt', 'DESC']]
        });

        const formattedTags = tags.map(tag => ({
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor,
            created_at: tag.createdAt
        }));

        res.json({
            success: true,
            data: formattedTags
        });
    } catch (error) {
        logger.error('API v1 - List tags error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch tags'
        });
    }
};

/**
 * Get a tag
 * GET /api/v1/{projectUuid}/tags/{tagUuid}
 */
TagsApiController.get = async (req, res) => {
    try {
        const { tagUuid, projectUuid } = req.params;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const tag = await db.Tag.findOne({
            where: {
                uuid: tagUuid,
                projectUuid: projectUuid
            }
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Tag not found'
            });
        }

        const formattedTag = {
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor,
            created_at: tag.createdAt
        };

        res.json({
            success: true,
            data: formattedTag
        });
    } catch (error) {
        logger.error('API v1 - Get tag error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch tag'
        });
    }
};

/**
 * Create a tag
 * POST /api/v1/{projectUuid}/tags
 */
TagsApiController.create = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const { name, hex_color } = req.body;
        const userUuid = req.user.uuid;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Tag name is required'
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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        // Check if tag with same name already exists in project
        const existingTag = await db.Tag.findOne({
            where: {
                name: name,
                projectUuid: projectUuid
            }
        });

        if (existingTag) {
            return res.status(409).json({
                success: false,
                error: 'Conflict',
                message: 'Tag with this name already exists in this project'
            });
        }

        const tag = await db.Tag.create({
            uuid: uuidv4(),
            name: name,
            hexColor: hex_color || '#3B82F6',
            projectUuid: projectUuid
        });

        const formattedTag = {
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor,
            created_at: tag.createdAt
        };

        res.status(201).json({
            success: true,
            data: formattedTag
        });
    } catch (error) {
        logger.error('API v1 - Create tag error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to create tag'
        });
    }
};

/**
 * Update a tag
 * PUT /api/v1/{projectUuid}/tags/{tagUuid}
 */
TagsApiController.update = async (req, res) => {
    try {
        const { tagUuid, projectUuid } = req.params;
        const { name, hex_color } = req.body;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const tag = await db.Tag.findOne({
            where: {
                uuid: tagUuid,
                projectUuid: projectUuid
            }
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Tag not found'
            });
        }

        // Check if name is being changed and if new name already exists
        if (name && name !== tag.name) {
            const existingTag = await db.Tag.findOne({
                where: {
                    name: name,
                    projectUuid: projectUuid,
                    uuid: { [Op.ne]: tagUuid }
                }
            });

            if (existingTag) {
                return res.status(409).json({
                    success: false,
                    error: 'Conflict',
                    message: 'Tag with this name already exists in this project'
                });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (hex_color) updateData.hexColor = hex_color;

        await tag.update(updateData);

        const formattedTag = {
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor,
            created_at: tag.createdAt
        };

        res.json({
            success: true,
            data: formattedTag
        });
    } catch (error) {
        logger.error('API v1 - Update tag error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to update tag'
        });
    }
};

/**
 * Delete a tag
 * DELETE /api/v1/{projectUuid}/tags/{tagUuid}
 */
TagsApiController.delete = async (req, res) => {
    try {
        const { tagUuid, projectUuid } = req.params;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const tag = await db.Tag.findOne({
            where: {
                uuid: tagUuid,
                projectUuid: projectUuid
            }
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Tag not found'
            });
        }

        await tag.destroy();

        res.json({
            success: true,
            message: 'Tag deleted successfully'
        });
    } catch (error) {
        logger.error('API v1 - Delete tag error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to delete tag'
        });
    }
};

module.exports = TagsApiController;
