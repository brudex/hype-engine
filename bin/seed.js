#!/usr/bin/env node

require('dotenv').config();
const db = require("../models");
const seeder = require("../seeder/index");
const logger = require("../utils/logger");
const { migrate } = require("../services/database/migrator");

async function runSeeder() {
    try {
        console.log('Starting database seeding...');
        logger.info('Starting database seeding...');
        await migrate();
        logger.info('Database migrations completed successfully');
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


runSeeder();
