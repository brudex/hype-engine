const db = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

const LogsAdminController = {};

/**
 * Render logs page
 * @route GET /admin/logs
 */
LogsAdminController.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const level = req.query.level || null;
        const service = req.query.service || null;
        const search = req.query.search || null;
        
        const offset = (page - 1) * limit;
        
        // Build where clause
        const where = {};
        if (level) {
            where.level = level;
        }
        if (service) {
            where.service = service;
        }
        if (search) {
            where.message = {
                [Op.iLike]: `%${search}%`
            };
        }
        
        // Get logs with pagination
        const { count, rows: logs } = await db.Log.findAndCountAll({
            where: where,
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset
        });
        
        // Get distinct levels and services for filters
        const levels = await db.Log.findAll({
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('level')), 'level']],
            raw: true
        });
        
        const services = await db.Log.findAll({
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('service')), 'service']],
            raw: true
        });
        
        const totalPages = Math.ceil(count / limit);
        
        res.render('admin/logs', {
            layout: 'layouts/dashboard/index',
            currentPage: 'admin-logs',
            user: req.user,
            logs: logs,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: count,
                limit: limit
            },
            filters: {
                level: level,
                service: service,
                search: search,
                levels: levels.map(l => l.level),
                services: services.map(s => s.service)
            }
        });
    } catch (error) {
        logger.error('Logs admin controller error:', error);
        res.status(500).render('error', {
            message: 'Failed to load logs',
            error: error.message,
            layout: 'layouts/dashboard/index'
        });
    }
};

/**
 * Get logs API endpoint
 * @route GET /admin/api/logs
 */
LogsAdminController.getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const level = req.query.level || null;
        const service = req.query.service || null;
        const search = req.query.search || null;
        
        const offset = (page - 1) * limit;
        
        // Build where clause
        const where = {};
        if (level) {
            where.level = level;
        }
        if (service) {
            where.service = service;
        }
        if (search) {
            where.message = {
                [Op.iLike]: `%${search}%`
            };
        }
        
        // Get logs with pagination
        const { count, rows: logs } = await db.Log.findAndCountAll({
            where: where,
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset
        });
        
        res.json({
            success: true,
            data: {
                logs: logs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    limit: limit
                }
            }
        });
    } catch (error) {
        logger.error('Get logs API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch logs',
            error: error.message
        });
    }
};

/**
 * Cleanup old logs
 * @route POST /admin/logs/cleanup
 */
LogsAdminController.cleanup = async (req, res) => {
    try {
        const daysToKeep = parseInt(req.body.daysToKeep) || 30;
        
        const deletedCount = await db.Log.cleanup(daysToKeep);
        
        res.json({
            success: true,
            message: `Cleaned up logs older than ${daysToKeep} days`,
            deletedCount: deletedCount
        });
    } catch (error) {
        logger.error('Logs cleanup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cleanup logs',
            error: error.message
        });
    }
};

module.exports = LogsAdminController;
