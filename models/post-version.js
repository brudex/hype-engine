module.exports = (sequelize, DataTypes) => {
    const PostVersion = sequelize.define("PostVersion", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        postUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
            // No database constraint - relationship is Sequelize-based only
        },
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
            // No database constraint - relationship is Sequelize-based only
        },
        isOriginal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        media: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: "post_versions",
        timestamps: false
    });

    PostVersion.associate = function(models) {
        PostVersion.belongsTo(models.Post, {
            foreignKey: 'postUuid',
            targetKey: 'uuid',
            as: 'post'
        });
        PostVersion.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
    };

    return PostVersion;
};

