/**
 * Flow service — public entry point for controllers, jobs, and webhooks.
 *
 * Usage:
 *   const flowService = require('../services/flow');
 *   await flowService.executeNode(nodeJson, { userUuid, context, dryRun });
 *   await flowService.executeFlow(workflowRow, { userUuid, initialContext, dryRun });
 */
const { executeNode: runNode } = require('./flow-node-executor.service');
const { runWorkflow } = require('./flow-executor.service');

function assertWorkflow(workflow) {
    if (!workflow || typeof workflow !== 'object') {
        const err = new Error('workflow must be a FlowWorkflow instance or row');
        err.statusCode = 400;
        throw err;
    }
    if (!workflow.uuid) {
        const err = new Error('workflow.uuid is required');
        err.statusCode = 400;
        throw err;
    }
    if (!workflow.definition) {
        const err = new Error('workflow.definition is required');
        err.statusCode = 400;
        throw err;
    }
}

/**
 * Execute a single node from full node JSON (n8n-style or canonical).
 *
 * @param {object} nodeJson - Node object, or { node, context?, dryRun?, upstreamNodeId? }
 * @param {object} [options]
 * @param {string} options.userUuid - Acting user (required for publish nodes)
 * @param {boolean} [options.dryRun=false]
 * @param {object} [options.context={}] - Upstream node results keyed by node id
 * @param {string} [options.upstreamNodeId] - Explicit upstream for variable resolution
 * @returns {Promise<object>} Per-node result with status, output, meta, error
 */
async function executeNode(nodeJson, options = {}) {
    return runNode(nodeJson, options);
}

/**
 * Execute a full workflow from a FlowWorkflow model/Sequelize row.
 *
 * @param {import('../../models/flow-workflow')} workflow - FlowWorkflow instance or plain row
 * @param {object} options
 * @param {string} options.userUuid - User running the flow
 * @param {boolean} [options.dryRun=false]
 * @param {object} [options.initialContext={}] - Trigger / manual-run payload for entry node
 * @param {string} [options.triggerType] - Defaults to workflow.triggerType or 'manual'
 * @returns {Promise<{
 *   runId: string,
 *   workflowUuid: string,
 *   status: string,
 *   nodes: Record<string, { status, output, error, startedAt, finishedAt, durationMs }>,
 *   startedAt: string,
 *   finishedAt: string,
 *   error: object|null
 * }>}
 */
async function executeFlow(workflow, options = {}) {
    assertWorkflow(workflow);

    const userUuid = options.userUuid || workflow.userUuid;
    if (!userUuid) {
        const err = new Error('options.userUuid is required');
        err.statusCode = 400;
        throw err;
    }

    const result = await runWorkflow(workflow, { ...options, userUuid });

    return {
        runId: result.runId,
        workflowUuid: result.workflowUuid,
        status: result.status,
        nodes: result.nodes,
        startedAt: result.startedAt,
        finishedAt: result.finishedAt,
        error: result.error != null ? result.error : null
    };
}

module.exports = {
    executeNode,
    executeFlow
};
