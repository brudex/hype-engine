const validateApiV1Token = require('./api-v1.auth.middleware');

/**
 * Resolve authenticated user UUID for Flow API handlers.
 * Sets req.flowUserUuid for controllers (avoid relying on req.user shape alone).
 */
function attachFlowUser(req, res, next) {
    const u = req.user;
    const uuid =
        req.flowUserUuid ||
        (u && (u.uuid || (typeof u.get === 'function' ? u.get('uuid') : null) || u.dataValues?.uuid)) ||
        null;

    if (!uuid || typeof uuid !== 'string') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message:
                'Missing user identity. Send Authorization: Bearer <api_token> or call from the dashboard with an active session.'
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
 * Flow API: accept a Bearer API token or a Passport-authenticated session.
 * Always ends by setting req.flowUserUuid before the route runs.
 */
function flowApiAuth(req, res, next) {
    const continueAfterAuth = () => attachFlowUser(req, res, next);

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return validateApiV1Token(req, res, continueAfterAuth);
    }
    if (
        typeof req.isAuthenticated === 'function' &&
        req.isAuthenticated() &&
        req.user &&
        (req.user.uuid ||
            (typeof req.user.get === 'function' ? req.user.get('uuid') : null) ||
            req.user.dataValues?.uuid)
    ) {
        req.flowAuthViaSession = true;
        return continueAfterAuth();
    }
    return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'A valid Bearer token or authenticated session is required.'
    });
}

module.exports = flowApiAuth;
