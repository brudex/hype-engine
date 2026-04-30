const { testCredentials, publishPost } = require('./service');
const facebookOauth = require('./oauth');

module.exports = {
    testCredentials,
    publishPost,
    ...facebookOauth
};
