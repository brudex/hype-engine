const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Get project UUIDs
        const projects = await queryInterface.sequelize.query(
            `SELECT "uuid" FROM "mixpost_projects";`
        );
        const projectUuids = projects[0].map(project => project.uuid);

        if (projectUuids.length === 0) {
            console.log('No projects found. Please seed projects first.');
            return;
        }

        // Get account UUIDs (Twitter and Mastodon only, as they use metrics)
        const accounts = await queryInterface.sequelize.query(
            `SELECT "uuid", "projectUuid", "provider" FROM "mixpost_accounts" WHERE "provider" IN ('twitter', 'mastodon');`
        );
        const accountData = accounts[0];

        if (accountData.length === 0) {
            console.log('No Twitter or Mastodon accounts found. Please seed accounts first.');
            return;
        }

        const metrics = [];
        const today = new Date();

        // Generate metrics for the last 30 days for each account
        accountData.forEach(account => {
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                // Generate random metrics data
                const metricsData = {
                    likes: Math.floor(Math.random() * 100) + 10,
                    retweets: Math.floor(Math.random() * 50) + 5,
                    replies: Math.floor(Math.random() * 30) + 2,
                    impressions: Math.floor(Math.random() * 1000) + 100
                };

                // For Mastodon, use different metric names
                if (account.provider === 'mastodon') {
                    metricsData.reblogs = Math.floor(Math.random() * 50) + 5;
                    metricsData.favourites = Math.floor(Math.random() * 100) + 10;
                    metricsData.replies = Math.floor(Math.random() * 30) + 2;
                    delete metricsData.likes;
                    delete metricsData.retweets;
                }

                metrics.push({
                    accountUuid: account.uuid,
                    projectUuid: account.projectUuid,
                    data: JSON.stringify(metricsData),
                    date: dateString,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        });

        await queryInterface.bulkInsert('mixpost_metrics', metrics, {});
        console.log(`Inserted ${metrics.length} metric records`);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('mixpost_metrics', null, {});
    }
};

