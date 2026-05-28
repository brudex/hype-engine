const vm = require('vm');
const { resolveDeep } = require('../flow-variable-resolver');

async function runJavascript(nodeDef, context, dryRun) {
    const config = resolveDeep(nodeDef.config || {}, context);
    let code = config.code || config.script || '';
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
        console,
        module: undefined,
        require: undefined
    };
    vm.createContext(sandbox);
    const wrapped = `"use strict";\n(function(input) {\n${code}\n})(input);`;
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
