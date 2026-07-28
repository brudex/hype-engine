const { resolveString } = require('../flow-variable-resolver');

function stripEqualsPrefix(value) {
    if (value == null) return '';
    let s = String(value).trim();
    if (s.startsWith('=')) s = s.slice(1).trim();
    return s;
}

function evaluateOperator(left, right, operator) {
    const opType = operator?.type || 'string';
    const operation = operator?.operation || 'equals';
    const l = stripEqualsPrefix(left);
    const r = stripEqualsPrefix(right);

    if (opType === 'number') {
        const ln = parseFloat(l);
        const rn = parseFloat(r);
        switch (operation) {
            case 'gt':
                return ln > rn;
            case 'gte':
                return ln >= rn;
            case 'lt':
                return ln < rn;
            case 'lte':
                return ln <= rn;
            case 'equals':
            default:
                return ln === rn;
        }
    }

    switch (operation) {
        case 'contains':
            return l.includes(r);
        case 'notEquals':
            return l !== r;
        case 'equals':
        default:
            return l === r;
    }
}

function evaluateConditionGroup(group, context, resolveOpts) {
    if (!group || !group.conditions) return false;
    const conditions = group.conditions.conditions;
    if (!Array.isArray(conditions) || conditions.length === 0) return false;

    const combinator = (group.conditions.combinator || 'and').toLowerCase();
    const results = conditions.map((c) => {
        const left = resolveString(c.leftValue || '', context, resolveOpts);
        const right = resolveString(c.rightValue || '', context, resolveOpts);
        return evaluateOperator(left, right, c.operator || {});
    });

    if (combinator === 'or') return results.some(Boolean);
    return results.every(Boolean);
}

async function runLogic(nodeDef, context, dryRun) {
    const resolveOpts = nodeDef._resolveOptions || {};
    const values = nodeDef.config?.rules?.values || nodeDef.parameters?.rules?.values;
    if (!Array.isArray(values) || values.length === 0) {
        return {
            output: { matched: false },
            meta: {},
            selectedOutput: null
        };
    }

    for (let i = 0; i < values.length; i++) {
        const rule = values[i];
        if (evaluateConditionGroup(rule, context, resolveOpts)) {
            return {
                output: { matched: true, branchIndex: i },
                meta: { label: rule?.conditions?.conditions?.[0]?.rightValue || `branch_${i}` },
                selectedOutput: i
            };
        }
    }

    return {
        output: { matched: false },
        meta: {},
        selectedOutput: null
    };
}

module.exports = { runLogic };
