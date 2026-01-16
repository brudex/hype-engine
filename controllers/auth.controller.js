const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const config = require('../config/config');

const AuthController = {};

/**
 * Show login page
 * @route GET /auth/login
 */
AuthController.showLogin = async (req, res) => {
    try {
        // If user is already logged in, redirect to dashboard
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }

        res.render('auth/login', {
            title: 'Login',
            layout: 'layouts/auth'
        });
    } catch (error) {
        logger.error('Show login error:', error);
        res.status(500).render('auth/login', {
            title: 'Login',
            layout: 'layouts/auth',
            error: 'An error occurred. Please try again.'
        });
    }
};

/**
 * Handle login using Passport local strategy
 * @route POST /auth/login
 */
AuthController.login = (req, res, next) => {
    const { remember } = req.body;

    // Use Passport's local-login strategy
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            logger.error('Login error:', err);
            return res.render('auth/login', {
                title: 'Login',
                layout: 'layouts/auth',
                error: 'An error occurred during login. Please try again.'
            });
        }

        if (!user) {
            // Authentication failed
            return res.render('auth/login', {
                title: 'Login',
                layout: 'layouts/auth',
                error: info.message || 'Invalid email or password.'
            });
        }

        // Log the user in (establish session)
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                logger.error('Login session error:', loginErr);
                return res.render('auth/login', {
                    title: 'Login',
                    layout: 'layouts/auth',
                    error: 'An error occurred during login. Please try again.'
                });
            }

            // Generate JWT token for API access
            const tokenPayload = {
                uuid: user.uuid,
                email: user.email,
                fullName: user.fullName
            };

            const token = jwt.sign(tokenPayload, config.jwtSecret, {
                expiresIn: remember ? '30d' : '7d'
            });

            // Set JWT cookie
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
            });

            // Redirect to dashboard
            return res.redirect('/dashboard');
        });
    })(req, res, next);
};

/**
 * Show register page
 * @route GET /auth/register
 */
AuthController.showRegister = async (req, res) => {
    try {
        // If user is already logged in, redirect to dashboard
        if (req.user) {
            return res.redirect('/dashboard');
        }

        res.render('auth/register', {
            title: 'Register',
            layout: 'layouts/auth'
        });
    } catch (error) {
        logger.error('Show register error:', error);
        res.status(500).render('auth/register', {
            title: 'Register',
            layout: 'layouts/auth',
            error: 'An error occurred. Please try again.'
        });
    }
};

/**
 * Handle registration
 * @route POST /auth/register
 */
AuthController.register = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, terms } = req.body;

        // Validate input
        const errors = [];

        if (!fullName || fullName.trim().length < 2 || fullName.trim().length > 100) {
            errors.push('Full name must be between 2 and 100 characters.');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please provide a valid email address.');
        }

        if (!password || password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }

        if (password !== confirmPassword) {
            errors.push('Passwords do not match.');
        }

        if (!terms) {
            errors.push('You must agree to the terms and conditions.');
        }

        if (errors.length > 0) {
            return res.render('auth/register', {
                title: 'Register',
                layout: 'layouts/auth',
                errors: errors
            });
        }

        // Check if email already exists
        const existingUser = await db.User.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register',
                layout: 'layouts/auth',
                error: 'An account with this email already exists.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await db.User.create({
            uuid: uuidv4(),
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            provider: 'local'
        });

        // Generate JWT token
        const tokenPayload = {
            uuid: user.uuid,
            email: user.email,
            fullName: user.fullName
        };

        const token = jwt.sign(tokenPayload, config.jwtSecret, {
            expiresIn: '7d'
        });

        // Set cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Redirect to dashboard
        req.flash('success', 'Account created successfully! Login to your account to continue.');
        res.redirect('/auth/login');
    } catch (error) {
        logger.error('Register error:', error);
        
        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render('auth/register', {
                title: 'Register',
                layout: 'layouts/auth',
                error: 'An account with this email already exists.'
            });
        }

        res.render('auth/register', {
            title: 'Register',
            layout: 'layouts/auth',
            error: 'An error occurred during registration. Please try again.'
        });
    }
};

/**
 * Handle logout
 * @route GET /auth/logout
 */
AuthController.logout = (req, res) => {
    try {
        // Use Passport's logout method to destroy session
        // Note: req.logout() is synchronous in newer Passport versions (no callback)
        req.logout();
        
        // Clear JWT cookie
        res.clearCookie('auth_token');
        
        // Clear session cookie
        res.clearCookie('x-session-id');
        
        req.flash('success', 'You have been logged out successfully.');
        res.redirect('/auth/login');
    } catch (error) {
        logger.error('Logout error:', error);
        res.redirect('/auth/login');
    }
};

/**
 * Show forgot password page
 * @route GET /auth/forgot-password
 */
AuthController.showForgotPassword = async (req, res) => {
    try {
        res.render('auth/forgot-password', {
            title: 'Forgot Password',
            layout: 'layouts/auth'
        });
    } catch (error) {
        logger.error('Show forgot password error:', error);
        res.status(500).render('auth/forgot-password', {
            title: 'Forgot Password',
            layout: 'layouts/auth',
            error: 'An error occurred. Please try again.'
        });
    }
};

/**
 * Handle forgot password request
 * @route POST /auth/forgot-password
 */
AuthController.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.render('auth/forgot-password', {
                title: 'Forgot Password',
                layout: 'layouts/auth',
                error: 'Email is required.'
            });
        }

        const user = await db.User.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        // Always show success message for security (don't reveal if email exists)
        req.flash('success', 'If an account exists with this email, a password reset link has been sent.');
        res.redirect('/auth/login');

        // TODO: Implement password reset email sending
        // if (user) {
        //     // Generate reset token
        //     // Send email with reset link
        // }
    } catch (error) {
        logger.error('Forgot password error:', error);
        res.render('auth/forgot-password', {
            title: 'Forgot Password',
            layout: 'layouts/auth',
            error: 'An error occurred. Please try again.'
        });
    }
};

module.exports = AuthController;

