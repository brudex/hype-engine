const { testCredentials, publishPost } = require('./service');
const { generateAuthLink, exchangeRequestToken, createUserClient } = require('./oauth');

module.exports = {
    testCredentials,
    publishPost,
    generateAuthLink,
    exchangeRequestToken,
    createUserClient
};
