const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');
const CallbackController = require('../controllers/integrations/callback.controller');
const AccountsController = require('../controllers/accounts.controller');

// Public page routes
router.get("/", (req, res) => {
    res.redirect("/auth/login");
});

// Terms of Service
router.get("/terms", PageController.terms);
// Privacy Policy
router.get("/privacy-policy", PageController.privacyPolicy);
router.get("/delete-account/facebook", AccountsController.deleteFacebookAccount);

// Integration callbacks (public – OAuth redirects from social platforms)
router.get('/integrations/x/callback', CallbackController.x);
router.get('/integrations/linkedin/callback', CallbackController.linkedIn);
router.get('/integrations/facebook/callback', CallbackController.facebook);

module.exports = router;
