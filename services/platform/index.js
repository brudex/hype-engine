const twitter = require('./twitter');
const facebook = require('./facebook');
const linkedin = require('./linkedin');
const tiktok = require('./tiktok');
const mastodon = require('./mastodon');

const platformMap = {
    twitter,
    facebook,
    linkedin,
    tiktok,
    mastodon,
    instagram: facebook
};

/**
 * Return the platform service for a given name.
 * Service has testCredentials(config) and publishPost(post, postVersion, tags, account).
 * @param {string} platformName - Platform name (e.g. 'twitter', 'facebook')
 * @returns {{ testCredentials: Function, publishPost: Function } | null}
 */
function getService(platformName) {
    if (!platformName) return null;
    const key = String(platformName).toLowerCase();
    return platformMap[key] || null;
}

/**
 * Test credentials for a platform.
 * @param {string} platformName - Platform name
 * @param {object} configuration - Service configuration
 * @returns {Promise<object>} - Test result
 */
async function testCredentials(platformName, configuration) {
    const service = getService(platformName);
    if (!service) {
        return {
            success: false,
            message: 'Platform not supported for testing',
            error: `Testing not implemented for ${platformName}`
        };
    }
    return service.testCredentials(configuration);
}

module.exports = {
    getService,
    testCredentials
};
