const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');
const AccountsController = require('../controllers/accounts.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const CallbackController = require('../controllers/integrations/callback.controller');

// Public page routes
router.get("/", (req, res) => {
    res.redirect("/auth/login");
});

// Terms of Service
router.get("/terms", PageController.terms);

// Privacy Policy
router.get("/privacy-policy", PageController.privacyPolicy);

// Connect integration (requires login)
router.get('/integrations/:platformName/connect/:projectUuid', authMiddleware.requireLogin, AccountsController.connectIntegration);

// Integration callbacks (public – OAuth redirects from social platforms)
router.get('/integrations/x/callback', CallbackController.x);

module.exports = router;
