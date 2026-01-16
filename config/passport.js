"use strict";
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

/**
 * Validate password against user's hashed password
 * @param {string} password - Plain text password
 * @param {Object} user - User object with hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
async function validatePassword(password, user) {
	try {
		if (!user || !user.password) {
			return false;
		}
		return await bcrypt.compare(password, user.password);
	} catch (error) {
		logger.error('Password validation error:', error);
		return false;
	}
}

module.exports = async (passport) => {
	/**
	 * Local Login Strategy
	 * Uses email as username field
	 */
	passport.use(
		"local-login",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: false
			},
			async (email, password, done) => {
				try {
					// Find user by email (case-insensitive)
					const user = await db.User.findOne({ 
						where: { 
							email: email.toLowerCase().trim() 
						} 
					});

					if (!user) {
						return done(null, false, { message: "Invalid email or password" });
					}

					// Check if user has a password (for OAuth users)
					if (!user.password) {
						return done(null, false, { 
							message: "This account was created with social login. Please use the social login option." 
						});
					}

					// Check if user is active
					if (!user.isActive) {
						return done(null, false, { 
							message: "Your account has been deactivated. Please contact support." 
						});
					}

					// Validate password
					const isValid = await validatePassword(password, user);
					if (!isValid) {
						return done(null, false, { message: "Invalid email or password" });
					}

					// Update last login
					await user.update({ lastLogin: new Date() });

					return done(null, user);
				} catch (error) {
					logger.error('Passport local login error:', error);
					return done(error);
				}
			}
		)
	);

	/**
	 * Serialize user for session
	 * Stores user UUID in session
	 */
	passport.serializeUser((user, done) => {
		logger.info('Serializing user:', user.uuid);
		done(null, user.uuid);
	});

	/**
	 * Deserialize user from session
	 * Retrieves user by UUID
	 */
	passport.deserializeUser(async (uuid, done) => {
		try {
			logger.info('Deserializing user:', uuid);
			const user = await db.User.findOne({ where: { uuid } });
			
			if (!user) {
				return done(null, false);
			}

			// Don't send password to client
			const userObj = user.toJSON();
			delete userObj.password;
			
			done(null, userObj);
		} catch (error) {
			logger.error('Deserialization error:', error);
			done(error);
		}
	});
};
