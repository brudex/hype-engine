module.exports = (sequelize, DataTypes) => {
    const FlowNode = sequelize.define('FlowNode', {
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
        nodeId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        config: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        outputs: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'flow_nodes',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['workflowUuid', 'nodeId'],
                name: 'flow_nodes_workflow_node_unq'
            }
        ]
    });

    FlowNode.associate = function (models) {
        FlowNode.belongsTo(models.FlowWorkflow, {
            foreignKey: 'workflowUuid',
            targetKey: 'uuid',
            as: 'workflow'
        });
    };

    return FlowNode;
};
