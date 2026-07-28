const express = require('express');
const router = express.Router();

// API v1 Controllers
const ProjectsApiController = require('../controllers/api-v1/projects.api.controller');
const AccountsApiController = require('../controllers/api-v1/accounts.api.controller');
const MediaApiController = require('../controllers/api-v1/media.api.controller');
const TagsApiController = require('../controllers/api-v1/tags.api.controller');
const PostsApiController = require('../controllers/api-v1/posts.api.controller');
const { PostWritesApiController } = require('../controllers/api-v1/post-writes.api.controller');
const PostHistoryApiController = require('../controllers/api-v1/post-history.api.controller');

// API v1 Authentication Middleware
const validateApiV1Token = require('../middlewares/api-v1.auth.middleware');
const { requireProjectScope } = require('../middlewares/api-v1.project-scope.middleware');
const { idempotency } = require('../middlewares/api-v1.idempotency.middleware');

// Apply authentication middleware to all API v1 routes
router.use(validateApiV1Token);

// ============================================
// Projects API Routes
// ============================================
router.get('/projects', ProjectsApiController.list);
router.get('/projects/:projectUuid', requireProjectScope, ProjectsApiController.get);

// ============================================
// Accounts API Routes
// ============================================
router.get('/:projectUuid/accounts', requireProjectScope, AccountsApiController.list);
router.get('/:projectUuid/accounts/:accountUuid', requireProjectScope, AccountsApiController.get);

// ============================================
// Media API Routes
// Note: Media is user-based, not project-based
// ============================================
router.get('/media', MediaApiController.list);
router.get('/media/:mediaUuid', MediaApiController.get);
router.post('/media', idempotency, MediaApiController.upload);
router.put('/media/:mediaUuid', MediaApiController.update);
router.delete('/media/:mediaUuid', MediaApiController.delete);

// ============================================
// Tags API Routes
// ============================================
router.get('/:projectUuid/tags', requireProjectScope, TagsApiController.list);
router.get('/:projectUuid/tags/:tagUuid', requireProjectScope, TagsApiController.get);
router.post('/:projectUuid/tags', requireProjectScope, TagsApiController.create);
router.put('/:projectUuid/tags/:tagUuid', requireProjectScope, TagsApiController.update);
router.delete('/:projectUuid/tags/:tagUuid', requireProjectScope, TagsApiController.delete);

// ============================================
// Posts API Routes
// ============================================
router.get('/:projectUuid/posts', requireProjectScope, PostsApiController.list);
router.get('/:projectUuid/posts/:postUuid', requireProjectScope, PostsApiController.get);
router.get('/:projectUuid/posts/:postUuid/history', requireProjectScope, PostHistoryApiController.list);
router.post('/:projectUuid/posts', requireProjectScope, idempotency, PostWritesApiController.create);
router.put('/:projectUuid/posts/:postUuid', requireProjectScope, PostWritesApiController.update);
router.delete('/:projectUuid/posts/:postUuid', requireProjectScope, PostsApiController.delete);
router.delete('/:projectUuid/posts', requireProjectScope, PostsApiController.deleteMultiple);
router.post('/:projectUuid/posts/:postUuid/schedule', requireProjectScope, idempotency, PostWritesApiController.schedule);

module.exports = router;
