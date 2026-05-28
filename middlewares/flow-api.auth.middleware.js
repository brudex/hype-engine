const validateApiV1Token = require('./api-v1.auth.middleware');

function readXUserId(req) {
    const h = req.headers['x-user-id'];
    if (typeof h === 'string') return h.trim();
    if (Array.isArray(h) && h.length > 0) return String(h[0]).trim();
    return '';
}

/**
 * Resolve authenticated user UUID for Flow API handlers.
 * Sets req.flowUserUuid for controllers (avoid relying on req.user shape alone).
 */
function attachFlowUser(req, res, next) {
    const headerUuid = readXUserId(req);
    const u = req.user;
    const uuid =
        headerUuid ||
        req.flowUserUuid ||
        (u && (u.uuid || (typeof u.get === 'function' ? u.get('uuid') : null) || u.dataValues?.uuid)) ||
        null;

    if (!uuid || typeof uuid !== 'string') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message:
                'Missing user identity. Send X-User-Id: <uuid>, Authorization: Bearer <api_token>, or call from the dashboard with an active session (cookies).'
        });
    }

    req.flowUserUuid = uuid;
    if (!req.user) {
        req.user = { uuid };
    } else if (!req.user.uuid) {
        req.user.uuid = uuid;
    }

    next();
}

/**
 * Flow API: accept X-User-Id, Bearer API token (same as v1), or req.user with a uuid (session/dev).
 * Always ends by setting req.flowUserUuid before the route runs.
 */
function flowApiAuth(req, res, next) {
    const continueAfterAuth = () => attachFlowUser(req, res, next);

    const fromHeader = readXUserId(req);
    if (fromHeader) {
        req.flowUserUuid = fromHeader;
        return continueAfterAuth();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return validateApiV1Token(req, res, continueAfterAuth);
    }
    // Local dev: trust req.user when it carries uuid without requiring Passport isAuthenticated().
    if (
        req.user &&
        (req.user.uuid ||
            (typeof req.user.get === 'function' ? req.user.get('uuid') : null) ||
            req.user.dataValues?.uuid)
    ) {
        req.flowAuthViaSession = true;
        return continueAfterAuth();
    }
    return validateApiV1Token(req, res, continueAfterAuth);
}

module.exports = flowApiAuth;
