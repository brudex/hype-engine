module.exports = (sequelize, DataTypes) => {
    const FlowWorkflow = sequelize.define('FlowWorkflow', {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Short summary shown in dashboard list'
        },
        version: {
            type: DataTypes.STRING,
            defaultValue: '1.0.0'
        },
        triggerType: {
            type: DataTypes.STRING,
            defaultValue: 'manual'
        },
        triggerConfig: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        definition: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: '0=draft, 1=active, 2=paused, 3=archived'
        }
    }, {
        tableName: 'flow_workflows',
        timestamps: true
    });

    FlowWorkflow.associate = function (models) {
        FlowWorkflow.belongsTo(models.User, {
            foreignKey: 'userUuid',
            targetKey: 'uuid',
            as: 'user'
        });
        FlowWorkflow.hasMany(models.FlowWorkflowVersion, {
            foreignKey: 'workflowUuid',
            sourceKey: 'uuid',
            as: 'versions'
        });
        FlowWorkflow.hasMany(models.FlowRun, {
            foreignKey: 'workflowUuid',
            sourceKey: 'uuid',
            as: 'flowRuns'
        });
    };

    return FlowWorkflow;
};
