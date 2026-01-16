
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

        // Get Facebook account UUIDs
        const accounts = await queryInterface.sequelize.query(
            `SELECT "uuid", "projectUuid" FROM "mixpost_accounts" WHERE "provider" IN ('facebook_page', 'facebook_group','facebook');`
        );
        const accountData = accounts[0];

        if (accountData.length === 0) {
            console.log('No Facebook accounts found. Please seed Facebook accounts first.');
            return;
        }

        const insights = [];
        const today = new Date();

        // Facebook Insight Types
        const PAGE_POST_ENGAGEMENTS = 2;
        const PAGE_POSTS_IMPRESSIONS = 3;

        // Generate insights for the last 30 days for each account
        accountData.forEach(account => {
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                // Generate PAGE_POST_ENGAGEMENTS insight
                insights.push({
                    accountUuid: account.uuid,
                    projectUuid: account.projectUuid,
                    type: PAGE_POST_ENGAGEMENTS,
                    value: Math.floor(Math.random() * 500) + 50,
                    date: dateString,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                // Generate PAGE_POSTS_IMPRESSIONS insight
                insights.push({
                    accountUuid: account.uuid,
                    projectUuid: account.projectUuid,
                    type: PAGE_POSTS_IMPRESSIONS,
                    value: Math.floor(Math.random() * 2000) + 200,
                    date: dateString,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        });

        await queryInterface.bulkInsert('mixpost_facebook_insights', insights, {});
        console.log(`Inserted ${insights.length} Facebook insight records`);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('mixpost_facebook_insights', null, {});
    }
};

