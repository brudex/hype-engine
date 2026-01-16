module.exports = (sequelize, DataTypes) => {
    const FacebookInsight = sequelize.define("FacebookInsight", {
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'FacebookInsightType enum value' // PAGE_ENGAGED_USERS = 1;  PAGE_POST_ENGAGEMENTS = 2;  PAGE_POSTS_IMPRESSIONS = 3;  
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: "facebook_insights",
        timestamps: true
    });

    FacebookInsight.associate = function(models) {
        FacebookInsight.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
    };

    return FacebookInsight;
};

