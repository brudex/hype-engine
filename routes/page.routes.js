const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');
const CallbackController = require('../controllers/integrations/callback.controller');

// Public page routes
router.get("/", (req, res) => {
    res.redirect("/auth/login");
});

// Terms of Service
router.get("/terms", PageController.terms);
// Privacy Policy
router.get("/privacy-policy", PageController.privacyPolicy);

// Integration callbacks (public – OAuth redirects from social platforms)
router.get('/integrations/x/callback', CallbackController.x);
router.get('/integrations/linkedin/callback', CallbackController.linkedIn);

module.exports = router;
