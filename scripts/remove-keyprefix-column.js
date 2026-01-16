const db = require('../models');

async function removeKeyPrefixColumn() {
    try {
        // Wait for database connection
        await db.sequelize.authenticate();
        console.log('Database connection established.');
        
        console.log('Removing keyPrefix column from mixpost_api_keys table...');
        
        const queryInterface = db.sequelize.getQueryInterface();
        
        // Check if column exists before dropping
        const tableDescription = await queryInterface.describeTable('mixpost_api_keys');
        
        if (tableDescription.keyPrefix) {
            await queryInterface.removeColumn('mixpost_api_keys', 'keyPrefix');
            console.log('✅ Successfully removed keyPrefix column');
        } else {
            console.log('ℹ️  keyPrefix column does not exist, skipping...');
        }
        
        await db.sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error removing keyPrefix column:', error);
        if (db.sequelize) {
            await db.sequelize.close();
        }
        process.exit(1);
    }
}

// Wait a bit for models to load, then run
setTimeout(() => {
    removeKeyPrefixColumn();
}, 2000);

