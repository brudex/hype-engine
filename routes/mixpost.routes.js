const express = require('express');
const router = express.Router();

// Controllers
const DashboardController = require('../controllers/dashboard.controller');
const ProjectsController = require('../controllers/projects.controller');
const AccountsController = require('../controllers/accounts.controller');
const PostsController = require('../controllers/posts.controller');
const MediaController = require('../controllers/media.controller');
const TagsController = require('../controllers/tags.controller');
const OauthConfigAdminController = require('../controllers/admin/oauth-config.admin.controller');
const SettingsController = require('../controllers/settings.controller');
const CalendarController = require('../controllers/calendar.controller');
const ReportsController = require('../controllers/reports.controller');
const ApiDocController = require('../controllers/apidoc.controller');
const AccessTokenController = require('../controllers/access-token.controller');
const IntegrationController = require('../controllers/integrations/integration.controller');

// Middleware
const authMiddleware = require('../middlewares/auth.middleware');

// Unauthenticated: OAuth callback redirects here; user may not have session in same tab
router.get('/accounts/connect-status/:accountUuid', AccountsController.connectStatus);

// Apply authentication middleware to all other dashboard routes
// Use requireLogin for session-based authentication (Passport)
// Use requireRegisteredUser for routes that need registered accounts (not guests)
// Use requireAdmin for admin-only routes
router.use(authMiddleware.requireLogin);

// ============================================
// Dashboard
// ============================================

// Dashboard Page Routes
router.get('/', DashboardController.index);
router.get('/error', DashboardController.errorPage);

// Dashboard API Routes
router.get('/api/dashboard/global', DashboardController.getGlobalMetrics);
router.get('/api/dashboard/project/:projectUuid', DashboardController.getProjectMetrics);

// ============================================
// Projects
// ============================================

// Projects Page Routes
router.get('/projects', ProjectsController.index);
router.get('/projects/create', ProjectsController.createProjectPage);
router.get('/projects/:uuid', ProjectsController.renderProjectPage);

// Projects API Routes
router.get('/api/projects', ProjectsController.list);
router.get('/api/projects/:uuid', ProjectsController.getProjectDetails);
router.post('/api/projects', ProjectsController.createProjectPost);
router.post('/projects', ProjectsController.createProjectPost);
router.put('/api/projects/:uuid', ProjectsController.update);
router.put('/projects/:uuid', ProjectsController.update);
router.delete('/api/projects/:uuid', ProjectsController.delete);
router.delete('/projects/:uuid', ProjectsController.delete);

// ============================================
// Accounts
// ============================================

// Connect integration (start OAuth / connect flow for a project)
router.get('/integrations/:platformName/connect/:projectUuid', IntegrationController.connectIntegration);

// Accounts Page Routes
router.get('/accounts', AccountsController.index);
router.get('/accounts/:projectUuid', AccountsController.index);
router.get('/projects/:projectUuid/accounts', AccountsController.index);
router.get('/projects/:projectUuid/tags', TagsController.index);

// Accounts API Routes
router.get('/api/accounts/project/:projectUuid', AccountsController.getAccounts);
router.get('/api/accounts/single/:uuid', AccountsController.getAccount);
router.post('/api/accounts/configure-apikey/:platformName', AccountsController.saveApiKeyConfiguration);
router.put('/api/accounts/:uuid', AccountsController.update);
router.delete('/api/accounts/:uuid', AccountsController.delete);


// ============================================
// Posts
// ============================================

// Posts Page Routes
router.get('/posts', PostsController.index);
router.get('/posts/:projectUuid', PostsController.index);
router.get('/posts/create/:projectUuid/:schedule_at?', PostsController.create);
router.get('/posts/edit/:uuid', PostsController.edit);
router.get('/posts/duplicate/:uuid', PostsController.duplicatePost);

// Posts API Routes
router.get('/api/posts/list/:projectUuid', PostsController.list);
router.get('/api/posts/details/:uuid', PostsController.getPost);
router.post('/api/posts/save', PostsController.save);
router.post('/api/posts/update', PostsController.update);
router.get('/api/posts/delete/:uuid', PostsController.delete);
router.post('/api/posts/delete-multiple', PostsController.deleteMultiple);

// ============================================
// Media
// ============================================

// Media Page Routes
router.get('/media', MediaController.index);

// Media API Routes
router.get('/api/media/uploaded', MediaController.fetchUploads);
router.get('/api/media/stock', MediaController.fetchStock);
router.get('/api/media/gifs', MediaController.fetchGifs);
router.post('/api/media/upload', MediaController.uploadMedia);
router.post('/api/media/download', MediaController.downloadExternal);
router.delete('/api/media', MediaController.delete);
router.delete('/media', MediaController.delete);

// ============================================
// Tags
// ============================================

// Tags Page Routes
router.get('/tags/project/:projectUuid', TagsController.getByProject);
router.post('/tags/create', TagsController.store);
router.post('/tags/update', TagsController.update);
router.delete('/tags/delete/:uuid', TagsController.delete);
router.delete('/tags/:uuid', TagsController.delete);

// Tags API Routes
router.get('/api/tags/project/:projectUuid', TagsController.getByProject);
router.post('/api/tags/create', TagsController.store);
router.post('/api/tags/update', TagsController.update);
router.delete('/api/tags/delete/:uuid', TagsController.delete);

// ============================================
// Reports
// ============================================

// Reports Page Routes
router.get('/reports', ReportsController.index);
router.get('/reports/:projectUuid', ReportsController.index);

// Reports API Routes
router.get('/api/reports', ReportsController.index);
router.post('/api/reports/project/:projectUuid', ReportsController.getReports);



// ============================================
// OAuth Connect (app-wide, no project)
// ============================================

// OAuth Connect Page Routes
router.get('/oauth-connect', OauthConfigAdminController.index);
router.get('/oauth-connect/configure/:platformName', OauthConfigAdminController.configurePage);
router.post('/oauth-connect/configure/:platformName', OauthConfigAdminController.configure);

// OAuth Connect API Routes
router.get('/api/oauth-connect', OauthConfigAdminController.list);
router.get('/api/oauth-connect/:name', OauthConfigAdminController.getService);
router.post('/api/oauth-connect/:name/test', OauthConfigAdminController.testCredentials);

// ============================================
// Settings
// ============================================

// Settings Page Routes
router.get('/settings', SettingsController.index);
router.get('/settings/project/:projectUuid', SettingsController.index);

// Settings API Routes
router.get('/api/settings', SettingsController.getSettings);
router.put('/api/settings', SettingsController.update);
router.put('/settings', SettingsController.update);

// ============================================
// Calendar
// ============================================

// Calendar Page Routes
router.get('/calendar', CalendarController.index);
router.get('/calendar/project/:projectUuid', CalendarController.index);
router.get('/calendar/project/:projectUuid/:date?/:type?', CalendarController.index);
router.get('/calendar/:date?/:type?', CalendarController.index);

// Calendar API Routes
router.get('/api/calendar', CalendarController.getCalendarData);
router.post('/api/calendar', CalendarController.getCalendarData);

// ============================================
// API Documentation
// ============================================

// API Documentation Page Routes
router.get('/apidoc', ApiDocController.index);

// ============================================
// Access Tokens
// ============================================

// Access Tokens Page Routes
router.get('/access-tokens', AccessTokenController.index);

// Access Tokens API Routes
router.get('/api/access-tokens', AccessTokenController.list);
router.get('/api/access-tokens/:uuid', AccessTokenController.get);
router.post('/api/access-tokens', AccessTokenController.create);
router.delete('/api/access-tokens/:uuid', AccessTokenController.delete);

module.exports = router;
