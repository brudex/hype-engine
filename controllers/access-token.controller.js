const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const AccessTokenController = {};

/**
 * Access Tokens Management Page
 * @route GET /dashboard/access-tokens
 */
AccessTokenController.index = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.redirect('/login');
        }

        // Load API keys from database
        const apiKeys = await db.ApiKey.findAll({
            where: {
                userUuid: userUuid,
                isActive: true
            },
            order: [['createdAt', 'DESC']],
            attributes: ['uuid', 'name', 'description', 'key', 'scopes', 'lastUsedAt', 'createdAt']
        });

        // Format for view - show masked key
        const formattedKeys = apiKeys.map(key => ({
            uuid: key.uuid,
            name: key.name,
            description: key.description,
            key: key.key ? key.key.substring(0, 12) + '...' : '', // Show first 12 chars
            scopes: key.scopes || { allProjects: true, projects: [] },
            lastUsedAt: key.lastUsedAt,
            createdAt: key.createdAt
        }));

        res.render('dashboard/apidoc/keys', {
            apiKeys: formattedKeys,
            layout: 'layouts/dashboard/index',
            currentPage: 'apidoc-keys'
        });
    } catch (error) {
        logger.error('Access Tokens page error:', error);
        res.status(500).render('error', {
            message: 'Failed to load access tokens',
            error: error.message,
            layout: 'layouts/dashboard/index'
        });
    }
};

/**
 * Create Access Token (API endpoint)
 * @route POST /dashboard/api/access-tokens
 */
AccessTokenController.create = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { name, description, scopes } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Access token name is required'
            });
        }

        // Validate and process scopes
        let processedScopes = {
            allProjects: true,
            projects: []
        };

        if (scopes) {
            if (typeof scopes.allProjects === 'boolean') {
                processedScopes.allProjects = scopes.allProjects;
            }

            if (Array.isArray(scopes.projects)) {
                // Validate that all project UUIDs belong to the user
                if (!processedScopes.allProjects && scopes.projects.length > 0) {
                    const userProjects = await db.Project.findAll({
                        where: {
                            userUuid: userUuid,
                            uuid: scopes.projects
                        },
                        attributes: ['uuid']
                    });

                    const validProjectUuids = userProjects.map(p => p.uuid);
                    const invalidUuids = scopes.projects.filter(uuid => !validProjectUuids.includes(uuid));

                    if (invalidUuids.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'One or more project UUIDs are invalid or do not belong to you'
                        });
                    }

                    processedScopes.projects = validProjectUuids;
                } else if (!processedScopes.allProjects && scopes.projects.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'At least one project must be selected when allProjects is false'
                    });
                }
            }
        }

        // Generate API key
        const ApiKey = db.ApiKey;
        const plainKey = ApiKey.generateKey();

        // Check if keyPrefix column exists in the database
        const queryInterface = db.sequelize.getQueryInterface();
        let tableDescription;
        try {
            tableDescription = await queryInterface.describeTable('mixpost_api_keys');
        } catch (error) {
            // If table doesn't exist or can't be described, proceed without keyPrefix
            tableDescription = {};
        }

        // Prepare create data
        const createData = {
            uuid: uuidv4(),
            userUuid: userUuid,
            name: name.trim(),
            description: description ? description.trim() : null,
            key: plainKey,
            isActive: true,
            scopes: processedScopes
        };
        const prefix = plainKey.startsWith('hypengn-') 
        ? plainKey.substring(8, 16) 
        : plainKey.substring(0, 8);
        createData.keyPrefix = prefix;

        // Create API key in database
        const apiKey = await db.ApiKey.create(createData);

        // Return the plain key only once (for user to copy)
        res.json({
            success: true,
            data: {
                uuid: apiKey.uuid,
                name: apiKey.name,
                description: apiKey.description,
                key: plainKey, // Return full key only on creation
                scopes: apiKey.scopes || { allProjects: true, projects: [] },
                createdAt: apiKey.createdAt
            },
            message: 'Access token created successfully'
        });
    } catch (error) {
        logger.error('Create access token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create access token',
            error: error.message
        });
    }
};

/**
 * Delete Access Token (API endpoint)
 * @route DELETE /dashboard/api/access-tokens/:uuid
 */
AccessTokenController.delete = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        const { uuid } = req.params;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'Access token UUID is required'
            });
        }

        // Find and verify API key belongs to user
        const apiKey = await db.ApiKey.findOne({
            where: {
                uuid: uuid,
                userUuid: userUuid
            }
        });

        if (!apiKey) {
            return res.status(404).json({
                success: false,
                message: 'Access token not found'
            });
        }

        // Soft delete by setting isActive to false
        await apiKey.update({
            isActive: false
        });

        res.json({
            success: true,
            message: 'Access token deleted successfully'
        });
    } catch (error) {
        logger.error('Delete access token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete access token',
            error: error.message
        });
    }
};

/**
 * Get Access Tokens List (API endpoint)
 * @route GET /dashboard/api/access-tokens
 */
AccessTokenController.list = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Load API keys from database
        const apiKeys = await db.ApiKey.findAll({
            where: {
                userUuid: userUuid,
                isActive: true
            },
            order: [['createdAt', 'DESC']],
            attributes: ['uuid', 'name', 'description', 'key', 'scopes', 'lastUsedAt', 'createdAt']
        });

        // Format for response - show masked key
        const formattedKeys = apiKeys.map(key => ({
            uuid: key.uuid,
            name: key.name,
            description: key.description,
            key: key.key ? key.key.substring(0, 12) + '...' : '', // Show first 12 chars
            scopes: key.scopes || { allProjects: true, projects: [] },
            lastUsedAt: key.lastUsedAt,
            createdAt: key.createdAt
        }));

        res.json({
            success: true,
            data: formattedKeys
        });
    } catch (error) {
        logger.error('Get access tokens error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access tokens',
            error: error.message
        });
    }
};

/**
 * Get Access Token by UUID (API endpoint)
 * @route GET /dashboard/api/access-tokens/:uuid
 */
AccessTokenController.get = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        const { uuid } = req.params;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'Access token UUID is required'
            });
        }

        // Find API key and verify it belongs to user
        const apiKey = await db.ApiKey.findOne({
            where: {
                uuid: uuid,
                userUuid: userUuid,
                isActive: true
            },
            attributes: ['uuid', 'name', 'description', 'key', 'scopes', 'lastUsedAt', 'createdAt']
        });

        if (!apiKey) {
            return res.status(404).json({
                success: false,
                message: 'Access token not found'
            });
        }

        // Get project details if scopes include specific projects
        let projectDetails = [];
        if (apiKey.scopes && !apiKey.scopes.allProjects && apiKey.scopes.projects && apiKey.scopes.projects.length > 0) {
            const projects = await db.Project.findAll({
                where: {
                    uuid: apiKey.scopes.projects,
                    userUuid: userUuid
                },
                attributes: ['uuid', 'name', 'description']
            });
            
            projectDetails = projects.map(p => ({
                uuid: p.uuid,
                name: p.name,
                description: p.description
            }));
        }

        // Format response - return full key
        const formattedKey = {
            uuid: apiKey.uuid,
            name: apiKey.name,
            description: apiKey.description,
            key: apiKey.key, // Return full key
            fullKey: apiKey.key, // Explicitly include fullKey field for compatibility
            scopes: {
                allProjects: apiKey.scopes?.allProjects !== undefined ? apiKey.scopes.allProjects : true,
                projects: apiKey.scopes?.projects || [],
                projectDetails: projectDetails // Include project names for display
            },
            lastUsedAt: apiKey.lastUsedAt,
            createdAt: apiKey.createdAt
        };

        res.json({
            success: true,
            data: formattedKey
        });
    } catch (error) {
        logger.error('Get access token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access token',
            error: error.message
        });
    }
};

module.exports = AccessTokenController;

