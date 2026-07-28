const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");
const db = {};

const sequelize = new Sequelize(config.db, config.dbuser, config.dbpass, {
    host: config.dbhost,
    dialect: 'postgres',
    logging: process.env.DB_LOG_LEVEL === "debug" ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

function loadModels(sequelize, Sequelize) {
    fs.readdirSync(__dirname)
        .filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
        .forEach((file) => {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });
    Object.keys(db).forEach((modelName) => {
        if ("associate" in db[modelName]) {
           db[modelName].associate(db);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
}

loadModels(sequelize, Sequelize);

module.exports = db;
