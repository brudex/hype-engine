module.exports = (sequelize, DataTypes) => {
    const FlowRun = sequelize.define('FlowRun', {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        workflowUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        triggerType: {
            type: DataTypes.STRING,
            defaultValue: 'manual'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        finishedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        initialContext: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        contextSnapshot: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        error: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    }, {
        tableName: 'flow_runs',
        timestamps: true
    });

    FlowRun.associate = function (models) {
        FlowRun.belongsTo(models.FlowWorkflow, {
            foreignKey: 'workflowUuid',
            targetKey: 'uuid',
            as: 'workflow'
        });
        FlowRun.hasMany(models.FlowRunNode, {
            foreignKey: 'runUuid',
            sourceKey: 'uuid',
            as: 'runNodes'
        });
    };

    return FlowRun;
};
