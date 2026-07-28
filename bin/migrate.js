#!/usr/bin/env node

require("dotenv").config();
const db = require("../models");
const { migrate } = require("../services/database/migrator");

migrate()
    .then(async () => {
        console.log("Database migrations completed successfully.");
        await db.sequelize.close();
    })
    .catch(async (error) => {
        console.error("Database migration failed:", error);
        await db.sequelize.close().catch(() => {});
        process.exitCode = 1;
    });
