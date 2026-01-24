const fs = require('fs');
const logger = require('../utils/logger');
const path = require('path');
const db = require('../models');

const seeders = [
   
    // 'account.seeder.js',
    // 'post-account.seeder.js',
    // 'metric.seeder.js',
    // 'audience.seeder.js',
    'job-batch.seeder.js'
];



async function seed() {
    try {
        console.log('Starting database seeding...');

        logger.info('Starting database seeding...');
        //check if db is already seeded
        // const userCount = await db.User.count();
        // if (userCount > 0) {
        //     logger.info('Database already seeded. Skipping seeding process.');
        //     return;
        // }
        logger.info('Database synced successfully');
        for (const seederFile of seeders) {
            console.log(`Running seeder: ${seederFile}`);
            const seeder = require(path.join(__dirname, 'seeders', seederFile));
            await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log(`Completed seeder: ${seederFile}`);
        }

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    } finally {
        await db.sequelize.close();
    }
}


module.exports = { seed };

