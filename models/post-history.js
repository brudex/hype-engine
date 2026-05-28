module.exports = (sequelize, DataTypes) => {
    const PostHistory = sequelize.define('PostHistory', {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        postUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'Parent post (including recurring series)'
        },
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            comment: 'Account this publish attempt targeted'
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'When this occurrence was published (UTC)'
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '0=SUCCESS, 1=FAILED'
        },
        providerPostId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Platform post id when publish succeeded'
        },
        recurringType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Snapshot at publish time: 0=ONE_TIME, 1=DAILY, 2=WEEKLY'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Body text published for this account at this occurrence'
        },
        media: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Media UUIDs/assets published for this account at this occurrence'
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Platform response metadata; on failure include error details here'
        }
    }, {
        tableName: 'post_histories',
        timestamps: true,
        indexes: [
            { fields: ['postUuid'] },
            { fields: ['accountUuid'] },
            { fields: ['publishedAt'] },
            { fields: ['postUuid', 'publishedAt'] }
        ]
    });

    PostHistory.associate = function (models) {
        PostHistory.belongsTo(models.Post, {
            foreignKey: 'postUuid',
            targetKey: 'uuid',
            as: 'post'
        });
        PostHistory.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
    };

    return PostHistory;
};
