const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define("Account", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'UUID of the project this account belongs to'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        media: {
            type: DataTypes.JSON,
            allowNull: true
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false
        },
        providerId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true
        },
        authorized: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        apiKey: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Encrypted JSON configuration'
        },
        authMethod: {
            type: DataTypes.STRING, // oauth, apikey
            allowNull: false,
            comment: 'Authentication method'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        accountTier: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: 'Basic',
            comment: 'Platform API tier (X: Free, Basic, Premium, Premium Plus)'
        }
      
    }, {
        tableName: "accounts",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['provider', 'providerId'],
                name: 'accounts_unq_id'
            }
        ]
    });

    Account.associate = function(models) {
        // Account belongs to a Project
        Account.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            targetKey: 'uuid',
            as: 'project'
        });
        Account.belongsToMany(models.Post, {
            through: models.PostAccount,
            foreignKey: 'accountUuid',
            otherKey: 'postUuid',
            sourceKey: 'uuid',
            targetKey: 'uuid',
            as: 'posts'
        });
        Account.hasMany(models.PostVersion, {
            foreignKey: 'accountUuid',
            sourceKey: 'uuid',
            as: 'postVersions'
        });
        Account.hasMany(models.Metric, {
            foreignKey: 'accountUuid',
            sourceKey: 'uuid',
            as: 'metrics'
        });
        Account.hasMany(models.Audience, {
            foreignKey: 'accountUuid',
            sourceKey: 'uuid',
            as: 'audience'
        });
        Account.hasMany(models.FacebookInsight, {
            foreignKey: 'accountUuid',
            sourceKey: 'uuid',
            as: 'facebookInsights'
        });
        Account.hasMany(models.ImportedPost, {
            foreignKey: 'accountUuid',
            sourceKey: 'uuid',
            as: 'importedPosts'
        });
    };

    return Account;
};

