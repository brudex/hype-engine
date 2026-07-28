const { getRunner } = require('./nodes');
const logger = require('../../utils/logger');
const {
    normalizeNodeType,
    getNodeParameters,
    isSideChannelOnlyNode
} = require('./flow-definition.service');

function normalizeNodePayload(raw) {
    if (!raw || typeof raw !== 'object') {
        const err = new Error('Node payload must be an object');
        err.statusCode = 400;
        throw err;
    }

    const node = raw.node && typeof raw.node === 'object' && !Array.isArray(raw.node) ? raw.node : raw;
    const id = node.id || node.uuid;
    if (!id) {
        const err = new Error('Node must include id');
        err.statusCode = 400;
        throw err;
    }
    if (!node.type) {
        const err = new Error('Node must include type');
        err.statusCode = 400;
        throw err;
    }

    const type = normalizeNodeType(node.type);
    const position = Array.isArray(node.position)
        ? node.position
        : node.position && typeof node.position === 'object'
          ? [node.position.x || 0, node.position.y || 0]
          : [0, 0];

    return {
        id: String(id),
        name: node.name || String(id),
        type,
        typeVersion: node.typeVersion != null ? node.typeVersion : 1,
        position,
        parameters: node.parameters != null ? node.parameters : node.config || {},
        disabled: !!node.disabled,
        credentials: node.credentials,
        webhookId: node.webhookId,
        notes: node.notes
    };
}

function normalizeExecutionContext(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return {};
    }
    return raw;
}

function inferUpstreamNodeId(context, nodeId) {
    const keys = Object.keys(context).filter((k) => k !== nodeId);
    if (keys.length === 1) return keys[0];
    return null;
}

/**
 * Execute a single workflow node using the same runners as flow-executor.service.
 *
 * @param {object} nodePayload - Full node object (n8n-style or canonical), or { node, context, dryRun, upstreamNodeId }
 * @param {object} options
 * @param {string} options.userUuid
 * @param {boolean} [options.dryRun=false]
 * @param {object} [options.context={}] - Upstream node results keyed by node id
 * @param {string} [options.upstreamNodeId] - Explicit upstream for variable resolution
 */
async function executeNode(nodePayload, options = {}) {
    const userUuid = options.userUuid;
    const dryRun = !!options.dryRun;
    const envelope = nodePayload?.node ? nodePayload : { node: nodePayload };
    const nodeDef = normalizeNodePayload(envelope.node || nodePayload);
    const context = normalizeExecutionContext(
        options.context != null ? options.context : envelope.context
    );
    const upstreamNodeId =
        options.upstreamNodeId ||
        envelope.upstreamNodeId ||
        inferUpstreamNodeId(context, nodeDef.id);

    if (nodeDef.disabled) {
        const result = {
            nodeId: nodeDef.id,
            nodeName: nodeDef.name,
            nodeType: nodeDef.type,
            status: 'skipped',
            output: null,
            meta: { dryRun },
            selectedOutput: null,
            error: null,
            durationMs: 0
        };
        logger.info('Flow node execute skipped (disabled)', {
            nodeId: nodeDef.id,
            nodeType: nodeDef.type
        });
        return result;
    }

    if (isSideChannelOnlyNode(nodeDef, {})) {
        const err = new Error(
            `Node type "${nodeDef.type}" is not executable standalone (side-channel attachment only)`
        );
        err.statusCode = 400;
        throw err;
    }

    const runner = getRunner(nodeDef.type);
    if (!runner) {
        const err = new Error(`No runner for node type: ${nodeDef.type}`);
        err.statusCode = 400;
        throw err;
    }

    const resolveOpts = { upstreamNodeId };
    const runnerNode = {
        ...nodeDef,
        config: getNodeParameters(nodeDef),
        _resolveOptions: resolveOpts
    };

    const startedAtMs = Date.now();
    const startedAt = new Date(startedAtMs).toISOString();

    logger.info('Flow node execute start', {
        nodeId: nodeDef.id,
        nodeName: nodeDef.name,
        nodeType: nodeDef.type,
        dryRun,
        upstreamNodeId: upstreamNodeId || null,
        parameterCount: Object.keys(runnerNode.config || {}).length,
        contextNodeCount: Object.keys(context).length
    });

    try {
        const runnerResult =
            nodeDef.type === 'publish'
                ? await runner(runnerNode, context, dryRun, userUuid)
                : await runner(runnerNode, context, dryRun);

        const durationMs = Date.now() - startedAtMs;
        const finishedAt = new Date().toISOString();
        const output = runnerResult.output != null ? runnerResult.output : {};
        const meta = {
            startedAt,
            finishedAt,
            durationMs,
            dryRun,
            ...(runnerResult.meta || {})
        };

        const result = {
            nodeId: nodeDef.id,
            nodeName: nodeDef.name,
            nodeType: nodeDef.type,
            status: 'success',
            output,
            meta,
            selectedOutput: runnerResult.selectedOutput != null ? runnerResult.selectedOutput : null,
            error: null,
            durationMs
        };

        logger.info('Flow node execute complete', {
            nodeId: nodeDef.id,
            nodeType: nodeDef.type,
            durationMs,
            outputType: Array.isArray(output) ? 'array' : typeof output
        });

        return result;
    } catch (err) {
        const durationMs = Date.now() - startedAtMs;
        const finishedAt = new Date().toISOString();
        const error = {
            message: err.message || String(err),
            ...(err.meta ? { meta: err.meta } : {}),
            ...(err.responseBody != null ? { responseBody: err.responseBody } : {})
        };

        logger.error('Flow node execute failed', {
            nodeId: nodeDef.id,
            nodeType: nodeDef.type,
            durationMs,
            errorMessage: error.message
        });

        return {
            nodeId: nodeDef.id,
            nodeName: nodeDef.name,
            nodeType: nodeDef.type,
            status: 'error',
            output: {},
            meta: {
                startedAt,
                finishedAt,
                durationMs,
                dryRun,
                ...(err.meta || {})
            },
            selectedOutput: null,
            error,
            durationMs
        };
    }
}

module.exports = {
    executeNode,
    normalizeNodePayload,
    normalizeExecutionContext
};
