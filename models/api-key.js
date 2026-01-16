const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define("ApiKey", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'UUID of the user who owns this API key'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name/identifier for this API key'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Optional description for this API key'
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'The actual API key'
        },
        lastUsedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp of when this API key was last used'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether this API key is active'
        },
        scopes: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {
                allProjects: true,
                projects: []
            },
            comment: 'API key scopes - determines which projects the key can access',
            validate: {
                isValidScopes(value) {
                    if (!value || typeof value !== 'object') {
                        throw new Error('Scopes must be an object');
                    }
                    if (typeof value.allProjects !== 'boolean') {
                        throw new Error('allProjects must be a boolean');
                    }
                    if (!Array.isArray(value.projects)) {
                        throw new Error('projects must be an array');
                    }
                    if (!value.allProjects && value.projects.length === 0) {
                        throw new Error('At least one project must be selected when allProjects is false');
                    }
                    // Validate that all projects are valid UUIDs
                    value.projects.forEach((projectUuid, index) => {
                        if (typeof projectUuid !== 'string' || projectUuid.length !== 36) {
                            throw new Error(`Invalid project UUID at index ${index}`);
                        }
                    });
                }
            }
        }
    }, {
        tableName: "api_keys",
        timestamps: true
    });

    /**
     * Generate a new API key
     * @returns {string} The generated API key
     */
    ApiKey.generateKey = function() {
        const uuid = uuidv4();
        const base64Uuid = Buffer.from(uuid).toString('base64');
        const randomBytes = crypto.randomBytes(8);
        const randomHex = randomBytes.toString('hex');
        //base64 encode the uuid and add a random 8 character hex string to the end
        return `hypengn-${base64Uuid}-${randomHex}`;
    };

    ApiKey.associate = function(models) {
        // ApiKey belongs to a User
        ApiKey.belongsTo(models.User, {
            foreignKey: 'userUuid',
            targetKey: 'uuid',
            as: 'user'
        });
    };

    return ApiKey;
};

