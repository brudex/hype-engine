const db = require('../models');
const logger = require('../utils/logger');
const Joi = require('joi');
const moment = require('moment-timezone');
const TimezoneList = require('../utils/timezone-list');
const { v4: uuidv4 } = require('uuid');

const SettingsController = {};

// Default settings values
const defaultSettings = {
    timezone: 'UTC',
    date_format: 'human',
    time_format: 12,
    week_starts_on: 1,
    admin_email: ''
};

// Joi validation schema for settings
const settingsSchema = Joi.object({
    timezone: Joi.string().required().custom((value, helpers) => {
        if (!moment.tz.zone(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'Timezone validation').messages({
        'string.empty': 'The timezone is required.',
        'any.required': 'The timezone is required.',
        'any.invalid': 'The timezone is invalid.'
    }),
    date_format: Joi.string().default('human').messages({
        'string.empty': 'The date format is required.',
        'any.required': 'The date format is required.'
    }),
    time_format: Joi.number().required().valid(12, 24).messages({
        'number.base': 'The time format must be a number.',
        'any.required': 'The time format is required.',
        'any.only': 'The time format must be 12 or 24.'
    }),
    week_starts_on: Joi.number().required().valid(0, 1).messages({
        'number.base': 'The "week starts on" value must be a number.',
        'any.required': 'The "week starts on" value is required.',
        'any.only': 'The "week starts on" value must be 0 (Sunday) or 1 (Monday).'
    }),
    admin_email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'The admin email is required.',
        'string.email': 'The admin email must be a valid email address.',
        'any.required': 'The admin email is required.'
    })
});

/**
 * Get settings page
 * @route GET /dashboard/settings
 * @route GET /dashboard/settings/project/:projectUuid
 */
SettingsController.index = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            req.flash('error', 'Authentication required');
            return res.redirect('/dashboard');
        }

        // Get projectUuid from params or query
        const projectUuid = req.params.projectUuid || req.query.project;

        // If projectUuid is provided, verify it belongs to the user
        let project = null;
        if (projectUuid) {
            project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });

            if (!project) {
                req.flash('error', 'Project not found');
                return res.redirect('/dashboard/projects');
            }
        }

        // Get all settings for this project from database (if project is selected)
        const settingsMap = { ...defaultSettings };
        if (projectUuid) {
            const settings = await db.Setting.findAll({
                where: { projectUuid: projectUuid }
            });

            settings.forEach(setting => {
                settingsMap[setting.name] = setting.payload;
            });
        }

        // Get timezone list
        const timezoneList = new TimezoneList();
        const timezoneListGrouped = timezoneList.getGroupedList();

        res.render('dashboard/settings/index', {
            settings: settingsMap,
            timezoneList: timezoneListGrouped,
            project: project,
            currentPage: 'settings',
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Settings index error:', error);
        req.flash('error', 'Failed to load settings');
        res.redirect('/dashboard');
    }
};

/**
 * Update settings
 * @route PUT /dashboard/settings
 */
SettingsController.update = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            if (req.path.startsWith('/api/') || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            req.flash('error', 'Authentication required');
            return res.redirect('/dashboard');
        }

        // Get projectUuid from query or body
        const projectUuid = req.query.project || req.body.projectUuid;

        if (!projectUuid) {
            logger.warn('SettingsController.update - Missing projectUuid');
            if (req.path.startsWith('/api/') || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
                return res.status(400).json({
                    success: false,
                    message: 'Project UUID is required'
                });
            }
            req.flash('error', 'Project is required');
            return res.redirect('/dashboard/projects');
        }

        // Verify project belongs to user
        const project = await db.Project.findOne({
            where: {
                uuid: projectUuid,
                userUuid: userUuid
            }
        });

        if (!project) {
            logger.warn('SettingsController.update - Project not found:', {
                projectUuid: projectUuid,
                userUuid: userUuid
            });
            if (req.path.startsWith('/api/') || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
            req.flash('error', 'Project not found');
            return res.redirect('/dashboard/projects');
        }

        const settings = req.body;

        logger.info('SettingsController.update - Request received:', {
            userUuid: userUuid,
            projectUuid: projectUuid,
            settingsKeys: Object.keys(settings),
            timestamp: new Date().toISOString()
        });

        // Validate settings using Joi
        const { error, value } = settingsSchema.validate(settings, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = {};
            error.details.forEach((detail) => {
                const field = detail.path.join('.');
                errors[field] = detail.message;
            });

            logger.warn('SettingsController.update - Validation failed:', {
                userUuid: userUuid,
                projectUuid: projectUuid,
                errors: errors
            });

            if (req.path.startsWith('/api/') || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors
                });
            }

            // Flash first error
            const firstError = Object.values(errors)[0];
            req.flash('error', firstError || 'Validation failed');
            return res.redirect('back');
        }

        // Use validated and sanitized values
        const validatedSettings = value;

        // Update or create each setting for this project
        for (const [name, payload] of Object.entries(validatedSettings)) {
            // Find existing setting for this project
            const existingSetting = await db.Setting.findOne({
                where: {
                    name: name,
                    projectUuid: projectUuid
                }
            });

            if (existingSetting) {
                existingSetting.payload = payload;
                await existingSetting.save();
            } else {
                await db.Setting.create({
                    uuid: uuidv4(),
                    projectUuid: projectUuid,
                    name: name,
                    payload: payload
                });
            }
        }

        logger.info('SettingsController.update - Settings updated successfully:', {
            userUuid: userUuid,
            projectUuid: projectUuid,
            updatedSettings: Object.keys(validatedSettings)
        });

        // Return JSON for API requests
        if (req.path.startsWith('/api/') || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            return res.json({
                success: true,
                message: 'Settings updated successfully',
                data: validatedSettings
            });
        }

        req.flash('success', 'Settings updated successfully');
        res.redirect(`/dashboard/settings/project/${projectUuid}`);
    } catch (error) {
        logger.error('Settings update error:', error);
        
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update settings',
                error: error.message
            });
        }

        req.flash('error', 'Failed to update settings');
        res.redirect('back');
    }
};

/**
 * Get settings (API endpoint)
 * @route GET /api/settings
 */
SettingsController.getSettings = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const projectUuid = req.query.projectUuid;

        if (!projectUuid) {
            return res.status(400).json({
                success: false,
                message: 'Project UUID is required'
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

        // Get all settings for this project from database
        const settings = await db.Setting.findAll({
            where: { projectUuid: projectUuid }
        });

        // Format settings as key-value pairs, merge with defaults
        const settingsMap = { ...defaultSettings };
        settings.forEach(setting => {
            settingsMap[setting.name] = setting.payload;
        });

        return res.json({
            success: true,
            data: settingsMap
        });
    } catch (error) {
        logger.error('SettingsController.getSettings - Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load settings',
            error: error.message
        });
    }
};

module.exports = SettingsController;

