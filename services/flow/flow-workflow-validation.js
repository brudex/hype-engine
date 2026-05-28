const FRONTEND_TO_CANONICAL_TYPE = {
    input: 'input',
    http_request: 'http_request',
    rest_api: 'rest',
    prompt: 'ai_prompt',
    javascript: 'javascript',
    post: 'publish',
    condition: 'logic'
};

function normalizeNodeType(type) {
    if (!type) return type;
    const t = String(type);
    return FRONTEND_TO_CANONICAL_TYPE[t] || t;
}

/**
 * Normalize definition node types to canonical backend values.
 */
function normalizeDefinition(def) {
    if (!def || typeof def !== 'object') return def;
    const out = { ...def };
    if (Array.isArray(out.nodes)) {
        out.nodes = out.nodes.map((n) => ({
            ...n,
            type: normalizeNodeType(n.type)
        }));
    }
    return out;
}

function getTriggerOutputs(trigger) {
    if (!trigger) return { success: {} };
    if (trigger.outputs && typeof trigger.outputs === 'object') return trigger.outputs;
    return { success: {} };
}

function getNodeOutputs(node) {
    if (!node) return {};
    if (node.type === 'logic' && Array.isArray(node.config?.conditions)) {
        const o = {};
        for (const c of node.config.conditions) {
            if (c && c.id) o[c.id] = {};
        }
        return o;
    }
    if (node.outputs && typeof node.outputs === 'object') return node.outputs;
    return { success: {}, error: {} };
}

function validateWorkflowDefinition(def) {
    const errors = [];
    if (!def || typeof def !== 'object') {
        return { ok: false, errors: ['Definition must be an object'] };
    }
    if (!def.id) errors.push('id is required');
    if (!def.name) errors.push('name is required');
    if (!def.version) errors.push('version is required');
    if (!def.trigger || typeof def.trigger !== 'object') {
        errors.push('trigger is required');
    } else if (!def.trigger.id) {
        errors.push('trigger.id is required');
    }
    if (!Array.isArray(def.nodes)) errors.push('nodes must be an array');
    if (!Array.isArray(def.edges)) errors.push('edges must be an array');

    if (errors.length) return { ok: false, errors };

    const triggerId = def.trigger.id;
    const nodeIds = new Set();
    for (const n of def.nodes) {
        if (!n || !n.id) {
            errors.push('Every node must have an id');
            continue;
        }
        if (nodeIds.has(n.id)) errors.push(`Duplicate node id: ${n.id}`);
        nodeIds.add(n.id);
        if (!n.type) errors.push(`Node ${n.id} must have a type`);
        if (n.name == null || n.name === '') errors.push(`Node ${n.id} must have a name`);
        if (n.type === 'logic') {
            const conds = n.config?.conditions;
            if (!Array.isArray(conds) || conds.length === 0) {
                errors.push(`Logic node ${n.id} must have config.conditions`);
            } else {
                const cids = new Set();
                for (const c of conds) {
                    if (!c || !c.id) {
                        errors.push(`Logic node ${n.id}: each condition needs id`);
                        continue;
                    }
                    if (cids.has(c.id)) errors.push(`Logic node ${n.id}: duplicate condition id ${c.id}`);
                    cids.add(c.id);
                }
            }
        }
    }

    const idSet = new Set([triggerId, ...nodeIds]);
    const nodeById = new Map(def.nodes.map((n) => [n.id, n]));

    for (const e of def.edges) {
        if (!e || !e.from || !e.to) {
            errors.push('Each edge must have from and to');
            continue;
        }
        if (!idSet.has(e.from)) errors.push(`Edge from unknown id: ${e.from}`);
        if (!idSet.has(e.to)) errors.push(`Edge to unknown id: ${e.to}`);

        const fromOut = e.fromOutput != null ? String(e.fromOutput) : 'success';
        if (e.from === triggerId) {
            const tOut = getTriggerOutputs(def.trigger);
            if (!Object.prototype.hasOwnProperty.call(tOut, fromOut)) {
                errors.push(`Edge from trigger: invalid fromOutput "${fromOut}"`);
            }
        } else {
            const src = nodeById.get(e.from);
            if (src) {
                const outs = getNodeOutputs(src);
                if (src.type === 'logic') {
                    if (!Object.prototype.hasOwnProperty.call(outs, fromOut)) {
                        errors.push(`Edge from logic node ${e.from}: fromOutput "${fromOut}" not in conditions`);
                    }
                } else if (!Object.prototype.hasOwnProperty.call(outs, fromOut)) {
                    errors.push(`Edge from ${e.from}: fromOutput "${fromOut}" not in node outputs`);
                }
            }
        }
    }

    if (hasCycle(def, triggerId, nodeIds)) {
        errors.push('Workflow graph contains a cycle');
    }

    return { ok: errors.length === 0, errors };
}

function hasCycle(def, triggerId, nodeIds) {
    const ids = new Set([triggerId, ...nodeIds]);
    const adj = new Map();
    for (const id of ids) adj.set(id, []);
    for (const e of def.edges || []) {
        if (ids.has(e.from) && ids.has(e.to)) {
            adj.get(e.from).push(e.to);
        }
    }
    const visited = new Set();
    const stack = new Set();

    function dfs(u) {
        if (stack.has(u)) return true;
        if (visited.has(u)) return false;
        visited.add(u);
        stack.add(u);
        for (const v of adj.get(u) || []) {
            if (dfs(v)) return true;
        }
        stack.delete(u);
        return false;
    }

    for (const id of ids) {
        if (!visited.has(id) && dfs(id)) return true;
    }
    return false;
}

module.exports = {
    FRONTEND_TO_CANONICAL_TYPE,
    normalizeNodeType,
    normalizeDefinition,
    validateWorkflowDefinition
};
