const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');

const auth = {

    /**
     * Middleware to check if user is authenticated via Passport session
     * Uses req.isAuthenticated() which is provided by Passport
     */
    requireLogin: (req, res, next) => {
        // Check if user is authenticated via Passport session
        if (!req.isAuthenticated()) {
            // Redirect to login for page routes
            return res.redirect('/auth/login');
        }
        next();
    },
 
};

module.exports = auth;
