/**
 * Sequelize includes for publish jobs. Resolved at call time so models are loaded.
 */
function getPostPublishIncludes() {
    const db = require('../../models');

    return [
        {
            model: db.Account,
            as: 'accounts',
            through: { attributes: [] },
            required: true
        },
        {
            model: db.PostVersion,
            as: 'versions'
        },
        {
            model: db.Tag,
            as: 'tags',
            through: { attributes: [] }
        }
    ];
}

module.exports = { getPostPublishIncludes };
