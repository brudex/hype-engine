module.exports = (sequelize, DataTypes) => {
    const FlowTriggerEvent = sequelize.define('FlowTriggerEvent', {
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
        runUuid: {
            type: DataTypes.STRING(36),
            allowNull: true
        },
        triggerType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payload: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        headers: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'received'
        },
        receivedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'flow_trigger_events',
        timestamps: true
    });

    FlowTriggerEvent.associate = function (models) {
        FlowTriggerEvent.belongsTo(models.FlowWorkflow, {
            foreignKey: 'workflowUuid',
            targetKey: 'uuid',
            as: 'workflow'
        });
    };

    return FlowTriggerEvent;
};
