/**
 * Service definitions for social media platforms
 * Defines form structure, validation rules, and messages for each service
 */

const Joi = require('joi');

const services = {
    twitter: {
        name: 'twitter',
        nameLocalized: 'Twitter',
        exposedFormAttributes: ['tier'], // Non-sensitive fields that can be shown to users
        form: () => ({
            client_id: '',
            client_secret: '',
            tier: 'free'
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The API Key is required.',
                'any.required': 'The API Key is required.'
            }),
            client_secret: Joi.string().required().messages({
                'string.empty': 'The API Secret is required.',
                'any.required': 'The API Secret is required.'
            }),
            tier: Joi.string().valid('legacy', 'free', 'basic').required().messages({
                'any.only': 'Tier must be one of: legacy, free, basic',
                'any.required': 'Tier is required.'
            })
        })
    },

    facebook: {
        name: 'facebook',
        nameLocalized: 'Facebook',
        exposedFormAttributes: ['api_version'],
        versions: () => ['v24.0', 'v23.0', 'v22.0', 'v21.0', 'v20.0', 'v19.0', 'v18.0', 'v17.0', 'v16.0'],
        form: () => ({
            app_id: '',
            app_secret: '',
            api_version: 'v24.0'
        }),
        schema: () => Joi.object({
            app_id: Joi.string().required().messages({
                'string.empty': 'The App ID is required.',
                'any.required': 'The App ID is required.'
            }),
            app_secret: Joi.string().required().messages({
                'string.empty': 'The App Secret is required.',
                'any.required': 'The App Secret is required.'
            }),
            api_version: Joi.string().valid('v24.0', 'v23.0', 'v22.0', 'v21.0', 'v20.0', 'v19.0', 'v18.0', 'v17.0', 'v16.0').required().messages({
                'any.only': 'API Version must be one of the supported versions',
                'any.required': 'The API Version is required.'
            })
        })
    },

    instagram: {
        name: 'instagram',
        nameLocalized: 'Instagram',
        exposedFormAttributes: [],
        form: () => ({
            client_id: '',
            client_secret: ''
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The Client ID is required.',
                'any.required': 'The Client ID is required.'
            }),
            client_secret: Joi.string().required().messages({
                'string.empty': 'The Client Secret is required.',
                'any.required': 'The Client Secret is required.'
            })
        })
    },

    linkedin: {
        name: 'linkedin',
        nameLocalized: 'LinkedIn',
        exposedFormAttributes: [],
        form: () => ({
            client_id: '',
            client_secret: ''
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The Client ID is required.',
                'any.required': 'The Client ID is required.'
            }),
            client_secret: Joi.string().required().messages({
                'string.empty': 'The Client Secret is required.',
                'any.required': 'The Client Secret is required.'
            })
        })
    },

    mastodon: {
        name: 'mastodon',
        nameLocalized: 'Mastodon',
        exposedFormAttributes: ['instance_url'],
        form: () => ({
            client_id: '',
            client_secret: '',
            instance_url: ''
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The Client ID is required.',
                'any.required': 'The Client ID is required.'
            }),
            client_secret: Joi.string().required().messages({
                'string.empty': 'The Client Secret is required.',
                'any.required': 'The Client Secret is required.'
            }),
            instance_url: Joi.string().uri().required().messages({
                'string.empty': 'The Instance URL is required.',
                'string.uri': 'The Instance URL must be a valid URL.',
                'any.required': 'The Instance URL is required.'
            })
        })
    },

    tiktok: {
        name: 'tiktok',
        nameLocalized: 'TikTok',
        exposedFormAttributes: [],
        form: () => ({
            client_id: '',
            client_secret: ''
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The Client ID is required.',
                'any.required': 'The Client ID is required.'
            }),
            client_secret: Joi.string().required().messages({
                'string.empty': 'The Client Secret is required.',
                'any.required': 'The Client Secret is required.'
            })
        })
    },

    unsplash: {
        name: 'unsplash',
        nameLocalized: 'Unsplash',
        exposedFormAttributes: [],
        form: () => ({
            client_id: ''
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The API Key is required.',
                'any.required': 'The API Key is required.'
            })
        })
    },

    tenor: {
        name: 'tenor',
        nameLocalized: 'Tenor',
        exposedFormAttributes: [],
        form: () => ({
            client_id: ''
        }),
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The API Key is required.',
                'any.required': 'The API Key is required.'
            })
        })
    }
};

/**
 * Get service definition by name
 * @param {string} serviceName - The service name
 * @returns {object|null} - Service definition or null if not found
 */
function getService(serviceName) {
    return services[serviceName] || null;
}

/**
 * Get all registered services
 * @returns {object} - Object with all service definitions
 */
function getAllServices() {
    return services;
}

/**
 * Get service names
 * @returns {string[]} - Array of service names
 */
function getServiceNames() {
    return Object.keys(services);
}

/**
 * Check if a service is registered
 * @param {string} serviceName - The service name
 * @returns {boolean}
 */
function isServiceRegistered(serviceName) {
    return !!services[serviceName];
}

/**
 * Validate service configuration using Joi schema
 * @param {string} serviceName - The service name
 * @param {object} configuration - The configuration to validate
 * @returns {object} - { error: object|null, value: object|null }
 */
function validateServiceConfiguration(serviceName, configuration) {
    const service = getService(serviceName);
    if (!service) {
        return {
            error: { _general: 'Service not found' },
            value: null
        };
    }

    const schema = service.schema();
    const { error, value } = schema.validate(configuration, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        // Format Joi errors into a simple object
        const errors = {};
        error.details.forEach((detail) => {
            const field = detail.path.join('.');
            errors[field] = detail.message;
        });

        return {
            error: errors,
            value: null
        };
    }

    return {
        error: null,
        value: value
    };
}


/**
 * Get exposed (non-sensitive) configuration fields
 * @param {string} serviceName - The service name
 * @param {object} configuration - Full configuration
 * @returns {object} - Only exposed fields
 */
function getExposedConfiguration(serviceName, configuration) {
    const service = getService(serviceName);
    if (!service || !service.exposedFormAttributes || service.exposedFormAttributes.length === 0) {
        return {};
    }

    const exposed = {};
    for (const field of service.exposedFormAttributes) {
        if (configuration[field] !== undefined) {
            exposed[field] = configuration[field];
        }
    }

    return exposed;
}

/**
 * Check if service is configured (all required fields are filled)
 * @param {string} serviceName - The service name
 * @param {object} configuration - The configuration to check
 * @returns {boolean}
 */
function isServiceConfigured(serviceName, configuration) {
    const validation = validateServiceConfiguration(serviceName, configuration);
    return !validation.error;
}

module.exports = {
    getService,
    getAllServices,
    getServiceNames,
    isServiceRegistered,
    validateServiceConfiguration,
    isServiceConfigured,
    getExposedConfiguration
};

