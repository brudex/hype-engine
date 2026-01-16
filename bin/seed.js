#!/usr/bin/env node

require('dotenv').config();
const db = require("../models");
const seeder = require("../seeder/index");
const logger = require("../utils/logger");

async function runSeeder() {
    try {
        console.log('Starting database seeding...');
        logger.info('Starting database seeding...');
        // Sync database first
        await db.sequelize.sync();
        logger.info('Database synced successfully');
        // Run seeder (it will close the connection itself)
        await seeder.seed();
        console.log('Database seeding completed successfully!');
        logger.info('Database seeding completed successfully!');      
        // Exit process after successful seeding
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        logger.error('Error during seeding:', error);
        process.exit(1);
    }
}


setTimeout(runSeeder, 2000);

