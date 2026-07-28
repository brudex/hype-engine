const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";
console.log("The environment is: ", env);

function requireEnvironmentVariable(name) {
    const value = process.env[name];
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value.trim();
}

function requireSiteUrl() {
    const value = requireEnvironmentVariable("SITEURL").replace(/\/+$/, "");
    let parsed;

    try {
        parsed = new URL(value);
    } catch (_) {
        throw new Error("SITEURL must be an absolute http:// or https:// URL");
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("SITEURL must use the http:// or https:// protocol");
    }

    return value;
}

function optionalBoolean(name, defaultValue = false) {
    const raw = process.env[name];
    if (raw == null || raw.trim() === "") {
        return defaultValue;
    }

    const value = raw.trim().toLowerCase();
    if (value === "true") return true;
    if (value === "false") return false;
    throw new Error(`${name} must be either true or false`);
}

const environmentConfig = {
    port: requireEnvironmentVariable("PORT"),
    dbhost: requireEnvironmentVariable("DBHOST"),
    db: requireEnvironmentVariable("DBNAME"),
    dbuser: requireEnvironmentVariable("DBUSER"),
    dbpass: requireEnvironmentVariable("DBPASS"),
    siteurl: requireSiteUrl(),
    jwtSecret: requireEnvironmentVariable("JWT_SECRET"),
    sequelizeAutoSync: optionalBoolean("SEQUELIZE_AUTO_SYNC")
};

const config = {
    development: {
        root: rootPath,
        app: {
            name: "hypeengine",
        },
        ...environmentConfig
    },
    production: {
        root: rootPath,
        app: {
            name: "hypeengine",
        },
        ...environmentConfig
    }
};

if (!config[env]) {
    throw new Error(`Unsupported NODE_ENV: ${env}`);
}

module.exports = config[env];
