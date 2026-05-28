const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '0=DRAFT, 1=SCHEDULED, 2=PUBLISHED, 3=FAILED'
        },
        scheduleStatus: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '0=PENDING, 1=PROCESSING, 2=PROCESSED'
        },
        // Recurring scheduling
        recurringType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '0=ONE_TIME, 1=DAILY, 2=WEEKLY'
        },
        recurringDays: {
            type: DataTypes.STRING(32),
            allowNull: true,
            comment: 'Comma-separated day codes for weekly recurrence, e.g. MON,TUE,FRI'
        },
        recurringTime: {
            type: DataTypes.TIME,
            allowNull: true,
            comment: 'Time of day for recurrence (time without time zone)'
        },
        recurringEndAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Optional end date for recurring series'
        },
        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: true,
            comment: 'UUID of the user who created this post'
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'UUID of the project this post belongs to'
        }
    }, {
        tableName: "posts",
        timestamps: true,
        paranoid: true, // Enables soft deletes
        deletedAt: 'deleted_at'
    });

    Post.associate = function(models) {
        // Post belongs to a User
        Post.belongsTo(models.User, {
            foreignKey: 'userUuid',
            targetKey: 'uuid',
            as: 'user'
        });
        // Post belongs to a Project
        Post.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            targetKey: 'uuid',
            as: 'project'
        });
        Post.belongsToMany(models.Account, {
            through: models.PostAccount,
            foreignKey: 'postUuid',
            otherKey: 'accountUuid',
            sourceKey: 'uuid',
            targetKey: 'uuid',
            as: 'accounts'
        });
        Post.hasMany(models.PostVersion, {
            foreignKey: 'postUuid',
            sourceKey: 'uuid',
            as: 'versions'
        });
        Post.belongsToMany(models.Tag, {
            through: models.TagPost,
            foreignKey: 'postUuid',
            otherKey: 'tagUuid',
            sourceKey: 'uuid',
            targetKey: 'uuid',
            as: 'tags'
        });
        // Post can have calendar events
        Post.hasMany(models.Calendar, {
            foreignKey: 'postUuid',
            sourceKey: 'uuid',
            as: 'calendarEvents'
        });
        // Publish audit trail (one row per account per occurrence; recurring posts append over time)
        Post.hasMany(models.PostHistory, {
            foreignKey: 'postUuid',
            sourceKey: 'uuid',
            as: 'history'
        });
    };

    return Post;
};

