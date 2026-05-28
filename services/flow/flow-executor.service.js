const { v4: uuidv4 } = require('uuid');
const db = require('../../models');
const { getRunner } = require('./nodes');
const logger = require('../../utils/logger');

function wrapSuccess(nodeId, output, meta, startedAt) {
    const finishedAt = new Date().toISOString();
    const durationMs = startedAt ? Date.now() - startedAt : 0;
    return {
        status: 'success',
        output: output != null ? output : {},
        meta: {
            startedAt: new Date(startedAt || Date.now()).toISOString(),
            finishedAt,
            durationMs
        },
        error: null
    };
}

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
        error: { message: err.message || String(err), stack: err.stack }
    };
}

function wrapSkipped() {
    return {
        status: 'skipped',
        output: null,
        meta: {},
        error: null
    };
}

function canTraverseEdge(edge, fromCtx, fromNodeDef, triggerId) {
    if (!fromCtx) return false;
    if (fromCtx.status === 'skipped') return false;
    const fromOut = edge.fromOutput != null ? String(edge.fromOutput) : 'success';
    if (edge.from === triggerId) {
        if (fromCtx.status !== 'success') return false;
        return fromOut === 'success';
    }
    if (!fromNodeDef) return false;
    if (fromNodeDef.type === 'logic') {
        if (fromCtx.status !== 'success') return false;
        if (!fromCtx.output || !fromCtx.output.matched) return false;
        return fromOut === fromCtx.output.conditionId;
    }
    if (fromCtx.status === 'success') return fromOut === 'success';
    if (fromCtx.status === 'error') return fromOut === 'error';
    return false;
}

function buildExecutorContext(initialContext, triggerId) {
    const raw = initialContext && typeof initialContext === 'object' ? { ...initialContext } : {};
    const ctx = { ...raw };
    if (!ctx[triggerId]) {
        const body =
            raw.trigger?.output?.body != null
                ? raw.trigger.output.body
                : {};
        ctx[triggerId] = {
            status: 'success',
            output: { body },
            meta: raw.trigger?.meta || {},
            error: raw.trigger?.error != null ? raw.trigger.error : null
        };
    }
    return ctx;
}

function aggregateRunStatus(statuses) {
    const hasError = statuses.some((r) => r.status === 'error');
    const hasSuccess = statuses.some((r) => r.status === 'success');
    if (hasError && hasSuccess) return 'partial_failure';
    if (hasError) return 'failed';
    return 'success';
}

async function persistRunNode(runUuid, workflowUuid, nodeId, record) {
    await db.FlowRunNode.create({
        uuid: uuidv4(),
        runUuid,
        workflowUuid,
        nodeId,
        status: record.status,
        selectedOutput: record.selectedOutput != null ? record.selectedOutput : null,
        inputContext: record.inputContext || {},
        output: record.output != null ? record.output : {},
        meta: record.meta || {},
        error: record.error != null ? record.error : null,
        startedAt: record.startedAt,
        finishedAt: record.finishedAt || null,
        durationMs: record.durationMs != null ? record.durationMs : 0
    });
}

/**
 * @param {object} workflowRow - FlowWorkflow instance
 * @param {object} options
 * @param {string} options.userUuid
 * @param {object} options.initialContext - request context (may include trigger)
 * @param {boolean} options.dryRun
 * @param {string} options.triggerType
 */
async function runWorkflow(workflowRow, options) {
    const userUuid = options.userUuid;
    const dryRun = !!options.dryRun;
    const triggerType = options.triggerType || workflowRow.triggerType || 'manual';
    const def = workflowRow.definition;
    const triggerId = def.trigger.id;
    const nodeById = new Map((def.nodes || []).map((n) => [n.id, n]));
    const disabled = new Set((def.nodes || []).filter((n) => n.disabled).map((n) => n.id));

    let context = buildExecutorContext(options.initialContext || {}, triggerId);

    const run = await db.FlowRun.create({
        uuid: uuidv4(),
        workflowUuid: workflowRow.uuid,
        userUuid,
        triggerType,
        status: 'running',
        startedAt: new Date(),
        finishedAt: null,
        initialContext: options.initialContext || {},
        contextSnapshot: {},
        error: null
    });

    const runUuid = run.uuid;
    const workflowUuid = workflowRow.uuid;
    const pending = new Set((def.nodes || []).map((n) => n.id));
    const executedResults = [];

    function isDone(nodeId) {
        const c = context[nodeId];
        return c != null && ['success', 'error', 'skipped'].includes(c.status);
    }

    function ready(nodeId) {
        if (disabled.has(nodeId)) return false;
        const incoming = (def.edges || []).filter((e) => e.to === nodeId);
        if (incoming.length === 0) {
            return (def.edges || []).some(
                (e) => e.to === nodeId && e.from === triggerId && canTraverseEdge(e, context[triggerId], null, triggerId)
            );
        }
        return incoming.every((e) => {
            const fromCtx = e.from === triggerId ? context[triggerId] : context[e.from];
            const fromDef = e.from === triggerId ? null : nodeById.get(e.from);
            const srcDone = e.from === triggerId ? context[triggerId] != null : isDone(e.from);
            if (!srcDone) return false;
            return canTraverseEdge(e, fromCtx, fromDef, triggerId);
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

                if (disabled.has(nodeId)) {
                    const w = wrapSkipped();
                    context[nodeId] = w;
                    await persistRunNode(runUuid, workflowUuid, nodeId, {
                        status: 'skipped',
                        selectedOutput: null,
                        inputContext: JSON.parse(JSON.stringify(context)),
                        output: null,
                        meta: {},
                        error: null,
                        startedAt: startedAtDate,
                        finishedAt: new Date(),
                        durationMs: 0
                    });
                    executedResults.push({ nodeId, status: 'skipped' });
                    continue;
                }

                const runner = getRunner(nodeDef.type);
                if (!runner) {
                    const w = wrapError(nodeId, new Error(`Unknown node type: ${nodeDef.type}`), startedAtMs);
                    context[nodeId] = w;
                    await persistRunNode(runUuid, workflowUuid, nodeId, {
                        status: 'error',
                        selectedOutput: null,
                        inputContext: JSON.parse(JSON.stringify(context)),
                        output: {},
                        meta: w.meta,
                        error: w.error,
                        startedAt: startedAtDate,
                        finishedAt: new Date(),
                        durationMs: Date.now() - startedAtMs
                    });
                    executedResults.push({ nodeId, status: 'error' });
                    continue;
                }

                let wrapped;
                let selectedOutput = null;
                try {
                    const r =
                        nodeDef.type === 'publish'
                            ? await runner(nodeDef, context, dryRun, userUuid)
                            : await runner(nodeDef, context, dryRun);
                    const durationMs = Date.now() - startedAtMs;
                    const finishedAt = new Date().toISOString();
                    wrapped = {
                        status: 'success',
                        output: r.output != null ? r.output : {},
                        meta: {
                            startedAt: startedAtDate.toISOString(),
                            finishedAt,
                            durationMs,
                            ...(r.meta || {})
                        },
                        error: null
                    };
                    if (r.selectedOutput != null) selectedOutput = r.selectedOutput;
                } catch (err) {
                    wrapped = wrapError(nodeId, err, startedAtMs);
                    if (err.meta) {
                        wrapped.meta = { ...wrapped.meta, ...err.meta };
                    }
                }

                context[nodeId] = wrapped;
                await persistRunNode(runUuid, workflowUuid, nodeId, {
                    status: wrapped.status,
                    selectedOutput,
                    inputContext: JSON.parse(JSON.stringify(context)),
                    output: wrapped.output,
                    meta: wrapped.meta,
                    error: wrapped.error,
                    startedAt: startedAtDate,
                    finishedAt: new Date(),
                    durationMs: wrapped.meta?.durationMs || 0
                });
                executedResults.push({ nodeId, status: wrapped.status });
            }
        }

        const ranStatuses = (def.nodes || [])
            .map((n) => context[n.id])
            .filter(Boolean)
            .map((c) => ({ status: c.status }));
        const finalStatus =
            ranStatuses.length === 0 ? 'success' : aggregateRunStatus(ranStatuses);

        await run.update({
            status: dryRun ? 'success' : finalStatus,
            finishedAt: new Date(),
            contextSnapshot: JSON.parse(JSON.stringify(context)),
            error: null
        });

        return {
            runId: runUuid,
            status: dryRun ? 'success' : finalStatus,
            context
        };
    } catch (e) {
        logger.error('Flow executor error:', e);
        await run.update({
            status: 'failed',
            finishedAt: new Date(),
            contextSnapshot: JSON.parse(JSON.stringify(context)),
            error: { message: e.message || String(e) }
        });
        throw e;
    }
}

module.exports = {
    runWorkflow,
    buildExecutorContext,
    canTraverseEdge
};
