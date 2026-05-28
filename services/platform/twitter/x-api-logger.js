const logger = require('../../../utils/logger');

/**
 * Log to console (PM2 stdout) and winston/logger (files + DB).
 * @param {'info'|'warn'|'error'} level
 * @param {string} message
 * @param {Record<string, unknown>} [meta]
 */
function logX(level, message, meta) {
    const payload = meta && Object.keys(meta).length > 0 ? meta : undefined;
    const consoleText = payload ? `${message} ${JSON.stringify(payload, null, 2)}` : message;
    const prefix = '[X API]';

    if (level === 'error') {
        console.error(prefix, consoleText);
        logger.error(message, payload || {});
    } else if (level === 'warn') {
        console.warn(prefix, consoleText);
        logger.warn(message, payload || {});
    } else {
        console.log(prefix, consoleText);
        logger.info(message, payload || {});
    }
}

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function safeSerialize(value) {
    if (value === undefined) {
        return undefined;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return String(value);
    }
}

/**
 * @param {Error & { code?: number, data?: unknown, errors?: unknown, rateLimit?: unknown, headers?: unknown }} error
 */
function serializeTwitterApiError(error) {
    if (!error) {
        return { message: 'Unknown error' };
    }
    const hasApiShape = error.data !== undefined || (typeof error.code === 'number' && error.code >= 400);
    if (!hasApiShape) {
        return {
            message: error.message || String(error)
        };
    }
    return {
        message: error.message,
        code: error.code,
        httpStatus: error.code,
        responseJson: safeSerialize(error.data),
        errors: safeSerialize(error.errors),
        rateLimit: safeSerialize(error.rateLimit),
        headers: error.headers ? safeSerialize(error.headers) : undefined
    };
}

/**
 * @param {import('twitter-api-v2').types/plugins').ITwitterApiBeforeRequestHookArgs} args
 */
function summarizeRequestPayload(args) {
    const body = args.computedParams?.body;
    if (body == null) {
        return args.computedParams?.query
            ? safeSerialize(args.computedParams.query)
            : null;
    }
    if (Buffer.isBuffer(body)) {
        return { _type: 'buffer', byteLength: body.length };
    }
    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch {
            return body.length > 4000 ? body.slice(0, 4000) + '…[truncated]' : body;
        }
    }
    return safeSerialize(body);
}

/**
 * @param {import('twitter-api-v2').types/plugins').ITwitterApiBeforeRequestHookArgs} args
 */
function buildEndpointLabel(args) {
    const method = (args.computedParams?.method || args.params?.method || 'GET').toUpperCase();
    const href = args.url?.href || String(args.url);
    return `${method} ${href}`;
}

/**
 * twitter-api-v2 plugin: logs endpoint, request payload, and response JSON for every X call.
 * @param {{ accountUuid?: string, postUuid?: string }} [context]
 */
function createXApiLoggerPlugin(context = {}) {
    const ctx = {
        accountUuid: context.accountUuid || null,
        postUuid: context.postUuid || null
    };

    function baseMeta(args) {
        return {
            accountUuid: ctx.accountUuid,
            postUuid: ctx.postUuid,
            endpoint: buildEndpointLabel(args),
            requestPayload: summarizeRequestPayload(args)
        };
    }

    return {
        onAfterRequest(args) {
            logX('info', 'X API call succeeded', {
                ...baseMeta(args),
                httpStatus: args.response?.code,
                responseJson: safeSerialize(args.response?.data)
            });
        },
        onResponseError(args) {
            logX('error', 'X API call failed', {
                ...baseMeta(args),
                ...serializeTwitterApiError(args.error)
            });
        },
        onRequestError(args) {
            logX('error', 'X API request error (network/parse)', {
                ...baseMeta(args),
                errorMessage: args.error?.message || String(args.error)
            });
        }
    };
}

module.exports = {
    createXApiLoggerPlugin,
    serializeTwitterApiError,
    safeSerialize,
    logX
};
