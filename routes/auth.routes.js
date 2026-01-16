const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Show login page
router.get('/login', AuthController.showLogin);

// Handle login
router.post('/login', AuthController.login);

// Show register page
router.get('/register', AuthController.showRegister);

// Handle registration
router.post('/register', AuthController.register);

// Logout
router.get('/logout', AuthController.logout);

// Forgot password
router.get('/forgot-password', AuthController.showForgotPassword);
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router;

