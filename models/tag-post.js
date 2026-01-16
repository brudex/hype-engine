module.exports = (sequelize, DataTypes) => {
    const TagPost = sequelize.define("TagPost", {
        tagUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        postUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        }
    }, {
        tableName: "mixpost_tag_post",
        timestamps: false
    });

    TagPost.associate = function(models) {
        TagPost.belongsTo(models.Tag, {
            foreignKey: 'tagUuid',
            targetKey: 'uuid',
            as: 'tag'
        });
        TagPost.belongsTo(models.Post, {
            foreignKey: 'postUuid',
            targetKey: 'uuid',
            as: 'post'
        });
    };

    return TagPost;
};

