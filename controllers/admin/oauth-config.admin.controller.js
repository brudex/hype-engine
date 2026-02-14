const db = require('../../models');
const logger = require('../../utils/logger');
const { v4: uuidv4 } = require('uuid');
const oauthConfigDefinitions = require('../../services/oauth-config-definitions');

const OauthConfigAdminController = {};

/**
 * OAuth Connect index – app-wide OAuth services (no project).
 * @route GET /dashboard/oauth-connect
 */
OauthConfigAdminController.index = async (req, res) => {
    try {
        const services = await db.OauthService.findAll({
            order: [['name', 'ASC']]
        });

        const formattedServices = services.map(service => ({
            id: service.id,
            uuid: service.uuid,
            name: service.name,
            active: service.active,
            configured: !!service.configuration
        }));

        res.render('dashboard/oauth-connect/index', {
            services: formattedServices,
            currentPage: 'oauth-connect',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('OAuth Connect index error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load OAuth connect',
            error: error.message
        });
    }
};

/**
 * Show OAuth service configuration form (app-wide).
 * @route GET /dashboard/oauth-connect/configure/:platformName
 */
OauthConfigAdminController.configurePage = async (req, res) => {
    try {
        const { platformName } = req.params;
        const name = platformName;

        const service = await db.OauthService.findOne({ where: { name } });
        const serviceDef = oauthConfigDefinitions.getService(name);

        if (!serviceDef) {
            req.flash('error', 'Service not found');
            return res.redirect('/dashboard/oauth-connect');
        }

        let configuration = {};
        if (service && service.configuration) {
            configuration = typeof service.configuration === 'string'
                ? JSON.parse(service.configuration)
                : service.configuration;
        }

        // Form fields from definition (call with serviceDef so form() can use this.versions() etc.)
        const formFields = serviceDef.form.call(serviceDef);

        res.render('dashboard/oauth-connect/configure', {
            serviceName: name,
            service: service ? {
                ...service.toJSON(),
                configuration
            } : null,
            formFields,
            currentPage: 'oauth-connect',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('OAuth Connect configure page error:', error);
        req.flash('error', 'Failed to load configuration');
        res.redirect('/dashboard/oauth-connect');
    }
};

/**
 * Update OAuth service configuration (app-wide).
 * @route POST /dashboard/oauth-connect/configure/:platformName
 */
OauthConfigAdminController.configure = async (req, res) => {
    try {
        const { platformName } = req.params;
        const name = platformName;

        const serviceDef = oauthConfigDefinitions.getService(name);
        if (!serviceDef) {
            if (req.path.startsWith('/api/')) {
                return res.status(400).json({ success: false, message: 'Service not found' });
            }
            req.flash('error', 'Service not found');
            return res.redirect('back');
        }

        let { configuration, active } = req.body;
        if (!configuration || typeof configuration !== 'object') {
            configuration = {};
        }

        const validation = oauthConfigDefinitions.validateServiceConfiguration(name, configuration);
        if (validation.error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.error
            });
        }
        configuration = validation.value;

        if (active === 'true' || active === true) {
            active = true;
        } else {
            active = false;
        }

        let service = await db.OauthService.findOne({ where: { name } });

        if (!service) {
            service = await db.OauthService.create({
                uuid: uuidv4(),
                name,
                configuration: JSON.stringify(configuration),
                active
            });
        } else {
            service.configuration = JSON.stringify(configuration);
            service.active = active;
            await service.save();
        }

        const isApiPath = req.path.startsWith('/api/');
        const isAjaxRequest = req.headers['x-requested-with'] === 'XMLHttpRequest';
        const acceptsJson = req.headers.accept && req.headers.accept.indexOf('application/json') !== -1;

        if (isApiPath || isAjaxRequest || acceptsJson) {
            return res.json({
                success: true,
                message: 'Service updated successfully',
                data: {
                    name: service.name,
                    active: service.active,
                    configured: !!service.configuration
                }
            });
        }

        req.flash('success', 'Service updated successfully');
        return res.redirect('/dashboard/oauth-connect');
    } catch (error) {
        logger.error('OAuth Connect configure error:', error);
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
 * List all OAuth services (API) – app-wide, no project.
 * @route GET /dashboard/api/oauth-connect
 */
OauthConfigAdminController.list = async (req, res) => {
    try {
        const services = await db.OauthService.findAll({
            order: [['name', 'ASC']]
        });

        const formattedServices = services.map(service => {
            let configuration = {};
            if (service.configuration) {
                configuration = typeof service.configuration === 'string'
                    ? JSON.parse(service.configuration)
                    : service.configuration;
            }
            const isConfigured = oauthConfigDefinitions.isServiceConfigured(service.name, configuration);
            return {
                id: service.id,
                uuid: service.uuid,
                name: service.name,
                active: service.active,
                configured: isConfigured
            };
        });

        return res.json({ success: true, data: formattedServices });
    } catch (error) {
        logger.error('OAuth Connect list error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load OAuth services',
            error: error.message
        });
    }
};

/**
 * Get one OAuth service by name (API).
 * @route GET /dashboard/api/oauth-connect/:name
 */
OauthConfigAdminController.getService = async (req, res) => {
    try {
        const service = await db.OauthService.findOne({ where: { name: req.params.name } });
        if (!service) {
            return res.json({ success: false, message: 'Service not found' });
        }

        let configuration = {};
        if (service.configuration) {
            configuration = typeof service.configuration === 'string'
                ? JSON.parse(service.configuration)
                : service.configuration;
        }
        const isConfigured = oauthConfigDefinitions.isServiceConfigured(req.params.name, configuration);

        res.json({
            success: true,
            data: {
                id: service.id,
                uuid: service.uuid,
                name: service.name,
                active: service.active,
                configured: isConfigured,
                configuration
            }
        });
    } catch (error) {
        logger.error('OAuth Connect getService error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load service',
            error: error.message
        });
    }
};

/**
 * Test OAuth service credentials (API).
 * @route POST /dashboard/api/oauth-connect/:name/test
 */
OauthConfigAdminController.testCredentials = async (req, res) => {
    const { name } = req.params;
    const { configuration } = req.body;

    try {
        const serviceDef = oauthConfigDefinitions.getService(name);
        if (!serviceDef) {
            return res.status(400).json({ success: false, message: 'Service not found' });
        }

        if (!configuration || typeof configuration !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Configuration is required',
                error: 'Configuration must be an object'
            });
        }

        const validation = oauthConfigDefinitions.validateServiceConfiguration(name, configuration);
        if (validation.error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid configuration',
                errors: validation.error
            });
        }

        const PlatformServiceFactory = require('../../services/platform');
        const result = await PlatformServiceFactory.testCredentials(name, validation.value);
        return res.json(result);
    } catch (error) {
        logger.error('OAuth Connect testCredentials error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to test credentials',
            error: error.message
        });
    }
};

module.exports = OauthConfigAdminController;
