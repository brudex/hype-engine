const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define("Tag", {
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
        hexColor: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        projectUuid: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'projects',
                key: 'uuid'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: "tags",
        timestamps: true
    });

    Tag.associate = function(models) {
        Tag.belongsTo(models.Project, {
            foreignKey: 'projectUuid',
            targetKey: 'uuid',
            as: 'project'
        });
        Tag.belongsToMany(models.Post, {
            through: models.TagPost,
            foreignKey: 'tagUuid',
            otherKey: 'postUuid',
            sourceKey: 'uuid',
            targetKey: 'uuid',
            as: 'posts'
        });
    };

    return Tag;
};

