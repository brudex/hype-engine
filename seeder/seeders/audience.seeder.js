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

        // Get account UUIDs with their project UUIDs
        const accounts = await queryInterface.sequelize.query(
            `SELECT "uuid", "projectUuid" FROM "mixpost_accounts";`
        );
        const accountData = accounts[0];

        if (accountData.length === 0) {
            console.log('No accounts found. Please seed accounts first.');
            return;
        }

        const audience = [];
        const today = new Date();

        // Generate audience data for the last 30 days for each account
        accountData.forEach(account => {
            // Base audience size (varies by account, simulating growth/decline)
            const baseAudience = Math.floor(Math.random() * 50000) + 1000; // Between 1,000 and 51,000
            
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                // Simulate daily audience fluctuations (small random changes)
                // Add slight growth trend over time (newer dates have slightly higher audience)
                const growthFactor = 1 + (i * 0.001); // Very slight growth over time
                const dailyVariation = (Math.random() * 0.1) - 0.05; // ±5% daily variation
                const total = Math.floor(baseAudience * growthFactor * (1 + dailyVariation));

                audience.push({
                    uuid: uuidv4(),
                    accountUuid: account.uuid,
                    projectUuid: account.projectUuid,
                    total: total,
                    date: dateString,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        });

        await queryInterface.bulkInsert('mixpost_audience', audience, {});
        console.log(`Inserted ${audience.length} audience records`);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('mixpost_audience', null, {});
    }
};

