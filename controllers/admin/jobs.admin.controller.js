const db = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

const JobsAdminController = {};

/**
 * Render jobs page
 * @route GET /admin/jobs
 */
JobsAdminController.index = async (req, res) => {
    try {
        res.render('admin/jobs', {
            layout: 'layouts/dashboard/index',
            currentPage: 'admin-jobs',
            user: req.user,
            filters: {
                status: req.query.status || null
            }
        });
    } catch (error) {
        logger.error('Jobs admin controller error:', error);
        res.status(500).render('error', {
            message: 'Failed to load jobs',
            error: error.message,
            layout: 'layouts/dashboard/index'
        });
    }
};

/**
 * Get jobs API endpoint
 * @route GET /admin/api/jobs
 */
JobsAdminController.getJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const status = req.query.status || null;
        
        const offset = (page - 1) * limit;
        
        // Build where clause
        const where = {};
        if (status === 'active') {
            where.finishedAt = null;
            where.cancelledAt = null;
        } else if (status === 'completed') {
            where.finishedAt = { [Op.ne]: null };
        } else if (status === 'failed') {
            where.failedJobs = { [Op.gt]: 0 };
        } else if (status === 'cancelled') {
            where.cancelledAt = { [Op.ne]: null };
        }
        
        // Get job batches with pagination
        const { count, rows: jobBatches } = await db.JobBatch.findAndCountAll({
            where: where,
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset
        });
        
        res.json({
            success: true,
            data: {
                jobBatches: jobBatches,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    limit: limit
                }
            }
        });
    } catch (error) {
        logger.error('Get jobs API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs',
            error: error.message
        });
    }
};

/**
 * Get job batch details
 * @route GET /admin/api/jobs/:uuid
 */
JobsAdminController.getJobDetails = async (req, res) => {
    try {
        const { uuid } = req.params;
        
        const jobBatch = await db.JobBatch.findOne({
            where: { uuid: uuid }
        });
        
        if (!jobBatch) {
            return res.status(404).json({
                success: false,
                message: 'Job batch not found'
            });
        }
        
        // Calculate progress
        const progress = jobBatch.getProgress();
        
        res.json({
            success: true,
            data: {
                jobBatch: jobBatch,
                progress: progress,
                isFinished: jobBatch.isFinished(),
                isCancelled: jobBatch.isCancelled(),
                isProcessing: jobBatch.isProcessing(),
                hasFailures: jobBatch.hasFailures()
            }
        });
    } catch (error) {
        logger.error('Get job details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job details',
            error: error.message
        });
    }
};

module.exports = JobsAdminController;
