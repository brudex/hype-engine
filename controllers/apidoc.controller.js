const logger = require('../utils/logger');
const config = require('../config/config');

const ApiDocController = {};

/**
 * API Documentation Index Page
 * @route GET /dashboard/apidoc
 */
ApiDocController.index = async (req, res) => {
    try {
        const userUuid = req.user?.uuid;
        
        if (!userUuid) {
            return res.redirect('/login');
        }

        // Get base URL from config (without /api/v1 since it's included in endpoints)
        const baseUrl = config.siteurl || 'https://your-domain.com';

        res.render('dashboard/apidoc/index', {
            layout: 'layouts/dashboard/index',
            currentPage: 'apidoc',
            apiBaseUrl: baseUrl
        });
    } catch (error) {
        logger.error('API Doc index error:', error);
        res.status(500).render('error', {
            message: 'Failed to load API documentation',
            error: error.message,
            layout: 'layouts/dashboard/index'
        });
    }
};

module.exports = ApiDocController;
