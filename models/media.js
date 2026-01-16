const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define("Media", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mimeType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        disk: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: true,
            comment: 'UUID of the user who uploaded this media'
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true
        },
        size: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        sizeTotal: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Size including conversions'
        },
        conversions: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: "mixpost_media",
        timestamps: true
    });

    Media.associate = function(models) {
        // Media belongs to a User
        Media.belongsTo(models.User, {
            foreignKey: 'userUuid',
            targetKey: 'uuid',
            as: 'user'
        });
        // Media can be referenced in PostVersion content JSON
        // No direct foreign key relationship needed
    };

    return Media;
};

