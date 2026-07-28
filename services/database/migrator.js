const fs = require("fs");
const path = require("path");
const db = require("../../models");
const config = require("../../config/config");

const migrationsDirectory = path.join(__dirname, "../../migrations");
const advisoryLockId = 1546202607;

async function ensureMigrationsTable(transaction) {
    await db.sequelize.query(
        `CREATE TABLE IF NOT EXISTS public.schema_migrations (
            name VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
        { transaction }
    );
}

async function migrate() {
    await db.sequelize.authenticate();
    const files = fs.readdirSync(migrationsDirectory)
        .filter((file) => file.endsWith(".sql"))
        .sort();

    for (const file of files) {
        await db.sequelize.transaction(async (transaction) => {
            await db.sequelize.query("SELECT pg_advisory_xact_lock(:lockId)", {
                replacements: { lockId: advisoryLockId },
                transaction
            });
            await ensureMigrationsTable(transaction);
            const [rows] = await db.sequelize.query(
                "SELECT name FROM public.schema_migrations WHERE name = :name",
                { replacements: { name: file }, transaction }
            );

            if (rows.length > 0) {
                return;
            }

            if (file === "20260728000000-initial-schema.sql") {
                const [existingTables] = await db.sequelize.query(
                    `SELECT COUNT(*)::integer AS count
                     FROM information_schema.tables
                     WHERE table_schema = 'public'
                       AND table_name <> 'schema_migrations'`,
                    { transaction }
                );
                if (existingTables[0].count > 0) {
                    console.warn(
                        "Adopting existing database as the initial migration baseline; back up and verify its schema before deployment."
                    );
                    await db.sequelize.query(
                        "INSERT INTO public.schema_migrations (name) VALUES (:name)",
                        { replacements: { name: file }, transaction }
                    );
                    return;
                }
            }

            const sql = fs.readFileSync(path.join(migrationsDirectory, file), "utf8");
            await db.sequelize.query(sql, { transaction });
            await db.sequelize.query(
                "INSERT INTO public.schema_migrations (name) VALUES (:name)",
                { replacements: { name: file }, transaction }
            );
        });
    }

    if (config.sequelizeAutoSync) {
        console.warn(
            "SEQUELIZE_AUTO_SYNC=true: synchronizing the database from live models. Do not use this as a substitute for versioned production migrations."
        );
        await db.sequelize.sync();
    }
}

module.exports = { migrate };
