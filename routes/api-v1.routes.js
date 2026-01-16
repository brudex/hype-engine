const express = require('express');
const router = express.Router();

// API v1 Controllers
const ProjectsApiController = require('../controllers/api-v1/projects.api.controller');
const AccountsApiController = require('../controllers/api-v1/accounts.api.controller');
const MediaApiController = require('../controllers/api-v1/media.api.controller');
const TagsApiController = require('../controllers/api-v1/tags.api.controller');
const PostsApiController = require('../controllers/api-v1/posts.api.controller');

// API v1 Authentication Middleware
const validateApiV1Token = require('../middlewares/api-v1.auth.middleware');

// Apply authentication middleware to all API v1 routes
router.use(validateApiV1Token);

// ============================================
// Projects API Routes
// ============================================
router.get('/projects', ProjectsApiController.list);
router.get('/projects/:projectUuid', ProjectsApiController.get);

// ============================================
// Accounts API Routes
// Based on: https://docs.mixpost.app/api/accounts/
// ============================================
router.get('/:projectUuid/accounts', AccountsApiController.list);
router.get('/:projectUuid/accounts/:accountUuid', AccountsApiController.get);

// ============================================
// Media API Routes
// Based on: https://docs.mixpost.app/api/media/
// Note: Media is user-based, not project-based
// ============================================
router.get('/media', MediaApiController.list);
router.get('/media/:mediaUuid', MediaApiController.get);
router.post('/media', MediaApiController.upload);
router.put('/media/:mediaUuid', MediaApiController.update);
router.delete('/media/:mediaUuid', MediaApiController.delete);

// ============================================
// Tags API Routes
// Based on: https://docs.mixpost.app/api/tags/
// ============================================
router.get('/:projectUuid/tags', TagsApiController.list);
router.get('/:projectUuid/tags/:tagUuid', TagsApiController.get);
router.post('/:projectUuid/tags', TagsApiController.create);
router.put('/:projectUuid/tags/:tagUuid', TagsApiController.update);
router.delete('/:projectUuid/tags/:tagUuid', TagsApiController.delete);

// ============================================
// Posts API Routes
// Based on: https://docs.mixpost.app/api/posts/
// ============================================
router.get('/:projectUuid/posts', PostsApiController.list);
router.get('/:projectUuid/posts/:postUuid', PostsApiController.get);
router.post('/:projectUuid/posts', PostsApiController.create);
router.put('/:projectUuid/posts/:postUuid', PostsApiController.update);
router.delete('/:projectUuid/posts/:postUuid', PostsApiController.delete);
router.delete('/:projectUuid/posts', PostsApiController.deleteMultiple);
router.post('/:projectUuid/posts/:postUuid/schedule', PostsApiController.schedule);

module.exports = router;

