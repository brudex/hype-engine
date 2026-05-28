const vm = require('vm');
const { resolveString } = require('../flow-variable-resolver');

function stripOuterMustache(expr) {
    if (expr == null) return '';
    let s = String(expr).trim();
    if (s.startsWith('{{') && s.endsWith('}}')) {
        s = s.slice(2, -2).trim();
    }
    return s;
}

function evalInContext(expression, context) {
    const inner = stripOuterMustache(expression);
    if (!inner) return false;
    const sandbox = { ...context };
    vm.createContext(sandbox);
    const code = `"use strict";\n(() => (${inner}))()`;
    try {
        return Boolean(vm.runInContext(code, sandbox, { timeout: 500 }));
    } catch {
        return false;
    }
}

function evalResolvedComparison(expr, context) {
    const resolved = resolveString(expr, context);
    const s = String(resolved).trim();
    if (!s) return false;
    if (s === 'true') return true;
    if (s === 'false') return false;
    try {
        return Boolean(vm.runInNewContext(`"use strict"; (() => (${s}))()`, {}, { timeout: 500 }));
    } catch {
        return Boolean(s);
    }
}

async function runLogic(nodeDef, context, dryRun) {
    const conditions = nodeDef.config?.conditions;
    if (!Array.isArray(conditions) || conditions.length === 0) {
        return {
            output: { matched: false, conditionId: null },
            meta: {},
            selectedOutput: null
        };
    }

    for (const c of conditions) {
        if (!c || !c.id) continue;
        const expr = c.expression || '';
        let ok;
        if (expr.includes('{{')) {
            ok = evalResolvedComparison(expr, context);
        } else {
            ok = evalInContext(expr, context);
        }
        if (ok) {
            return {
                output: { matched: true, conditionId: c.id },
                meta: { label: c.label },
                selectedOutput: c.id
            };
        }
    }

    return {
        output: { matched: false, conditionId: null },
        meta: {},
        selectedOutput: null
    };
}

module.exports = { runLogic, evalInContext };
