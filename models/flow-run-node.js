module.exports = (sequelize, DataTypes) => {
    const FlowRunNode = sequelize.define('FlowRunNode', {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        runUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        workflowUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        nodeId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        selectedOutput: {
            type: DataTypes.STRING,
            allowNull: true
        },
        inputContext: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        output: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        error: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        finishedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        durationMs: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'flow_run_nodes',
        timestamps: true
    });

    FlowRunNode.associate = function (models) {
        FlowRunNode.belongsTo(models.FlowRun, {
            foreignKey: 'runUuid',
            targetKey: 'uuid',
            as: 'run'
        });
    };

    return FlowRunNode;
};
