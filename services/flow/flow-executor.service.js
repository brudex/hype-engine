const { v4: uuidv4 } = require('uuid');
const db = require('../../models');
const { getRunner } = require('./nodes');
const logger = require('../../utils/logger');
const {
    buildExecutionPlan,
    seedEntryContext,
    getUpstreamNodeId,
    getNodeParameters
} = require('./flow-definition.service');

function wrapError(nodeId, err, startedAt) {
    const finishedAt = new Date().toISOString();
    const durationMs = startedAt ? Date.now() - startedAt : 0;
    return {
        status: 'error',
        output: {},
        meta: {
            startedAt: new Date(startedAt || Date.now()).toISOString(),
            finishedAt,
            durationMs
        },
        error: { message: err.message || String(err), stack: err.stack },
        selectedOutput: null
    };
}

function wrapSkipped() {
    return {
        status: 'skipped',
        output: null,
        meta: {},
        error: null,
        selectedOutput: null
    };
}

function canTraverseEdge(edge, fromCtx, fromNodeDef) {
    if (!fromCtx) return false;
    if (fromCtx.status === 'skipped' || fromCtx.status === 'error') return false;
    if (fromNodeDef && fromNodeDef.type === 'logic') {
        if (fromCtx.status !== 'success') return false;
        const selected = fromCtx.selectedOutput;
        if (selected == null) return false;
        return edge.outputIndex === selected;
    }
    if (fromCtx.status === 'success') return edge.outputIndex === 0;
    return false;
}

function aggregateRunStatus(statuses) {
    const hasError = statuses.some((r) => r.status === 'error');
    const hasSuccess = statuses.some((r) => r.status === 'success');
    if (hasError && hasSuccess) return 'partial_failure';
    if (hasError) return 'failed';
    return 'success';
}

function toNodeSnapshot(wrapped, startedAtDate, finishedAtDate) {
    const meta = wrapped.meta || {};
    const startedAt = meta.startedAt || startedAtDate.toISOString();
    const finishedAt = meta.finishedAt || (finishedAtDate || new Date()).toISOString();
    return {
        status: wrapped.status,
        output: wrapped.output,
        error: wrapped.error != null ? wrapped.error : null,
        startedAt,
        finishedAt,
        durationMs: meta.durationMs != null ? meta.durationMs : 0
    };
}

function recordNodeResult(context, snapshot, nodeId, wrapped, startedAtDate, finishedAtDate) {
    context[nodeId] = wrapped;
    snapshot[nodeId] = toNodeSnapshot(wrapped, startedAtDate, finishedAtDate);
}

async function runWorkflow(workflowRow, options) {
    const userUuid = options.userUuid;
    const dryRun = !!options.dryRun;
    const triggerType = options.triggerType || workflowRow.triggerType || 'manual';

    const plan = buildExecutionPlan(workflowRow.definition);
    const { entryNodeId, nodeById, edges, executableIds } = plan;

    const context = seedEntryContext(entryNodeId, options.initialContext || {});
    const snapshot = {};
    const runStartedAt = new Date();

    snapshot[entryNodeId] = toNodeSnapshot(context[entryNodeId], runStartedAt, runStartedAt);

    const run = await db.FlowRun.create({
        uuid: uuidv4(),
        workflowUuid: workflowRow.uuid,
        userUuid,
        triggerType,
        status: 'running',
        startedAt: runStartedAt,
        finishedAt: null,
        initialContext: options.initialContext || {},
        contextSnapshot: { ...snapshot },
        error: null
    });

    const runUuid = run.uuid;
    const pending = new Set([...executableIds].filter((id) => id !== entryNodeId));

    function isDone(nodeId) {
        const c = context[nodeId];
        return c != null && ['success', 'error', 'skipped'].includes(c.status);
    }

    function incomingEdges(nodeId) {
        return edges.filter((e) => e.to === nodeId);
    }

    function ready(nodeId) {
        const nodeDef = nodeById.get(nodeId);
        if (nodeDef?.disabled) return false;

        const incoming = incomingEdges(nodeId);
        if (incoming.length === 0) {
            return edges.some(
                (e) =>
                    e.to === nodeId &&
                    e.from === entryNodeId &&
                    canTraverseEdge(e, context[entryNodeId], null)
            );
        }

        const relevant = incoming.filter((e) => executableIds.has(e.from));
        if (relevant.length === 0) return false;

        return relevant.every((e) => {
            const fromCtx = context[e.from];
            const fromDef = nodeById.get(e.from);
            if (!isDone(e.from) && e.from !== entryNodeId) return false;
            if (e.from === entryNodeId && !context[entryNodeId]) return false;
            return canTraverseEdge(e, fromCtx, fromDef);
        });
    }

    try {
        while (pending.size > 0) {
            const batch = [...pending].filter((id) => ready(id)).sort();
            if (batch.length === 0) break;

            for (const nodeId of batch) {
                pending.delete(nodeId);
                const nodeDef = nodeById.get(nodeId);
                const startedAtMs = Date.now();
                const startedAtDate = new Date(startedAtMs);
                const upstreamNodeId = getUpstreamNodeId(nodeId, edges, executableIds);
                const resolveOpts = { upstreamNodeId };

                if (nodeDef?.disabled || nodeDef?.type === 'input') {
                    const w = wrapSkipped();
                    recordNodeResult(context, snapshot, nodeId, w, startedAtDate, new Date());
                    continue;
                }

                const runner = getRunner(nodeDef.type);
                if (!runner) {
                    const w = wrapError(nodeId, new Error(`Unknown node type: ${nodeDef.type}`), startedAtMs);
                    recordNodeResult(context, snapshot, nodeId, w, startedAtDate, new Date());
                    continue;
                }

                const runnerNode = {
                    ...nodeDef,
                    config: getNodeParameters(nodeDef),
                    _resolveOptions: resolveOpts
                };

                let wrapped;
                try {
                    const r =
                        nodeDef.type === 'publish'
                            ? await runner(runnerNode, context, dryRun, userUuid)
                            : await runner(runnerNode, context, dryRun);
                    const durationMs = Date.now() - startedAtMs;
                    wrapped = {
                        status: 'success',
                        output: r.output != null ? r.output : {},
                        meta: {
                            startedAt: startedAtDate.toISOString(),
                            finishedAt: new Date().toISOString(),
                            durationMs,
                            ...(r.meta || {})
                        },
                        error: null,
                        selectedOutput: r.selectedOutput != null ? r.selectedOutput : null
                    };
                } catch (err) {
                    wrapped = wrapError(nodeId, err, startedAtMs);
                    if (err.meta) wrapped.meta = { ...wrapped.meta, ...err.meta };
                }

                recordNodeResult(context, snapshot, nodeId, wrapped, startedAtDate, new Date());
            }
        }

        for (const nodeId of pending) {
            const w = wrapSkipped();
            recordNodeResult(context, snapshot, nodeId, w, new Date(), new Date());
        }

        const ranStatuses = [...executableIds]
            .map((id) => snapshot[id])
            .filter(Boolean)
            .map((c) => ({ status: c.status }));
        const finalStatus =
            ranStatuses.length === 0 ? 'success' : aggregateRunStatus(ranStatuses);

        await run.update({
            status: dryRun ? 'success' : finalStatus,
            finishedAt: new Date(),
            contextSnapshot: JSON.parse(JSON.stringify(snapshot)),
            error: null
        });

        const finishedAt = new Date();

        return {
            runId: runUuid,
            workflowUuid: workflowRow.uuid,
            status: dryRun ? 'success' : finalStatus,
            nodes: snapshot,
            startedAt: runStartedAt.toISOString(),
            finishedAt: finishedAt.toISOString(),
            error: null
        };
    } catch (e) {
        logger.error('Flow executor error:', e);
        await run.update({
            status: 'failed',
            finishedAt: new Date(),
            contextSnapshot: JSON.parse(JSON.stringify(snapshot)),
            error: { message: e.message || String(e) }
        });
        throw e;
    }
}

module.exports = {
    runWorkflow,
    canTraverseEdge,
    toNodeSnapshot
};
