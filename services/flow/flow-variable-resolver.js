/**
 * Resolve {{ path.to.value }} against wrapped flow context.
 * Missing paths -> empty string. Supports bracket segments like topics[0].name
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
            parts.push({ type: 'index', value: Number.isNaN(n) ? idx : n });
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
        if (p.type === 'key') {
            current = current[p.value];
        } else {
            current = current[p.value];
        }
    }
    return current;
}

const MUSTACHE = /\{\{\s*([^}]+?)\s*\}\}/g;

function resolveString(template, context) {
    if (template == null) return template;
    if (typeof template !== 'string') return template;
    return template.replace(MUSTACHE, (_, rawPath) => {
        const pathStr = String(rawPath).trim();
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

function resolveDeep(value, context) {
    if (value == null) return value;
    if (typeof value === 'string') return resolveString(value, context);
    if (Array.isArray(value)) return value.map((v) => resolveDeep(v, context));
    if (typeof value === 'object') {
        const out = {};
        for (const k of Object.keys(value)) {
            out[k] = resolveDeep(value[k], context);
        }
        return out;
    }
    return value;
}

module.exports = {
    getByPath,
    resolveString,
    resolveDeep
};
