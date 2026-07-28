const {
    normalizeDefinition,
    normalizeNodeType,
    findEntryPoint,
    buildMainEdges,
    buildNameToIdMap,
    getMainTargetNames,
    EXECUTABLE_TYPES,
    isSideChannelOnlyNode,
    FRONTEND_TO_CANONICAL_TYPE
} = require('./flow-definition.service');

function validateWorkflowDefinition(def) {
    const errors = [];
    const normalized = normalizeDefinition(def);

    if (!normalized || typeof normalized !== 'object') {
        return { ok: false, errors: ['Definition must be an object'] };
    }
    if (!Array.isArray(normalized.nodes)) errors.push('nodes must be an array');
    if (!normalized.connections || typeof normalized.connections !== 'object') {
        errors.push('connections must be an object');
    }

    if (errors.length) return { ok: false, errors };

    const names = new Set();
    const ids = new Set();
    const nameToId = buildNameToIdMap(normalized.nodes);

    for (const n of normalized.nodes) {
        if (!n || !n.id) {
            errors.push('Every node must have an id');
            continue;
        }
        if (ids.has(n.id)) errors.push(`Duplicate node id: ${n.id}`);
        ids.add(n.id);
        if (!n.name) errors.push(`Node ${n.id} must have a name`);
        else if (names.has(n.name)) errors.push(`Duplicate node name: ${n.name}`);
        else names.add(n.name);
        if (!n.type) errors.push(`Node ${n.id} must have a type`);
        if (n.typeVersion == null) errors.push(`Node ${n.id} must have typeVersion`);
        if (!Array.isArray(n.position) || n.position.length < 2) {
            errors.push(`Node ${n.id} must have position [x, y]`);
        }
        if (n.parameters == null || typeof n.parameters !== 'object') {
            errors.push(`Node ${n.id} must have parameters object`);
        }
        if (n.type === 'logic') {
            const rules = n.parameters?.rules?.values;
            if (!Array.isArray(rules) || rules.length === 0) {
                errors.push(`Logic node ${n.name || n.id} must have parameters.rules.values`);
            }
        }
    }

    const entryNodes = normalized.nodes.filter(
        (n) => n.type === 'input' && n.name && !getMainTargetNames(normalized.connections).has(n.name)
    );
    if (entryNodes.length === 0) {
        errors.push('Flow must have one entry-point input node (type input, no incoming main edge)');
    } else if (entryNodes.length > 1) {
        errors.push('Flow must have exactly one entry-point input node');
    }

    for (const srcName of Object.keys(normalized.connections || {})) {
        if (!names.has(srcName)) {
            errors.push(`connections source unknown node name: ${srcName}`);
            continue;
        }
        const main = normalized.connections[srcName]?.main;
        if (!Array.isArray(main)) continue;
        main.forEach((branch, outputIndex) => {
            if (!Array.isArray(branch)) return;
            for (const t of branch) {
                if (!t || !t.node) {
                    errors.push(`Invalid connection target from ${srcName} main[${outputIndex}]`);
                    continue;
                }
                if (!names.has(t.node)) {
                    errors.push(`connections target unknown node name: ${t.node}`);
                }
            }
        });
    }

    const edges = buildMainEdges(normalized);
    const entry = findEntryPoint(normalized);
    if (entry && hasCycle(edges, entry.id)) {
        errors.push('Workflow graph contains a cycle');
    }

    return { ok: errors.length === 0, errors, definition: normalized };
}

function hasCycle(edges, entryId) {
    const adj = new Map();
    for (const e of edges) {
        if (!adj.has(e.from)) adj.set(e.from, []);
        adj.get(e.from).push(e.to);
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

    if (entryId && dfs(entryId)) return true;
    for (const id of adj.keys()) {
        if (!visited.has(id) && dfs(id)) return true;
    }
    return false;
}

module.exports = {
    FRONTEND_TO_CANONICAL_TYPE,
    normalizeNodeType,
    normalizeDefinition,
    validateWorkflowDefinition,
    EXECUTABLE_TYPES,
    isSideChannelOnlyNode
};
