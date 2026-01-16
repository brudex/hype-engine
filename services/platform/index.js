const TwitterService = require('./twitter.service');
const FacebookService = require('./facebook.service');
const LinkedInService = require('./linkedin.service');
const TikTokService = require('./tiktok.service');
const MastodonService = require('./mastodon.service');

/**
 * Platform Service Factory
 * Returns the appropriate platform service for testing credentials
 */
class PlatformServiceFactory {
    static getService(platformName) {
        const services = {
            twitter: TwitterService,
            facebook: FacebookService,
            linkedin: LinkedInService,
            tiktok: TikTokService,
            mastodon: MastodonService,
            // Add more platforms as needed
            instagram: FacebookService, // Instagram uses Facebook API
            unsplash: null, // Unsplash uses simple API key
            tenor: null // Tenor uses simple API key
        };

        return services[platformName] || null;
    }

    /**
     * Test credentials for a platform
     * @param {string} platformName - Platform name
     * @param {object} configuration - Service configuration
     * @returns {Promise<object>} - Test result
     */
    static async testCredentials(platformName, configuration) {
        const service = this.getService(platformName);

        if (!service) {
            return {
                success: false,
                message: 'Platform not supported for testing',
                error: `Testing not implemented for ${platformName}`
            };
        }

        return await service.testCredentials(configuration);
    }
}

module.exports = PlatformServiceFactory;

