/**
 * OAuth config definitions for app-wide OAuth connect
 * Replicated from socialaccount-api-definitions for OAuth Connect flow (separate from project-based services)
 */

const Joi = require('joi');

const services = {
    twitter: {
        name: 'twitter',
        nameLocalized: 'Twitter',
        exposedFormAttributes: ['tier'],
        form: () => [
            { fieldLabel: 'Consumer Key', fieldName: 'consumer_key', fieldType: 'text' },
            { fieldLabel: 'Consumer Secret', fieldName: 'consumer_secret', fieldType: 'password' }
        ],
        schema: () => Joi.object({
            consumer_key: Joi.string().required().messages({
                'string.empty': 'Consumer Key is required.',
                'any.required': 'Consumer Key is required.'
            }),
            consumer_secret: Joi.string().required().messages({
                'string.empty': 'Consumer Secret is required.',
                'any.required': 'Consumer Secret is required.'
            })
            
        })
    },

    facebook: {
        name: 'facebook',
        nameLocalized: 'Facebook',
        exposedFormAttributes: ['api_version'],
        secretFormAttributes: [],
        versions: () => ['v25.0', 'v24.0', 'v23.0', 'v22.0', 'v21.0', 'v20.0', 'v19.0', 'v18.0', 'v17.0', 'v16.0'],
        form: function () {
            return [
                { fieldLabel: 'App ID', fieldName: 'app_id', fieldType: 'text' },
                { fieldLabel: 'App Secret', fieldName: 'app_secret', fieldType: 'password' },
                { fieldLabel: 'API Version', fieldName: 'api_version', fieldType: 'select', options: this.versions() },
                { fieldLabel: 'Redirect URI', fieldName: 'redirect_uri', fieldType: 'text' }
            ];
        },
        schema: () => Joi.object({
            app_id: Joi.string().required().messages({
                'string.empty': 'The App ID is required.',
                'any.required': 'The App ID is required.'
            }),
            app_secret: Joi.string().required().messages({
                'string.empty': 'The App Secret is required.',
                'any.required': 'The App Secret is required.'
            }),
            redirect_uri: Joi.string().uri().required().messages({
                'string.empty': 'The Redirect URI is required.',
                'string.uri': 'The Redirect URI must be a valid URL.',
                'any.required': 'The Redirect URI is required.'
            }),
            api_version: Joi.string().valid('v25.0', 'v24.0', 'v23.0', 'v22.0', 'v21.0', 'v20.0', 'v19.0', 'v18.0', 'v17.0', 'v16.0').required().messages({
                'any.only': 'API Version must be one of the supported versions',
                'any.required': 'The API Version is required.'
            })
        })
    },

    instagram: {
        name: 'instagram',
        nameLocalized: 'Instagram',
        exposedFormAttributes: [],
        secretFormAttributes: [],
        form: () => [
            { fieldLabel: 'Client ID', fieldName: 'client_id', fieldType: 'text' },
            { fieldLabel: 'Client Secret', fieldName: 'client_secret', fieldType: 'password' }
        ],
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
        form: () => [
            { fieldLabel: 'Client ID', fieldName: 'client_id', fieldType: 'text' },
            { fieldLabel: 'Client Secret', fieldName: 'client_secret', fieldType: 'password' }
        ],
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
        secretFormAttributes: ['client_secret'],
        form: () => [
            { fieldLabel: 'Client ID', fieldName: 'client_id', fieldType: 'text' },
            { fieldLabel: 'Client Secret', fieldName: 'client_secret', fieldType: 'password' },
            { fieldLabel: 'Instance URL', fieldName: 'instance_url', fieldType: 'text' }
        ],
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
        secretFormAttributes: ['client_secret'],
        form: () => [
            { fieldLabel: 'Client ID', fieldName: 'client_id', fieldType: 'text' },
            { fieldLabel: 'Client Secret', fieldName: 'client_secret', fieldType: 'password' }
        ],
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
        secretFormAttributes: [],
        form: () => [
            { fieldLabel: 'API Key', fieldName: 'client_id', fieldType: 'text' }
        ],
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
        secretFormAttributes: [],
        form: () => [
            { fieldLabel: 'API Key', fieldName: 'client_id', fieldType: 'text' }
        ],
        schema: () => Joi.object({
            client_id: Joi.string().required().messages({
                'string.empty': 'The API Key is required.',
                'any.required': 'The API Key is required.'
            })
        })
    }
};

function getService(serviceName) {
    return services[serviceName] || null;
}

function getAllServices() {
    return services;
}

function getServiceNames() {
    return Object.keys(services);
}

function isServiceRegistered(serviceName) {
    return !!services[serviceName];
}

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

function getConfigurationWithoutSecrets(serviceName, configuration) {
    const service = getService(serviceName);
    if (!service || !configuration || typeof configuration !== 'object') {
        return {};
    }
    const secretFields = Array.isArray(service.secretFormAttributes) ? service.secretFormAttributes : [];
    const result = { ...configuration };
    for (const field of secretFields) {
        if (Object.prototype.hasOwnProperty.call(result, field)) {
            delete result[field];
        }
    }
    return result;
}

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
    getExposedConfiguration,
    getConfigurationWithoutSecrets
};
