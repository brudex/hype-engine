module.exports = (sequelize, DataTypes) => {
    const PostAccount = sequelize.define("PostAccount", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        postUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        providerPostId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true
        },
        errors: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: "post_accounts",
        timestamps: false
    });

    PostAccount.associate = function(models) {
        PostAccount.belongsTo(models.Post, {
            foreignKey: 'postUuid',
            targetKey: 'uuid',
            as: 'post'
        });
        PostAccount.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
    };

    return PostAccount;
};

