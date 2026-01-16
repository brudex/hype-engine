const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("Project", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Project name, e.g., "My personal social media management"'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Project description, e.g., "My private social media accounts management"'
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'UUID of the user who owns this project'
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL/path to the project image/logo'
        }
    }, {
        tableName: "mixpost_projects",
        timestamps: true
    });

    Project.associate = function(models) {
        // Project belongs to a User
        Project.belongsTo(models.User, {
            foreignKey: 'userUuid',
            targetKey: 'uuid',
            as: 'user'
        });
        // Project has many Accounts
        Project.hasMany(models.Account, {
            foreignKey: 'projectUuid',
            sourceKey: 'uuid',
            as: 'accounts'
        });
        // Project has many Posts
        Project.hasMany(models.Post, {
            foreignKey: 'projectUuid',
            sourceKey: 'uuid',
            as: 'posts'
        });
        // Project has many Calendar Events
        Project.hasMany(models.Calendar, {
            foreignKey: 'projectUuid',
            sourceKey: 'uuid',
            as: 'calendarEvents'
        });
        // Project has many Tags
        Project.hasMany(models.Tag, {
            foreignKey: 'projectUuid',
            sourceKey: 'uuid',
            as: 'tags'
        });
    };

    return Project;
};

