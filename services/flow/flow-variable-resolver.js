/**
 * Resolve {{ path }} and {{$json[...]}} against flow run context.
 * Missing paths -> empty string.
 */

function getByPath(obj, pathStr) {
    if (obj == null || pathStr == null || pathStr === '') return undefined;
    const normalized = String(pathStr).trim();
    const parts = [];
    let i = 0;
    let cur = '';
    while (i < normalized.length) {
        const ch = normalized[i];
        if (ch === '[') {
            if (cur) {
                parts.push({ type: 'key', value: cur });
                cur = '';
            }
            i++;
            let idx = '';
            while (i < normalized.length && normalized[i] !== ']') {
                idx += normalized[i];
                i++;
            }
            if (normalized[i] !== ']') return undefined;
            const n = parseInt(idx, 10);
            parts.push({ type: 'index', value: Number.isNaN(n) ? idx.replace(/^["']|["']$/g, '') : n });
            i++;
            continue;
        }
        if (ch === '.') {
            if (cur) {
                parts.push({ type: 'key', value: cur });
                cur = '';
            }
            i++;
            continue;
        }
        cur += ch;
        i++;
    }
    if (cur) parts.push({ type: 'key', value: cur });

    let current = obj;
    for (const p of parts) {
        if (current == null) return undefined;
        current = current[p.value];
    }
    return current;
}

const MUSTACHE = /\{\{\s*([^}]+?)\s*\}\}/g;

function resolveDollarJson(rawPath, context, upstreamNodeId) {
    if (!upstreamNodeId || !context[upstreamNodeId]) return undefined;
    const upstreamOut = context[upstreamNodeId].output;
    const m = String(rawPath).trim().match(/^\$json(?:\[([^\]]+)\]|\.(.+))?$/);
    if (!m) return undefined;
    const key = m[1] != null ? m[1].replace(/^["']|["']$/g, '') : m[2];
    if (key == null || key === '') return upstreamOut;
    return getByPath(upstreamOut, key);
}

function resolveString(template, context, options = {}) {
    if (template == null) return template;
    if (typeof template !== 'string') return template;
    const { upstreamNodeId, nameToId } = options;

    return template.replace(MUSTACHE, (_, rawPath) => {
        let pathStr = String(rawPath).trim();

        if (pathStr.startsWith('$json')) {
            const v = resolveDollarJson(pathStr, context, upstreamNodeId);
            if (v === undefined || v === null) return '';
            if (typeof v === 'object') {
                try {
                    return JSON.stringify(v);
                } catch {
                    return '';
                }
            }
            return String(v);
        }

        if (pathStr.startsWith('=')) pathStr = pathStr.slice(1).trim();

        if (nameToId && !pathStr.includes('.') && context[pathStr]) {
            /* bare node name not supported as value */
        }

        const v = getByPath(context, pathStr);
        if (v === undefined || v === null) return '';
        if (typeof v === 'object') {
            try {
                return JSON.stringify(v);
            } catch {
                return '';
            }
        }
        return String(v);
    });
}

function resolveDeep(value, context, options = {}) {
    if (value == null) return value;
    if (typeof value === 'string') return resolveString(value, context, options);
    if (Array.isArray(value)) return value.map((v) => resolveDeep(v, context, options));
    if (typeof value === 'object') {
        const out = {};
        for (const k of Object.keys(value)) {
            out[k] = resolveDeep(value[k], context, options);
        }
        return out;
    }
    return value;
}

module.exports = {
    getByPath,
    resolveString,
    resolveDeep,
    resolveDollarJson
};
