const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const TagsController = {};

/**
 * Tag management page for a project
 * @route GET /dashboard/projects/:projectUuid/tags
 */
TagsController.index = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const userUuid = req.user?.uuid;

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

        res.render('dashboard/tags/index', {
            projectUuid,
            projectName: project.name,
            currentPage: 'tags',
            title: 'Tags',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Tag management index error:', error);
        req.flash('error', 'Failed to load tag management');
        res.redirect('/dashboard/projects');
    }
};

/**
 * Get tags for a project
 * @route GET /api/tags/project/:projectUuid
 */
TagsController.getByProject = async (req, res) => {
    try {
        logger.info('TagsController.getByProject - Request received', {
            method: req.method,
            url: req.url,
            path: req.path,
            params: req.params,
            query: req.query,
            user: req.user ? { uuid: req.user.uuid, email: req.user.email } : null,
            hasSession: !!req.session,
            sessionId: req.session?.id
        });

        const { projectUuid } = req.params;
        const userUuid = req.user?.uuid;

        logger.info('TagsController.getByProject - Extracted params', {
            projectUuid: projectUuid,
            userUuid: userUuid,
            hasUser: !!req.user
        });

        if (!userUuid) {
            logger.warn('TagsController.getByProject - No user found, redirecting');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not authenticated'
            });
        }

        // Verify project belongs to user
        logger.info('TagsController.getByProject - Looking up project', {
            projectUuid: projectUuid,
            userUuid: userUuid
        });

        const project = await db.Project.findOne({
            where: {
                uuid: projectUuid,
                userUuid: userUuid
            }
        });

        logger.info('TagsController.getByProject - Project lookup result', {
            projectFound: !!project,
            projectUuid: projectUuid
        });

        if (!project) {
            logger.warn('TagsController.getByProject - Project not found', {
                projectUuid: projectUuid,
                userUuid: userUuid
            });
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        logger.info('TagsController.getByProject - Fetching tags', {
            projectUuid: projectUuid
        });

        const tags = await db.Tag.findAll({
            where: {
                projectUuid: projectUuid
            },
            order: [['createdAt', 'DESC']]
        });

        logger.info('TagsController.getByProject - Tags fetched successfully', {
            projectUuid: projectUuid,
            tagCount: tags.length
        });

        const mappedTags = tags.map(({ id, uuid, name, hexColor }) => ({
            id,
            uuid,
            name,
            hex_color: hexColor
        }));
        logger.info("Mapped Tags Data Response >>", mappedTags)
        return res.json({
            success: true,
            data: mappedTags
        });
    } catch (error) {
        logger.error('Get tags by project error:', {
            error: error.message,
            stack: error.stack,
            params: req.params,
            user: req.user ? { uuid: req.user.uuid } : null
        });
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
};

/**
 * Create tag (API only)
 * @route POST /api/tags/create
 */
TagsController.store = async (req, res) => {
    try {
        logger.info('TagsController.store - Request received', {
            method: req.method,
            url: req.url,
            path: req.path,
            body: req.body,
            user: req.user ? { uuid: req.user.uuid, email: req.user.email } : null
        });

        const { name, hex_color, projectUuid } = req.body;
        const userUuid = req.user?.uuid;

        if (!name || !hex_color || !projectUuid) {
            logger.warn('TagsController.store - Missing required fields', {
                hasName: !!name,
                hasHexColor: !!hex_color,
                hasProjectUuid: !!projectUuid
            });
            return res.status(400).json({
                success: false,
                message: 'Name, color, and projectUuid are required'
            });
        }

        if (!userUuid) {
            logger.warn('TagsController.store - No user found, unauthorized');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not authenticated'
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
            logger.warn('TagsController.store - Project not found', {
                projectUuid: projectUuid,
                userUuid: userUuid
            });
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const tag = await db.Tag.create({
            uuid: uuidv4(),
            name: name.trim(),
            hexColor: hex_color.replace('#', ''),
            projectUuid: projectUuid
        });

        logger.info('TagsController.store - Tag created successfully', {
            tagId: tag.id,
            tagUuid: tag.uuid,
            tagName: tag.name
        });

        // Fetch all tags for the project to return in response
        const allTags = await db.Tag.findAll({
            where: {
                projectUuid: projectUuid
            },
            order: [['createdAt', 'DESC']]
        });

        const mappedTags = allTags.map(({ id, uuid, name, hexColor }) => ({
            id,
            uuid,
            name,
            hex_color: hexColor
        }));

        return res.json({
            success: true,
            message: 'Tag created successfully',
            data: {
                id: tag.id,
                uuid: tag.uuid,
                name: tag.name,
                hex_color: tag.hexColor
            },
            tags: mappedTags
        });
    } catch (error) {
        logger.error('Tag store error:', {
            error: error.message,
            stack: error.stack,
            body: req.body,
            user: req.user ? { uuid: req.user.uuid } : null
        });
        
        return res.status(500).json({
            success: false,
            message: 'Failed to create tag',
            error: error.message
        });
    }
};


/**
 * Update tag (API only)
 * @route POST /api/tags/update
 */
TagsController.update = async (req, res) => {
    try {
        logger.info('TagsController.update - Request received', {
            method: req.method,
            url: req.url,
            path: req.path,
            body: req.body,
            user: req.user ? { uuid: req.user.uuid, email: req.user.email } : null
        });

        const { uuid, name, hex_color } = req.body;
        const userUuid = req.user?.uuid;

        if (!uuid) {
            logger.warn('TagsController.update - Missing uuid in request body');
            return res.status(400).json({
                success: false,
                message: 'Tag UUID is required'
            });
        }

        if (!name || !hex_color) {
            logger.warn('TagsController.update - Missing required fields', {
                hasName: !!name,
                hasHexColor: !!hex_color
            });
            return res.status(400).json({
                success: false,
                message: 'Name and hex_color are required'
            });
        }

        if (!userUuid) {
            logger.warn('TagsController.update - No user found, unauthorized');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not authenticated'
            });
        }

        // First find the tag, then verify it belongs to user's project
        const tag = await db.Tag.findOne({ 
            where: { uuid }
        });
        
        if (!tag) {
            logger.warn('TagsController.update - Tag not found', {
                uuid: uuid,
                userUuid: userUuid
            });
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }

        // Verify the tag's project belongs to the user
        const project = await db.Project.findOne({
            where: {
                uuid: tag.projectUuid,
                userUuid: userUuid
            }
        });
        
        if (!project) {
            logger.warn('TagsController.update - Tag project does not belong to user', {
                tagUuid: uuid,
                projectUuid: tag.projectUuid,
                userUuid: userUuid
            });
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }

        tag.name = name.trim();
        tag.hexColor = hex_color.replace('#', '');

        await tag.save();

        logger.info('TagsController.update - Tag updated successfully', {
            tagId: tag.id,
            tagUuid: tag.uuid,
            tagName: tag.name
        });

        return res.json({
            success: true,
            message: 'Tag updated successfully',
            data: {
                id: tag.id,
                uuid: tag.uuid,
                name: tag.name,
                hex_color: tag.hexColor
            }
        });
    } catch (error) {
        logger.error('Tag update error:', {
            error: error.message,
            stack: error.stack,
            body: req.body,
            user: req.user ? { uuid: req.user.uuid } : null
        });
        
        return res.status(500).json({
            success: false,
            message: 'Failed to update tag',
            error: error.message
        });
    }
};

/**
 * Delete tag
 * @route DELETE /dashboard/tags/:uuid
 * @route DELETE /api/tags/:uuid
 */
TagsController.delete = async (req, res) => {
    try {
        const { uuid } = req.params;

        const tag = await db.Tag.findOne({ where: { uuid } });

        if (!tag) {
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            req.flash('error', 'Tag not found');
            return res.redirect('back');
        }

        await tag.destroy();

        if (req.path.startsWith('/api/')) {
            return res.json({
                success: true,
                message: 'Tag deleted successfully'
            });
        }

        req.flash('success', 'Tag deleted successfully');
        res.redirect('back');
    } catch (error) {
        logger.error('Tag delete error:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete tag',
                error: error.message
            });
        }
        req.flash('error', 'Failed to delete tag');
        res.redirect('back');
    }
};

module.exports = TagsController;

