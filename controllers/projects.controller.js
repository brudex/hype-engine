const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');
const socialaccountApiDefinitions = require('../services/socialaccount-api-definitions');

const ProjectsController = {};

/**
 * Helper function to get formatted projects list
 */
async function getFormattedProjects(userUuid) {
    const projects = await db.Project.findAll({
        where: {
            userUuid: userUuid
        },
        order: [['createdAt', 'DESC']]
    });

    // Get counts for each project separately (more efficient)
    const projectUuids = projects.map(p => p.uuid);
    
    if (projectUuids.length === 0) {
        return [];
    }

    const accountCounts = await db.Account.findAll({
        where: {
            projectUuid: { [Op.in]: projectUuids }
        },
        attributes: [
            'projectUuid',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['projectUuid'],
        raw: true
    });

    const postCounts = await db.Post.findAll({
        where: {
            projectUuid: { [Op.in]: projectUuids }
        },
        attributes: [
            'projectUuid',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['projectUuid'],
        raw: true
    });

    // Create maps for quick lookup
    const accountCountMap = {};
    accountCounts.forEach(item => {
        accountCountMap[item.projectUuid] = parseInt(item.count) || 0;
    });

    const postCountMap = {};
    postCounts.forEach(item => {
        postCountMap[item.projectUuid] = parseInt(item.count) || 0;
    });

    // Format projects for frontend
    return projects.map(project => ({
        uuid: project.uuid,
        name: project.name,
        description: project.description,
        imageUrl: project.imageUrl,
        accountCount: accountCountMap[project.uuid] || 0,
        postCount: postCountMap[project.uuid] || 0,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
    }));
}

/**
 * Get all projects as JSON (API endpoint)
 * @route GET /api/projects
 */
ProjectsController.list = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const formattedProjects = await getFormattedProjects(userUuid);

        return res.json({
            success: true,
            data: formattedProjects
        });
    } catch (error) {
        logger.error('Projects list error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

/**
 * Render project creation page
 * @route GET /dashboard/projects/create
 */
ProjectsController.createProjectPage = async (req, res) => {
    try {
        res.render('dashboard/projects/create', {
            currentPage: 'projects',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Project create page error:', error);
        req.flash('error', 'Failed to load project creation page');
        res.redirect('/dashboard/projects');
    }
};

/**
 * Render projects page
 * @route GET /dashboard/projects
 */
ProjectsController.index = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/dashboard');
        }

        const formattedProjects = await getFormattedProjects(userUuid);

        res.render('dashboard/projects/index', {
            projects: formattedProjects,
            currentPage: 'projects',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Projects index error:', error);
        req.flash('error', 'Failed to fetch projects');
        res.status(500).render('error', {
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

/**
 * Render project page
 * @route GET /dashboard/projects/:uuid
 */
ProjectsController.renderProjectPage = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/dashboard/projects');
        }

        const project = await db.Project.findOne({
            where: {
                uuid: uuid,
                userUuid: userUuid // Ensure user owns this project
            },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    order: [['createdAt', 'DESC']]
                },
                {
                    model: db.Post,
                    as: 'posts',
                    order: [['createdAt', 'DESC']],
                    limit: 10 // Show recent posts
                }
            ]
        });

        if (!project) {
            req.flash('error', 'Project not found');
            return res.redirect('/dashboard/projects');
        }

        // Build serializable service definitions for API key forms (formFields per platform)
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

        res.render('dashboard/projects/show', {
            project: {
                uuid: project.uuid,
                name: project.name,
                description: project.description,
                imageUrl: project.imageUrl,
                accounts: project.accounts || [],
                posts: project.posts || [],
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            },
            serviceDefinitions,
            currentPage: 'projects',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Project render page error:', error);
        req.flash('error', 'Failed to fetch project');
        res.redirect('/dashboard/projects');
    }
};

/**
 * Get project details as JSON (API endpoint)
 * @route GET /api/projects/:uuid
 */
ProjectsController.getProjectDetails = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const project = await db.Project.findOne({
            where: {
                uuid: uuid,
                userUuid: userUuid // Ensure user owns this project
            },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    order: [['createdAt', 'DESC']]
                },
                {
                    model: db.Post,
                    as: 'posts',
                    order: [['createdAt', 'DESC']],
                    limit: 10 // Show recent posts
                }
            ]
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        return res.json({
            success: true,
            data: {
                uuid: project.uuid,
                name: project.name,
                description: project.description,
                imageUrl: project.imageUrl,
                accounts: project.accounts || [],
                posts: project.posts || [],
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }
        });
    } catch (error) {
        logger.error('Project get details error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
            error: error.message
        });
    }
};

/**
 * Create a new project
 * @route POST /dashboard/projects
 * @route POST /api/projects
 */
ProjectsController.createProjectPost = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!name || name.trim() === '') {
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({
                    success: false,
                    message: 'Project name is required'
                });
            }
            req.flash('error', 'Project name is required');
            return res.redirect('back');
        }

        // Generate project UUID first (needed for image path)
        const projectUuid = uuidv4();

        // Handle image upload if provided
        let imageUrl = null;
        if (req.files && req.files.image) {
            try {
                const imageFile = req.files.image;
                logger.info('Image file received:', {
                    name: imageFile.name,
                    size: imageFile.size,
                    mimetype: imageFile.mimetype,
                    tempFilePath: imageFile.tempFilePath
                });
                
                // Validate file object
                if (!imageFile || !imageFile.name) {
                    logger.warn('Invalid image file object:', imageFile);
                } else {
                    const ext = path.extname(imageFile.name).toLowerCase();
                    const filename = `${projectUuid}${ext}`;
                    const projectsDir = path.join(__dirname, '../public/uploads/projects');
                    const uploadPath = path.join(projectsDir, filename);

                    logger.info('Uploading project image:', {
                        filename,
                        projectsDir,
                        uploadPath
                    });

                    // Ensure directory exists
                    await fs.mkdir(projectsDir, { recursive: true });
                    logger.info('Directory created/verified:', projectsDir);

                    // Move file to upload directory
                    await imageFile.mv(uploadPath);
                    logger.info('File moved to:', uploadPath);

                    // Verify file was moved successfully
                    try {
                        await fs.access(uploadPath);
                        // Store relative path from public directory
                        imageUrl = `/uploads/projects/${filename}`;
                        logger.info(`Project image uploaded successfully: ${imageUrl}`);
                    } catch (accessError) {
                        logger.error('File was not saved correctly:', accessError);
                        throw new Error('Failed to save project image');
                    }
                }
            } catch (uploadError) {
                logger.error('Error uploading project image:', {
                    error: uploadError.message,
                    stack: uploadError.stack
                });
                // Continue without image rather than failing the entire request
                // You can uncomment the next line if you want to fail on image upload error
                // throw uploadError;
            }
        } else {
            logger.info('No image file in request:', {
                hasFiles: !!req.files,
                filesKeys: req.files ? Object.keys(req.files) : []
            });
        }

        const project = await db.Project.create({
            uuid: projectUuid,
            name: name.trim(),
            description: description ? description.trim() : null,
            userUuid: userUuid,
            imageUrl: imageUrl
        });

        if (req.path.startsWith('/api/')) {
            return res.status(201).json({
                success: true,
                message: 'Project created successfully',
                data: {
                    uuid: project.uuid,
                    name: project.name,
                    description: project.description,
                    imageUrl: project.imageUrl,
                    createdAt: project.createdAt
                }
            });
        }

        req.flash('success', 'Project created successfully');
        res.redirect(`/dashboard/projects/${project.uuid}`);
    } catch (error) {
        logger.error('Project create error:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create project',
                error: error.message
            });
        }
        req.flash('error', 'Failed to create project');
        res.redirect('back');
    }
};

/**
 * Update a project
 * @route PUT /api/projects/:uuid
 */
ProjectsController.update = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, description } = req.body;
        const userUuid = req.user?.uuid;

        logger.info('Project update request received:', {
            uuid,
            userUuid,
            hasName: !!name,
            hasDescription: description !== undefined,
            hasImage: !!(req.files && req.files.image)
        });

        if (!userUuid) {
            const errorResponse = {
                success: false,
                message: 'Unauthorized'
            };
            logger.warn('Project update unauthorized:', { uuid, userUuid });
            return res.status(401).json(errorResponse);
        }

        const project = await db.Project.findOne({
            where: {
                uuid: uuid,
                userUuid: userUuid // Ensure user owns this project
            }
        });

        if (!project) {
            const errorResponse = {
                success: false,
                message: 'Project not found'
            };
            logger.warn('Project not found for update:', { uuid, userUuid });
            return res.status(404).json(errorResponse);
        }

        // Update project fields
        if (name && name.trim() !== '') {
            project.name = name.trim();
        }
        if (description !== undefined) {
            project.description = description ? description.trim() : null;
        }

        // Handle image upload if provided
        if (req.files && req.files.image) {
            try {
                const imageFile = req.files.image;
                
                logger.info('Image file received for update:', {
                    name: imageFile.name,
                    size: imageFile.size,
                    mimetype: imageFile.mimetype
                });
                
                // Validate file object
                if (!imageFile || !imageFile.name) {
                    logger.warn('Invalid image file object in update:', imageFile);
                } else {
                    // Delete old image if it exists
                    if (project.imageUrl) {
                        const oldImagePath = path.join(__dirname, '../public', project.imageUrl);
                        try {
                            await fs.unlink(oldImagePath);
                            logger.info(`Deleted old project image: ${oldImagePath}`);
                        } catch (err) {
                            // Ignore if file doesn't exist
                            logger.warn('Could not delete old project image:', err.message);
                        }
                    }

                    const ext = path.extname(imageFile.name).toLowerCase();
                    const filename = `${project.uuid}${ext}`;
                    const projectsDir = path.join(__dirname, '../public/uploads/projects');
                    const uploadPath = path.join(projectsDir, filename);

                    logger.info('Uploading project image:', {
                        filename,
                        projectsDir,
                        uploadPath
                    });

                    // Ensure directory exists
                    await fs.mkdir(projectsDir, { recursive: true });

                    // Move file to upload directory
                    await imageFile.mv(uploadPath);

                    // Verify file was moved successfully
                    try {
                        await fs.access(uploadPath);
                        // Store relative path from public directory
                        project.imageUrl = `/uploads/projects/${filename}`;
                        logger.info(`Project image updated successfully: ${project.imageUrl}`);
                    } catch (accessError) {
                        logger.error('File was not saved correctly:', accessError);
                        throw new Error('Failed to save project image');
                    }
                }
            } catch (uploadError) {
                logger.error('Error uploading project image in update:', {
                    error: uploadError.message,
                    stack: uploadError.stack
                });
                // Continue without updating image rather than failing the entire request
                // You can uncomment the next line if you want to fail on image upload error
                // throw uploadError;
            }
        }

        await project.save();

        const responseData = {
            success: true,
            message: 'Project updated successfully',
            data: {
                uuid: project.uuid,
                name: project.name,
                description: project.description,
                imageUrl: project.imageUrl,
                updatedAt: project.updatedAt
            }
        };

        logger.info('Project update successful, sending response:', {
            uuid: project.uuid,
            name: project.name,
            hasImage: !!project.imageUrl
        });

        return res.json(responseData);
    } catch (error) {
        logger.error('Project update error:', {
            error: error.message,
            stack: error.stack,
            uuid: req.params.uuid,
            userUuid: req.user?.uuid
        });
        
        const errorResponse = {
            success: false,
            message: 'Failed to update project',
            error: error.message
        };
        
        logger.info('Sending error response:', errorResponse);
        return res.status(500).json(errorResponse);
    }
};

/**
 * Delete a project
 * @route DELETE /dashboard/projects/:uuid
 * @route DELETE /api/projects/:uuid
 */
ProjectsController.delete = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userUuid = req.user?.uuid;

        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const project = await db.Project.findOne({
            where: {
                uuid: uuid,
                userUuid: userUuid // Ensure user owns this project
            },
            include: [
                {
                    model: db.Account,
                    as: 'accounts'
                },
                {
                    model: db.Post,
                    as: 'posts'
                }
            ]
        });

        if (!project) {
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
            req.flash('error', 'Project not found');
            return res.redirect('/dashboard/projects');
        }

        // Check if project has accounts or posts
        if (project.accounts && project.accounts.length > 0) {
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete project with linked accounts. Please remove all accounts first.'
                });
            }
            req.flash('error', 'Cannot delete project with linked accounts. Please remove all accounts first.');
            return res.redirect(`/dashboard/projects/${project.uuid}`);
        }

        if (project.posts && project.posts.length > 0) {
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete project with posts. Please remove all posts first.'
                });
            }
            req.flash('error', 'Cannot delete project with posts. Please remove all posts first.');
            return res.redirect(`/dashboard/projects/${project.uuid}`);
        }

        // Delete project image if it exists
        if (project.imageUrl) {
            const imagePath = path.join(__dirname, '../../public', project.imageUrl);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                // Ignore if file doesn't exist
                logger.warn('Could not delete project image:', err.message);
            }
        }

        await project.destroy();

        if (req.path.startsWith('/api/')) {
            return res.json({
                success: true,
                message: 'Project deleted successfully'
            });
        }

        req.flash('success', 'Project deleted successfully');
        res.redirect('/dashboard/projects');
    } catch (error) {
        logger.error('Project delete error:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete project',
                error: error.message
            });
        }
        req.flash('error', 'Failed to delete project');
        res.redirect('back');
    }
};

module.exports = ProjectsController;

