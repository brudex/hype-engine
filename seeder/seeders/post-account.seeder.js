const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Get post UUIDs
        const posts = await queryInterface.sequelize.query(
            `SELECT "uuid" FROM "mixpost_posts";`
        );
        const postUuids = posts[0].map(post => post.uuid);

        // Get account UUIDs
        const accounts = await queryInterface.sequelize.query(
            `SELECT "uuid", "provider" FROM "mixpost_accounts";`
        );
        const accountUuids = accounts[0].map(account => account.uuid);
        const accountProviders = {};
        accounts[0].forEach(account => {
            accountProviders[account.uuid] = account.provider;
        });

        if (postUuids.length === 0) {
            console.log('No posts found. Please seed posts first.');
            return;
        }

        if (accountUuids.length === 0) {
            console.log('No accounts found. Please seed accounts first.');
            return;
        }

        const postAccounts = [];

        // Link each post to 1-3 random accounts
        postUuids.forEach((postUuid, index) => {
            // Select 1-3 random accounts for each post
            const numAccounts = Math.floor(Math.random() * 3) + 1; // 1 to 3 accounts
            const selectedAccounts = accountUuids
                .sort(() => 0.5 - Math.random())
                .slice(0, numAccounts);

            selectedAccounts.forEach((accountUuid, accIndex) => {
                const provider = accountProviders[accountUuid];
                const providerPostId = `${provider}_post_${index}_${accIndex}_${Date.now()}`;
                
                postAccounts.push({
                    uuid: uuidv4(),
                    postUuid: postUuid,
                    accountUuid: accountUuid,
                    providerPostId: providerPostId,
                    data: JSON.stringify({
                        published_at: new Date().toISOString(),
                        engagement: {
                            likes: Math.floor(Math.random() * 1000),
                            comments: Math.floor(Math.random() * 100),
                            shares: Math.floor(Math.random() * 50)
                        }
                    }),
                    errors: null
                });
            });
        });

        // Also create some post-account relationships with errors (for testing failed posts)
        if (postUuids.length > 0 && accountUuids.length > 0) {
            const errorPostUuid = postUuids[0];
            const errorAccountUuid = accountUuids[0];
            
            postAccounts.push({
                uuid: uuidv4(),
                postUuid: errorPostUuid,
                accountUuid: errorAccountUuid,
                providerPostId: null,
                data: null,
                errors: JSON.stringify({
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Rate limit exceeded. Please try again later.',
                    timestamp: new Date().toISOString()
                })
            });
        }

        await queryInterface.bulkInsert('mixpost_post_accounts', postAccounts, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('mixpost_post_accounts', null, {});
    }
};

