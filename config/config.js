const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";
console.log("The environment is: ", env);
const config = {
    development: {
        root: rootPath,
        app: {
            name: "hypeengine",
        },
        port: process.env.PORT,
        dbhost: process.env.DBHOST,
        db: process.env.DBNAME,
        dbuser: process.env.DBUSER,
        dbpass: process.env.DBPASS,
        siteurl: process.env.SITEURL,
        jwtSecret: process.env.JWT_SECRET
         
        
    },
    production: {
        root: rootPath,
        app: {
            name: "hypeengine",
        },
        port: process.env.PORT,
        dbhost: process.env.DBHOST,
        db: process.env.DBNAME,
        dbuser: process.env.DBUSER,
        dbpass: process.env.DBPASS,
        siteurl: process.env.SITEURL,
        jwtSecret: process.env.JWT_SECRET
       
    }
};

module.exports = config[env];
