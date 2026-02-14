const db = require('../models');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const serviceDefinitions = require('../services/socialaccount-api-definitions');

const ServicesController = {};

/**
 * Get services configuration page for a specific project
 * @route GET /dashboard/services/project/:projectUuid
 */
ServicesController.indexForProject = async (req, res) => {
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
            req.flash('error', 'Project not found');
            return res.redirect('/dashboard/projects');
        }

        const services = await db.Service.findAll({
            where: {
                projectUuid: projectUuid
            },
            order: [['name', 'ASC']]
        });

        // Format services for frontend
        const formattedServices = services.map(service => ({
            id: service.id,
            name: service.name,
            active: service.active,
            configured: !!service.configuration
        }));

        res.render('dashboard/services/index', {
            services: formattedServices,
            project: {
                uuid: project.uuid,
                name: project.name,
                description: project.description
            },
            currentPage: 'services',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Services index for project error:', error);
        req.flash('error', 'Failed to load services');
        res.redirect('/dashboard/projects');
    }
};

/**
 * Get services configuration page
 * @route GET /dashboard/services
 */
ServicesController.index = async (req, res) => {
    try {
        const services = await db.Service.findAll({
            order: [['name', 'ASC']]
        });

        // Format services for frontend
        const formattedServices = services.map(service => ({
            id: service.id,
            name: service.name,
            active: service.active,
            // Don't expose configuration details for security
            configured: !!service.configuration
        }));

        res.render('dashboard/services/index', {
            services: formattedServices,
            currentPage: 'services',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Services index error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load services',
            error: error.message
        });
    }
};

/**
 * Show service configuration form
 * @route GET /dashboard/services/configure/:platformName
 */
ServicesController.configurePage = async (req, res) => {
    try {
        const { platformName } = req.params;
        const name = platformName; // Use platformName as the service name
        
        // Check if this is for a project
        const projectUuid = req.query.project;
        let project = null;
        if (projectUuid) {
            const userUuid = req.user?.uuid;
            if (userUuid) {
                project = await db.Project.findOne({
                    where: {
                        uuid: projectUuid,
                        userUuid: userUuid
                    }
                });
            }
        }

        // Find service by name and projectUuid (if project is specified)
        const whereClause = { name: name };
        if (projectUuid) {
            whereClause.projectUuid = projectUuid;
        }
        
        const service = await db.Service.findOne({ where: whereClause });
        
        // Get service definition
        const serviceDef = serviceDefinitions.getService(name);
        if (!serviceDef) {
            req.flash('error', 'Service not found');
            const projectUuid = req.query.project;
            if (projectUuid) {
                return res.redirect(`/dashboard/services/project/${projectUuid}`);
            }
            return res.redirect('/dashboard/services');
        }

        // Get configuration (will be decrypted by model hook)
        let configuration = {};
        if (service && service.configuration) {
            // Configuration is already decrypted by model hook
            configuration = typeof service.configuration === 'string' 
                ? JSON.parse(service.configuration) 
                : service.configuration;
        }

        res.render('dashboard/services/configure', {
            serviceName: name,
            service: service ? {
                ...service.toJSON(),
                configuration: configuration
            } : null,
            project: project ? {
                uuid: project.uuid,
                name: project.name,
                description: project.description
            } : null,
            currentPage: 'services',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Service edit error:', error);
        req.flash('error', 'Failed to load service configuration');
        const projectUuid = req.query.project;
        if (projectUuid) {
            return res.redirect(`/dashboard/services/project/${projectUuid}`);
        }
        res.redirect('/dashboard/services');
    }
};

/**
 * Update service configuration
 * @route POST /dashboard/services/configure/:platformName
 */
ServicesController.configure = async (req, res) => {
    try {
        const { platformName } = req.params;
        const name = platformName; // Use platformName as the service name
        
        // Log incoming request payload with full details for troubleshooting
        logger.info('ServicesController.configure - Incoming request:', {
            timestamp: new Date().toISOString(),
            params: req.params,
            query: req.query,
            body: req.body,
            method: req.method,
            path: req.path,
            originalUrl: req.originalUrl,
            headers: {
                'content-type': req.headers['content-type'] || 'not-set',
                'x-requested-with': req.headers['x-requested-with'] || 'not-set',
                'accept': req.headers.accept || 'not-set',
                'referer': req.headers.referer || 'not-set'
            },
            user: req.user ? { uuid: req.user.uuid, email: req.user.email } : 'not-authenticated'
        });
        
        // Check if service is registered
        const serviceDef = serviceDefinitions.getService(name);
        if (!serviceDef) {
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({
                    success: false,
                    message: 'Service not found'
                });
            }
            req.flash('error', 'Service not found');
            return res.redirect('back');
        }

        let { configuration, active } = req.body;

        // Handle form data - configuration comes as object from form
        // The form sends configuration as an object with nested keys like configuration[client_id]
        if (!configuration || typeof configuration !== 'object') {
            configuration = {};
        }

        logger.info('ServicesController.configure - Configuration:', configuration);
        // Validate configuration using Joi schema
        const validation = serviceDefinitions.validateServiceConfiguration(name, configuration);
        
        if (validation.error) {
            logger.warn('ServicesController.configure - Validation failed:', {
                serviceName: name,
                errors: validation.error
            });

            // Return validation errors to client
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.error
            });
        }

        // Use validated and sanitized value from Joi
        configuration = validation.value;

        // Handle active checkbox
        if (active === 'true' || active === true) {
            active = true;
        } else {
            active = false;
        }

        // Get projectUuid from query or body
        const projectUuid = req.query.project || req.body.project;
        
        // Log processed data
        logger.info('ServicesController.configure - Processed data:', {
            platformName: name,
            projectUuid: projectUuid,
            active: active,
            configurationType: typeof configuration,
            configurationKeys: configuration ? Object.keys(configuration) : [],
            hasProjectUuid: !!projectUuid,
            projectUuidSource: req.query.project ? 'query' : (req.body.project ? 'body' : 'none')
        });
        
        if (!projectUuid) {
            logger.warn('ServicesController.configure - Missing projectUuid:', {
                query: req.query,
                body: req.body,
                isApiPath: req.path.startsWith('/api/')
            });

            if (req.path.startsWith('/api/')) {
                return res.status(400).json({
                    success: false,
                    message: 'projectUuid is required'
                });
            }
            req.flash('error', 'Project is required');
            logger.info('ServicesController.configure - Redirecting to /dashboard/services (no projectUuid)');
            return res.redirect('/dashboard/services');
        }

        // Verify project belongs to user
        const userUuid = req.user?.uuid;
        if (userUuid) {
            const project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });
            if (!project) {
                logger.warn('ServicesController.configure - Project not found:', {
                    projectUuid: projectUuid,
                    userUuid: userUuid,
                    isApiPath: req.path.startsWith('/api/')
                });

                if (req.path.startsWith('/api/')) {
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }
                req.flash('error', 'Project not found');
                logger.info('ServicesController.configure - Redirecting to /dashboard/projects (project not found)');
                return res.redirect('/dashboard/projects');
            }

            logger.info('ServicesController.configure - Project verified:', {
                projectUuid: project.uuid,
                projectName: project.name,
                userUuid: userUuid
            });
        } else {
            logger.warn('ServicesController.configure - No user authentication:', {
                projectUuid: projectUuid,
                hasUser: !!req.user
            });
        }

        // Find or create service for this project
        let service = await db.Service.findOne({ 
            where: { 
                name: name,
                projectUuid: projectUuid
            } 
        });

        if (!service) {
            const serviceData = {
                uuid: uuidv4(),
                projectUuid: projectUuid,
                name: name,
                configuration: JSON.stringify(configuration), 
                active: active
            };
            
            logger.info('ServicesController.configure - Creating new service:', {
                uuid: serviceData.uuid,
                projectUuid: serviceData.projectUuid,
                name: serviceData.name,
                active: serviceData.active,
                hasConfiguration: !!serviceData.configuration
            });
            
            service = await db.Service.create(serviceData);
            
            logger.info('ServicesController.configure - Service created successfully:', {
                id: service.id,
                uuid: service.uuid,
                name: service.name,
                projectUuid: service.projectUuid,
                active: service.active,
                configured: !!service.configuration
            });
        } else {
            logger.info('ServicesController.configure - Updating existing service:', {
                id: service.id,
                uuid: service.uuid,
                name: service.name,
                projectUuid: service.projectUuid,
                oldActive: service.active,
                newActive: active,
                hasNewConfiguration: !!configuration
            });
            
            // Set configuration (will be encrypted by model hook before save)
            service.configuration = JSON.stringify(configuration);
            
            service.active = active;
            await service.save();
            
            logger.info('ServicesController.configure - Service updated successfully:', {
                id: service.id,
                uuid: service.uuid,
                name: service.name,
                projectUuid: service.projectUuid,
                active: service.active,
                configured: !!service.configuration
            });
        }

        // Determine response type - log all relevant headers and path info
        const isApiPath = req.path.startsWith('/api/');
        const isAjaxRequest = req.headers['x-requested-with'] === 'XMLHttpRequest';
        const acceptsJson = req.headers.accept && req.headers.accept.indexOf('application/json') !== -1;
        const contentType = req.headers['content-type'] || 'not-set';
        const userAgent = req.headers['user-agent'] || 'not-set';
        
        logger.info('ServicesController.configure - Response type detection:', {
            path: req.path,
            originalUrl: req.originalUrl,
            method: req.method,
            isApiPath: isApiPath,
            isAjaxRequest: isAjaxRequest,
            acceptsJson: acceptsJson,
            contentType: contentType,
            'x-requested-with': req.headers['x-requested-with'] || 'not-set',
            accept: req.headers.accept || 'not-set',
            userAgent: userAgent.substring(0, 100), // Truncate for logging
            shouldReturnJson: isApiPath || isAjaxRequest || acceptsJson
        });

        // Return JSON response for AJAX requests or API routes
        if (isApiPath || isAjaxRequest || acceptsJson) {
            logger.info('ServicesController.configure - Returning JSON response');
            return res.json({
                success: true,
                message: 'Service updated successfully',
                data: {
                    name: service.name,
                    active: service.active,
                    configured: !!service.configuration,
                    projectUuid: projectUuid
                }
            });
        }

        // Form submission - redirect
        logger.info('ServicesController.configure - Returning redirect response', {
            redirectUrl: `/dashboard/services/project/${projectUuid}`,
            projectUuid: projectUuid,
            flashMessage: 'Service updated successfully'
        });

        req.flash('success', 'Service updated successfully');
        
        // Always redirect to project services since projectUuid is now required
        return res.redirect(`/dashboard/services/project/${projectUuid}`);
    } catch (error) {
        logger.error('Service update error:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update service',
                error: error.message
            });
        }
        req.flash('error', 'Failed to update service');
        res.redirect('back');
    }
};

/**
 * Get all services (API endpoint)
 * @route GET /api/services
 */
ServicesController.list = async (req, res) => {
    try {
        const { projectUuid } = req.query;
        
        const whereClause = {};
        if (projectUuid) {
            whereClause.projectUuid = projectUuid;
        }
        
        const services = await db.Service.findAll({
            where: whereClause,
            order: [['name', 'ASC']]
        });

        // Format services for frontend
        const formattedServices = services.map(service => {
            // Configuration is already decrypted by model hook
            let configuration = {};
            if (service.configuration) {
                configuration = typeof service.configuration === 'string' 
                    ? JSON.parse(service.configuration) 
                    : service.configuration;
            }
            
            // Check if service is configured (all required fields filled)
            const isConfigured = serviceDefinitions.isServiceConfigured(service.name, configuration);
            
            return {
                id: service.id,
                name: service.name,
                active: service.active,
                configured: isConfigured,
                projectUuid: service.projectUuid || null
            };
        });

        return res.json({
            success: true,
            data: formattedServices
        });
    } catch (error) {
        logger.error('ServicesController.list - Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load services',
            error: error.message
        });
    }
};

/**
 * Get a specific service by name (API endpoint)
 * @route GET /api/services/:name
 */
ServicesController.getService = async (req, res) => {
    try {
        const { projectUuid } = req.query;
        
        const whereClause = { name: req.params.name };
        if (projectUuid) {
            whereClause.projectUuid = projectUuid;
        }
        
        const service = await db.Service.findOne({ where: whereClause });
        if (!service) {
            return res.json({ success: false, message: 'Service not found' });
        }
        
        // Configuration is already decrypted by model hook
        let configuration = {};
        if (service.configuration) {
            // Configuration is already decrypted by model hook
            configuration = typeof service.configuration === 'string' 
                ? JSON.parse(service.configuration) 
                : service.configuration;
        }
        
        // Check if service is configured (all required fields filled)
        const isConfigured = serviceDefinitions.isServiceConfigured(req.params.name, configuration);
        
        res.json({
            success: true,
            data: {
                id: service.id,
                uuid: service.uuid,
                name: service.name,
                active: service.active,
                configured: isConfigured,
                projectUuid: service.projectUuid,
                configuration: configuration // Return full decrypted configuration for form editing
            }
        });
    } catch (error) {
        logger.error('ServicesController.getService - Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load service',
            error: error.message
        });
    }
};

/**
 * Test service credentials (API endpoint)
 * @route POST /api/services/:name/test
 */
ServicesController.testCredentials = async (req, res) => {
    const startTime = Date.now();
    const { name } = req.params;
    const { configuration, projectUuid } = req.body;

    logger.info('ServicesController.testCredentials - Request received:', {
        serviceName: name,
        projectUuid: projectUuid || 'not-provided',
        hasConfiguration: !!configuration,
        configurationKeys: configuration ? Object.keys(configuration) : [],
        timestamp: new Date().toISOString()
    });

    try {
        // Check if service is registered
        const serviceDef = serviceDefinitions.getService(name);
        if (!serviceDef) {
            logger.warn('ServicesController.testCredentials - Service not found:', {
                serviceName: name
            });
            return res.status(400).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Validate configuration first
        if (!configuration || typeof configuration !== 'object') {
            logger.warn('ServicesController.testCredentials - Invalid configuration format:', {
                serviceName: name,
                configurationType: typeof configuration
            });
            return res.status(400).json({
                success: false,
                message: 'Configuration is required',
                error: 'Configuration must be an object'
            });
        }

        logger.info('ServicesController.testCredentials - Validating configuration:', {
            serviceName: name,
            configurationKeys: Object.keys(configuration),
            configurationValues: Object.keys(configuration).reduce((acc, key) => {
                // Don't log sensitive values, just indicate if they exist
                acc[key] = configuration[key] ? '***' : 'empty';
                return acc;
            }, {})
        });

        const validation = serviceDefinitions.validateServiceConfiguration(name, configuration);
        if (validation.error) {
            logger.warn('ServicesController.testCredentials - Validation failed:', {
                serviceName: name,
                validationErrors: validation.error
            });
            return res.status(400).json({
                success: false,
                message: 'Invalid configuration',
                errors: validation.error
            });
        }

        logger.info('ServicesController.testCredentials - Validation passed, testing credentials:', {
            serviceName: name,
            validatedKeys: Object.keys(validation.value)
        });

        // Get platform service and test credentials
        const PlatformServiceFactory = require('../services/platform');
        const platformService = PlatformServiceFactory.getService(name);
        
        if (!platformService) {
            logger.warn('ServicesController.testCredentials - Platform service not available:', {
                serviceName: name
            });
            return res.status(400).json({
                success: false,
                message: 'Testing not supported for this platform',
                error: `Testing not implemented for ${name}`
            });
        }

        logger.info('ServicesController.testCredentials - Calling platform service:', {
            serviceName: name
        });

        const testStartTime = Date.now();
        const result = await PlatformServiceFactory.testCredentials(name, validation.value);
        const testDuration = Date.now() - testStartTime;

        logger.info('ServicesController.testCredentials - Test completed:', {
            serviceName: name,
            success: result.success,
            message: result.message,
            testDuration: `${testDuration}ms`,
            totalDuration: `${Date.now() - startTime}ms`,
            hasError: !!result.error,
            hasData: !!result.data
        });

        if (result.error) {
            logger.warn('ServicesController.testCredentials - Test failed:', {
                serviceName: name,
                error: result.error,
                message: result.message
            });
        } else {
            logger.info('ServicesController.testCredentials - Test succeeded:', {
                serviceName: name,
                dataKeys: result.data ? Object.keys(result.data) : []
            });
        }

        return res.json(result);
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('ServicesController.testCredentials - Exception occurred:', error);
        
        logger.error('ServicesController.testCredentials - Exception details:', {
            serviceName: name,
            errorMessage: error.message,
            errorCode: error.code,
            errorStack: error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace',
            duration: `${duration}ms`
        });

        return res.status(500).json({
            success: false,
            message: 'Failed to test credentials',
            error: error.message || 'Internal server error'
        });
    }
};

module.exports = ServicesController;

