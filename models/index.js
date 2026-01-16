const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");
const db = {};

console.log("The database config is: ", config.db, config.dbuser, config.dbpass, config.dbhost);
let  sequelize = new Sequelize(config.db, config.dbuser, config.dbpass, {
    host: config.dbhost,
    dialect: 'postgres',
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
    loadModels(sequelize, Sequelize);
}).catch((err) => {
    console.error("Unable to connect to the database:", err);

});

function loadModels(sequelize, Sequelize) {
  console.log("Loading models...");
    fs.readdirSync(__dirname)
        .filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
        .forEach((file) => {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });
    Object.keys(db).forEach((modelName) => {
        if ("associate" in db[modelName]) {
           console.log("--------------------------------Associating model: --------------------------- ");
           console.log("Associating model: ", modelName);
           db[modelName].associate(db);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
}

module.exports = db;

