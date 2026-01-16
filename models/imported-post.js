module.exports = (sequelize, DataTypes) => {
    const ImportedPost = sequelize.define("ImportedPost", {
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        providerPostId: {
            type: DataTypes.STRING,
            allowNull: false,
            index: true
        },
        content: {
            type: DataTypes.JSON,
            allowNull: false
        },
        metrics: {
            type: DataTypes.JSON,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: "mixpost_imported_posts",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['accountUuid', 'providerPostId'],
                name: 'imported_posts_unq_id'
            }
        ]
    });

    ImportedPost.associate = function(models) {
        ImportedPost.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
    };

    return ImportedPost;
};

