const db = require('../models');
const logger = require('../utils/logger');

/**
 * API v1 Authentication Middleware
 * Validates Bearer token (API key) from Authorization header
 * Based on Mixpost API documentation: https://docs.mixpost.app/api/
 */
const validateApiV1Token = async (req, res, next) => {
    try {
        // Extract Bearer token from Authorization header
        const authHeader = req.headers.authorization;
        console.log("req.headers >>>> " + JSON.stringify(req.headers));
        console.log("authHeader >>>> " + authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Missing or invalid Authorization header. Use: Authorization: Bearer <token>'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log("token >>>> " + token);
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'API token is required'
            });
        }

        // Find API key in database
        const apiKey = await db.ApiKey.findOne({
            where: {
                key: token,
                isActive: true
            },
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['uuid', 'email', 'fullName']
            }]
        });

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Invalid or inactive API token'
            });
        }

        // Update last used timestamp
        await apiKey.update({
            lastUsedAt: new Date()
        });

        // Attach user and API key info to request
        req.apiKey = {
            uuid: apiKey.uuid,
            name: apiKey.name,
            scopes: apiKey.scopes
        };
        req.user = {
            uuid: apiKey.userUuid,
            email: apiKey.user?.email,
            name: apiKey.user?.fullName || apiKey.user?.name
        };

        if (!req.user.uuid) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'API key has no associated user'
            });
        }

        next();
    } catch (error) {
        logger.error('API v1 authentication error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Authentication failed'
        });
    }
};

module.exports = validateApiV1Token;

