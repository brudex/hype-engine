const FRONTEND_TO_CANONICAL_TYPE = {
    input: 'input',
    http_request: 'http_request',
    rest_api: 'rest',
    rest: 'rest',
    prompt: 'ai_prompt',
    javascript: 'javascript',
    post: 'publish',
    condition: 'logic'
};

const N8N_TYPE_TO_CANONICAL = {
    '@n8n/n8n-nodes-langchain.chatTrigger': 'input',
    '@n8n/n8n-nodes-langchain.agent': 'ai_prompt',
    '@n8n/n8n-nodes-langchain.lmChatOpenAi': 'ai_languageModel',
    'n8n-nodes-base.httpRequest': 'http_request',
    'n8n-nodes-base.code': 'javascript',
    'n8n-nodes-base.switch': 'logic'
};

const EXECUTABLE_TYPES = new Set([
    'input',
    'http_request',
    'rest',
    'ai_prompt',
    'javascript',
    'logic',
    'publish'
]);

function normalizeNodeType(type) {
    if (!type) return type;
    const t = String(type);
    if (N8N_TYPE_TO_CANONICAL[t]) return N8N_TYPE_TO_CANONICAL[t];
    if (FRONTEND_TO_CANONICAL_TYPE[t]) return FRONTEND_TO_CANONICAL_TYPE[t];
    return t;
}

function isLegacyDefinition(def) {
    return !!(def && (Array.isArray(def.edges) || def.trigger));
}

function legacyToFlowSpec(def) {
    const nodes = (def.nodes || []).map((n) => ({
        id: n.id,
        name: n.name || n.id,
        type: normalizeNodeType(n.type),
        typeVersion: n.typeVersion != null ? n.typeVersion : 1,
        position: Array.isArray(n.position)
            ? n.position
            : [n.position?.x || 0, n.position?.y || 0],
        parameters: n.parameters || n.config || {},
        credentials: n.credentials,
        webhookId: n.webhookId,
        notes: n.notes,
        disabled: !!n.disabled
    }));

    if (def.trigger && def.trigger.id) {
        const hasEntry = nodes.some((n) => n.id === def.trigger.id);
        if (!hasEntry) {
            nodes.unshift({
                id: def.trigger.id,
                name: def.trigger.name || 'Trigger',
                type: 'input',
                typeVersion: 1,
                position: [0, 0],
                parameters: def.trigger.config || {},
                webhookId: def.trigger.config?.webhookId
            });
        }
    }

    const idToName = new Map(nodes.map((n) => [n.id, n.name]));
    const connections = {};

    for (const e of def.edges || []) {
        const fromName = idToName.get(e.from);
        const toName = idToName.get(e.to);
        if (!fromName || !toName) continue;
        if (!connections[fromName]) connections[fromName] = { main: [] };
        if (!connections[fromName].main) connections[fromName].main = [];

        let outputIndex = 0;
        if (e.fromOutput != null && e.fromOutput !== 'success') {
            const src = nodes.find((n) => n.id === e.from);
            if (src?.type === 'logic' && Array.isArray(src.parameters?.rules?.values)) {
                const idx = src.parameters.rules.values.findIndex(
                    (_, i) => `condition_${i + 1}` === String(e.fromOutput) || String(e.fromOutput) === String(i)
                );
                outputIndex = idx >= 0 ? idx : 0;
            }
        }

        while (connections[fromName].main.length <= outputIndex) {
            connections[fromName].main.push([]);
        }
        connections[fromName].main[outputIndex].push({
            node: toName,
            type: 'main',
            index: 0
        });
    }

    return {
        nodes,
        connections,
        pinData: def.pinData || {},
        meta: def.meta || {}
    };
}

function normalizeNode(node) {
    if (!node || typeof node !== 'object') return node;
    const position = Array.isArray(node.position)
        ? node.position
        : node.position && typeof node.position === 'object'
          ? [node.position.x || 0, node.position.y || 0]
          : [0, 0];

    return {
        ...node,
        type: normalizeNodeType(node.type),
        typeVersion: node.typeVersion != null ? node.typeVersion : 1,
        position,
        parameters: node.parameters != null ? node.parameters : node.config || {}
    };
}

function normalizeDefinition(def) {
    if (!def || typeof def !== 'object') return def;
    const base = isLegacyDefinition(def) ? legacyToFlowSpec(def) : { ...def };
    return {
        nodes: Array.isArray(base.nodes) ? base.nodes.map(normalizeNode) : [],
        connections: base.connections && typeof base.connections === 'object' ? base.connections : {},
        pinData: base.pinData && typeof base.pinData === 'object' ? base.pinData : {},
        meta: base.meta && typeof base.meta === 'object' ? base.meta : {}
    };
}

function buildNameToIdMap(nodes) {
    const map = new Map();
    for (const n of nodes || []) {
        if (n && n.name) map.set(n.name, n.id);
    }
    return map;
}

function getMainTargetNames(connections) {
    const targets = new Set();
    for (const srcName of Object.keys(connections || {})) {
        const main = connections[srcName]?.main;
        if (!Array.isArray(main)) continue;
        for (const branch of main) {
            if (!Array.isArray(branch)) continue;
            for (const t of branch) {
                if (t && t.node) targets.add(t.node);
            }
        }
    }
    return targets;
}

function findEntryPoint(def) {
    const nodes = def.nodes || [];
    const targets = getMainTargetNames(def.connections);
    const candidates = nodes.filter(
        (n) => n.type === 'input' && n.name && !targets.has(n.name)
    );
    if (candidates.length === 1) return candidates[0];
    if (candidates.length === 0) return null;
    return candidates[0];
}

function isSideChannelOnlyNode(node, connections) {
    if (!node || !node.name) return false;
    if (node.type === 'ai_languageModel') return true;
    const conn = connections?.[node.name];
    if (!conn) return false;
    const hasMain =
        Array.isArray(conn.main) &&
        conn.main.some((branch) => Array.isArray(branch) && branch.length > 0);
    if (hasMain) return false;
    const nonMainKeys = Object.keys(conn).filter((k) => k !== 'main');
    return nonMainKeys.length > 0;
}

function buildMainEdges(def) {
    const nameToId = buildNameToIdMap(def.nodes);
    const edges = [];
    for (const srcName of Object.keys(def.connections || {})) {
        const fromId = nameToId.get(srcName);
        if (!fromId) continue;
        const main = def.connections[srcName]?.main;
        if (!Array.isArray(main)) continue;
        main.forEach((branch, outputIndex) => {
            if (!Array.isArray(branch)) return;
            for (const t of branch) {
                if (!t || t.type !== 'main') continue;
                const toId = nameToId.get(t.node);
                if (!toId) continue;
                edges.push({
                    from: fromId,
                    to: toId,
                    outputIndex,
                    inputIndex: t.index != null ? t.index : 0
                });
            }
        });
    }
    return edges;
}

function buildExecutionPlan(def) {
    const normalized = normalizeDefinition(def);
    const entryNode = findEntryPoint(normalized);
    if (!entryNode) {
        throw new Error('Flow must have exactly one entry-point input node (no incoming main edge)');
    }

    const nodeById = new Map((normalized.nodes || []).map((n) => [n.id, n]));
    const edges = buildMainEdges(normalized);
    const executableIds = new Set();

    for (const n of normalized.nodes || []) {
        if (!EXECUTABLE_TYPES.has(n.type)) continue;
        if (isSideChannelOnlyNode(n, normalized.connections)) continue;
        executableIds.add(n.id);
    }

    executableIds.add(entryNode.id);

    const upstreamMap = new Map();
    for (const id of executableIds) upstreamMap.set(id, new Set());
    for (const e of edges) {
        if (!executableIds.has(e.from) || !executableIds.has(e.to)) continue;
        if (!upstreamMap.has(e.to)) upstreamMap.set(e.to, new Set());
        upstreamMap.get(e.to).add(e.from);
    }

    return {
        definition: normalized,
        entryNodeId: entryNode.id,
        entryNode,
        nodeById,
        edges,
        executableIds,
        upstreamMap,
        nameToId: buildNameToIdMap(normalized.nodes)
    };
}

function getNodeParameters(nodeDef) {
    if (!nodeDef) return {};
    return nodeDef.parameters != null ? nodeDef.parameters : nodeDef.config || {};
}

function entryTriggerMeta(entryNode, definition = {}) {
    const params = getNodeParameters(entryNode);
    return {
        triggerType:
            params.triggerType ||
            definition.meta?.triggerType ||
            (entryNode.webhookId ? 'webhook' : 'manual'),
        triggerConfig: {
            ...params,
            webhookId: entryNode.webhookId || params.webhookId || null
        }
    };
}

function secureTriggerConfig(triggerType, triggerConfig, previousConfig = {}) {
    const next = { ...(triggerConfig || {}) };
    if (triggerType !== 'webhook') {
        delete next.webhookSecret;
        return next;
    }

    const existing =
        typeof previousConfig.webhookSecret === 'string' &&
        previousConfig.webhookSecret.length >= 32
            ? previousConfig.webhookSecret
            : null;
    next.webhookSecret = existing || randomBytes(32).toString('hex');
    return next;
}

function seedEntryContext(entryNodeId, initialContext) {
    const raw =
        initialContext && typeof initialContext === 'object' && !Array.isArray(initialContext)
            ? initialContext
            : {};
    const body = raw.body != null ? raw.body : raw;
    return {
        [entryNodeId]: {
            status: 'success',
            output: typeof body === 'object' && body !== null ? { ...body } : { body },
            meta: { triggeredAt: new Date().toISOString(), ...(raw.meta || {}) },
            error: null
        }
    };
}

function getUpstreamNodeId(nodeId, edges, executableIds) {
    const incoming = edges.filter(
        (e) => e.to === nodeId && executableIds.has(e.from)
    );
    if (incoming.length === 1) return incoming[0].from;
    return null;
}

module.exports = {
    FRONTEND_TO_CANONICAL_TYPE,
    N8N_TYPE_TO_CANONICAL,
    EXECUTABLE_TYPES,
    normalizeNodeType,
    normalizeDefinition,
    buildNameToIdMap,
    getMainTargetNames,
    findEntryPoint,
    buildMainEdges,
    buildExecutionPlan,
    getNodeParameters,
    entryTriggerMeta,
    secureTriggerConfig,
    seedEntryContext,
    getUpstreamNodeId,
    isSideChannelOnlyNode
};
const { randomBytes } = require('crypto');
