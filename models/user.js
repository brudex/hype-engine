module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        lastLogin: {
            type: DataTypes.DATE
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        provider: {
            type: DataTypes.STRING,
            defaultValue: 'local',
            allowNull: false
        }
    }, {
        tableName: "users",
        timestamps: true
    });

    User.associate = function(models) {
        // User has many Media files
        User.hasMany(models.Media, {
            foreignKey: 'userUuid',
            sourceKey: 'uuid',
            as: 'media'
        });
        // User has many Posts
        User.hasMany(models.Post, {
            foreignKey: 'userUuid',
            sourceKey: 'uuid',
            as: 'posts'
        });
        // User has many Projects
        User.hasMany(models.Project, {
            foreignKey: 'userUuid',
            sourceKey: 'uuid',
            as: 'projects'
        });
        // User has many API Keys
        User.hasMany(models.ApiKey, {
            foreignKey: 'userUuid',
            sourceKey: 'uuid',
            as: 'apiKeys'
        });
        User.hasMany(models.FlowWorkflow, {
            foreignKey: 'userUuid',
            sourceKey: 'uuid',
            as: 'flowWorkflows'
        });
    };
 
   
    return User;
};
