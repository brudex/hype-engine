const { testCredentials, publishPost } = require('./service');
const { generateAuthLink, exchangeCodeForToken, getProfile } = require('./oauth');

module.exports = {
    testCredentials,
    publishPost,
    generateAuthLink,
    exchangeCodeForToken,
    getProfile
};
