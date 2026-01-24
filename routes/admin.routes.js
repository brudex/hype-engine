const express = require('express');
const router = express.Router();

// Controllers
const LogsAdminController = require('../controllers/admin/logs.admin.controller');
const JobsAdminController = require('../controllers/admin/jobs.admin.controller');

// Middleware
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Apply authentication and admin middleware to all admin routes
router.use(authMiddleware.requireLogin);
router.use(adminMiddleware.requireAdmin);

// ============================================
// Admin Pages
// ============================================

// Logs page
router.get('/logs', LogsAdminController.index);

// Jobs page
router.get('/jobs', JobsAdminController.index);

// ============================================
// Admin API Routes
// ============================================

// Logs API
router.get('/api/logs', LogsAdminController.getLogs);
router.get('/api/logs/summary', LogsAdminController.getSummary);
router.get('/api/logs/:uuid', LogsAdminController.getLogDetail);
router.get('/api/logs/:uuid/view', LogsAdminController.getLogDetailView);
router.post('/api/logs/cleanup', LogsAdminController.cleanup);

// Jobs API
router.get('/api/jobs', JobsAdminController.getJobs);
router.get('/api/jobs/:uuid', JobsAdminController.getJobDetails);

module.exports = router;
