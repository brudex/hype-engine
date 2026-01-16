module.exports = (sequelize, DataTypes) => {
    const Metric = sequelize.define("Metric", {
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: "metrics",
        timestamps: true
    });

    Metric.associate = function(models) {
        Metric.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
    };

    return Metric;
};

