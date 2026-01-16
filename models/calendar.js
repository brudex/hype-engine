const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Calendar = sequelize.define("Calendar", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Calendar event title'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Calendar event description'
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Event start date and time'
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Event end date and time'
        },
        allDay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether this is an all-day event'
        },
        color: {
            type: DataTypes.STRING(7),
            allowNull: true,
            defaultValue: '#3788d8',
            comment: 'Event color in hex format'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'event',
            comment: 'Event type: event, reminder, holiday, etc.'
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'UUID of the project this calendar event belongs to'
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'UUID of the user who created this calendar event'
        },
        postUuid: {
            type: DataTypes.STRING(36),
            allowNull: true,
            comment: 'Optional UUID of the post associated with this calendar event'
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Additional metadata for the calendar event'
        }
    }, {
        tableName: "calendars",
        timestamps: true,
        indexes: [
            {
                fields: ['projectUuid'],
                name: 'calendars_project_idx'
            },
            {
                fields: ['startDate', 'endDate'],
                name: 'calendars_date_idx'
            },
            {
                fields: ['userUuid'],
                name: 'calendars_user_idx'
            }
        ]
    });

    Calendar.associate = function(models) {
        // Calendar belongs to a Project
        Calendar.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            targetKey: 'uuid',
            as: 'project'
        });
        // Calendar belongs to a User
        Calendar.belongsTo(models.User, {
            foreignKey: 'userUuid',
            targetKey: 'uuid',
            as: 'user'
        });
        // Calendar optionally belongs to a Post
        Calendar.belongsTo(models.Post, {
            foreignKey: 'postUuid',
            targetKey: 'uuid',
            as: 'post'
        });
    };

    return Calendar;
};

