const vm = require('vm');
const { resolveDeep } = require('../flow-variable-resolver');

async function runJavascript(nodeDef, context, dryRun) {
    const resolveOpts = nodeDef._resolveOptions || {};
    const config = resolveDeep(nodeDef.config || {}, context, resolveOpts);
    let code = config.jsCode || config.code || config.script || '';
    if (typeof code !== 'string') code = String(code);

    if (dryRun) {
        return {
            output: { dryRun: true },
            meta: {}
        };
    }

    const timeout = Math.min(parseInt(config.timeout, 10) || 5000, 30000);
    const sandbox = {
        input: context,
        $input: {
            all: () => {
                const upstreamId = resolveOpts.upstreamNodeId;
                const out = upstreamId && context[upstreamId]?.output;
                return out != null ? [{ json: out }] : [];
            },
            first: () => {
                const items = sandbox.$input.all();
                return items[0] || { json: {} };
            }
        },
        console,
        module: undefined,
        require: undefined
    };
    vm.createContext(sandbox);
    const wrapped = `"use strict";\n(function(input, $input) {\n${code}\n})(input, $input);`;
    let result;
    try {
        result = vm.runInContext(wrapped, sandbox, { timeout });
    } catch (e) {
        const err = new Error(e.message || String(e));
        err.cause = e;
        throw err;
    }
    return {
        output: result != null && typeof result === 'object' ? result : { value: result },
        meta: {}
    };
}

module.exports = { runJavascript };
