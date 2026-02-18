const { testCredentials, publishPost } = require('./service');
const { generateAuthLink, exchangeCodeForToken, getProfile, getProfileFromIdToken } = require('./oauth');

module.exports = {
    testCredentials,
    publishPost,
    generateAuthLink,
    exchangeCodeForToken,
    getProfile,
    getProfileFromIdToken
};
