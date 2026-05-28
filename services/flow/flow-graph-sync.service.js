const { v4: uuidv4 } = require('uuid');
const db = require('../../models');

/**
 * Replace FlowNode rows from canonical definition (edges live only in definition JSON).
 */
async function syncWorkflowGraph(workflowUuid, definition, transaction) {
    await db.FlowNode.destroy({ where: { workflowUuid }, transaction });

    const nodes = (definition.nodes || []).map((n) => ({
        uuid: uuidv4(),
        workflowUuid,
        nodeId: n.id,
        type: n.type,
        name: n.name || n.id,
        position: n.position || {},
        config: n.config || {},
        outputs: n.outputs || {},
        disabled: !!n.disabled
    }));

    if (nodes.length) {
        await db.FlowNode.bulkCreate(nodes, { transaction });
    }
}

module.exports = { syncWorkflowGraph };
