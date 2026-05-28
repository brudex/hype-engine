const { resolveDeep } = require('../flow-variable-resolver');

async function runInput(nodeDef, context, dryRun) {
    const config = resolveDeep(nodeDef.config || {}, context);
    const format = config.format || 'json';
    let value = config.value;
    if (format === 'json' && typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch {
            value = {};
        }
    }
    return {
        output: { value: value != null ? value : {}, format },
        meta: {}
    };
}

module.exports = { runInput };
