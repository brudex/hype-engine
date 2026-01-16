const express = require('express');
const router = express.Router();
const PageController = require('../controllers/page.controller');

// Public page routes
router.get("/", (req, res) => {
    res.redirect("/auth/login");
});

// Terms of Service
router.get("/terms", PageController.terms);

// Privacy Policy
router.get("/privacy-policy", PageController.privacyPolicy);

module.exports = router;
