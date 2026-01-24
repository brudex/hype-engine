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
        // Get distinct levels for filters (only data needed for initial render)
        const distinctLevels = await db.Log.findAll({
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('level')), 'level']],
            raw: true
        });
        
        // Get distinct services for filters
        const distinctServices = await db.Log.findAll({
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('service')), 'service']],
            where: {
                service: { [Op.ne]: null }
            },
            raw: true
        });
        
        res.render('admin/logs', {
            layout: 'layouts/dashboard/index',
            currentPage: 'admin-logs',
            user: req.user,
            filters: {
                levels: distinctLevels.map(l => l.level),
                services: distinctServices.map(s => s.service).filter(s => s).sort()
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
        const limit = parseInt(req.query.limit) || 1000;
        const level = req.query.level || null;
        const service = req.query.service || null;
        const search = req.query.search || null;
        const timeRange = req.query.timeRange || null;
        const startDate = req.query.startDate || null;
        const endDate = req.query.endDate || null;
        
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
        
        // Handle time range
        if (timeRange) {
            const now = new Date();
            let rangeStartDate = null;
            
            switch (timeRange) {
                case '15m':
                    rangeStartDate = new Date(now.getTime() - 15 * 60 * 1000);
                    break;
                case '1h':
                    rangeStartDate = new Date(now.getTime() - 60 * 60 * 1000);
                    break;
                case '24h':
                    rangeStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case 'custom':
                    if (startDate && endDate) {
                        // For date-only inputs, set startDate to beginning of day and endDate to end of day
                        const start = new Date(startDate);
                        start.setHours(0, 0, 0, 0);
                        const end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        where.createdAt = {
                            [Op.between]: [start, end]
                        };
                    } else if (startDate) {
                        // Set startDate to beginning of day
                        const start = new Date(startDate);
                        start.setHours(0, 0, 0, 0);
                        where.createdAt = {
                            [Op.gte]: start
                        };
                    } else if (endDate) {
                        // Set endDate to end of day
                        const end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        where.createdAt = {
                            [Op.lte]: end
                        };
                    }
                    break;
            }
            
            if (rangeStartDate && timeRange !== 'custom') {
                where.createdAt = {
                    [Op.gte]: rangeStartDate
                };
            }
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
 * Get log summary stats
 * @route GET /admin/api/logs/summary
 */
LogsAdminController.getSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const totalLogs = await db.Log.count();
        const errorsToday = await db.Log.count({
            where: {
                level: 'error',
                createdAt: { [Op.gte]: today }
            }
        });
        const warningsToday = await db.Log.count({
            where: {
                level: 'warn',
                createdAt: { [Op.gte]: today }
            }
        });
        const lastLog = await db.Log.findOne({
            order: [['createdAt', 'DESC']],
            attributes: ['createdAt']
        });
        
        res.json({
            success: true,
            data: {
                totalLogs: totalLogs,
                errorsToday: errorsToday,
                warningsToday: warningsToday,
                lastLogTimestamp: lastLog ? lastLog.createdAt : null
            }
        });
    } catch (error) {
        logger.error('Get logs summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch summary',
            error: error.message
        });
    }
};

/**
 * Get single log detail (JSON)
 * @route GET /admin/api/logs/:uuid
 */
LogsAdminController.getLogDetail = async (req, res) => {
    try {
        const log = await db.Log.findByPk(req.params.uuid);
        
        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Log not found'
            });
        }
        
        res.json({
            success: true,
            data: log
        });
    } catch (error) {
        logger.error('Get log detail error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch log detail',
            error: error.message
        });
    }
};

/**
 * Render log detail view (HTML)
 * @route GET /admin/api/logs/:uuid/view
 */
LogsAdminController.getLogDetailView = async (req, res) => {
    try {
        const log = await db.Log.findByPk(req.params.uuid);
        
        if (!log) {
            return res.status(404).send('Log not found');
        }
        
        // Format date info
        const date = new Date(log.createdAt);
        const now = new Date();
        const diff = now - date;
        
        let relativeTime = '';
        if (diff < 60000) {
            relativeTime = 'Just now';
        } else if (diff < 3600000) {
            relativeTime = `${Math.floor(diff / 60000)}m ago`;
        } else if (diff < 86400000) {
            relativeTime = `${Math.floor(diff / 3600000)}h ago`;
        } else {
            relativeTime = `${Math.floor(diff / 86400000)}d ago`;
        }
        
        const dateInfo = {
            absolute: date.toLocaleString(),
            relative: relativeTime
        };
        
        res.render('admin/_log-detail', {
            log: log,
            dateInfo: dateInfo
        });
    } catch (error) {
        logger.error('Get log detail view error:', error);
        res.status(500).send('Failed to render log detail');
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
