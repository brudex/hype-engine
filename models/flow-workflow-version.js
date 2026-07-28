module.exports = (sequelize, DataTypes) => {
    const FlowWorkflowVersion = sequelize.define(
        'FlowWorkflowVersion',
        {
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
            versionNumber: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            definition: {
                type: DataTypes.JSONB,
                allowNull: false
            },
            createdBy: {
                type: DataTypes.STRING(36),
                allowNull: true
            }
        },
        {
            tableName: 'flow_workflow_versions',
            timestamps: true,
            updatedAt: false,
            indexes: [
                {
                    unique: true,
                    fields: ['workflowUuid', 'versionNumber'],
                    name: 'flow_workflow_versions_workflow_version_unq'
                }
            ]
        }
    );

    FlowWorkflowVersion.associate = function (models) {
        FlowWorkflowVersion.belongsTo(models.FlowWorkflow, {
            foreignKey: 'workflowUuid',
            targetKey: 'uuid',
            as: 'workflow'
        });
    };

    return FlowWorkflowVersion;
};
