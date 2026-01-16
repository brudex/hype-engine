module.exports = (sequelize, DataTypes) => {
    const Audience = sequelize.define("Audience", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        accountUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        total: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: "audience",
        timestamps: true,
    });

    Audience.associate = function(models) {
        Audience.belongsTo(models.Account, {
            foreignKey: 'accountUuid',
            targetKey: 'uuid',
            as: 'account'
        });
        Audience.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            targetKey: 'uuid',
            as: 'project'
        });
    };

    return Audience;
};

