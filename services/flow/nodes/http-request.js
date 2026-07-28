const axios = require('axios');
const { resolveDeep } = require('../flow-variable-resolver');

function resolveConfig(nodeDef, context) {
    return resolveDeep(nodeDef.config || {}, context, nodeDef._resolveOptions || {});
}

async function runHttpRequest(nodeDef, context, dryRun) {
    const config = resolveConfig(nodeDef, context);
    const method = (config.method || 'GET').toUpperCase();
    const url = config.url;
    const headers = config.headers && typeof config.headers === 'object' ? config.headers : {};
    const body = config.body != null ? config.body : config.jsonBody;
    const timeout = Math.min(parseInt(config.timeout, 10) || 10000, 120000);
    const started = Date.now();

    if (!url || typeof url !== 'string') {
        throw new Error('http_request/rest: url is required');
    }

    if (dryRun) {
        return {
            output: { dryRun: true, method, url },
            meta: { statusCode: null, headers: {}, durationMs: 0 }
        };
    }

    try {
        const res = await axios({
            method,
            url,
            headers,
            data: body,
            timeout,
            validateStatus: () => true
        });
        const durationMs = Date.now() - started;
        let data = res.data;
        if (typeof data === 'string' && data.trim().startsWith('{')) {
            try {
                data = JSON.parse(data);
            } catch {
                /* keep string */
            }
        }
        if (res.status >= 400) {
            const err = new Error(`HTTP ${res.status}`);
            err.meta = { statusCode: res.status, headers: res.headers || {}, durationMs };
            err.responseBody = data;
            throw err;
        }
        return {
            output: data,
            meta: {
                statusCode: res.status,
                headers: res.headers || {},
                durationMs
            }
        };
    } catch (err) {
        const durationMs = Date.now() - started;
        const message = err.message || String(err);
        const e = new Error(message);
        e.meta = { statusCode: err.response?.status, headers: err.response?.headers || {}, durationMs };
        throw e;
    }
}

module.exports = { runHttpRequest };
