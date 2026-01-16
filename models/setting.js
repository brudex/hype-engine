module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define("Setting", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payload: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
        tableName: "settings",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['name', 'projectUuid']
            }
        ]
    });

    Setting.associate = function(models) {
        // Settings don't have direct relationships
    };

    return Setting;
};

