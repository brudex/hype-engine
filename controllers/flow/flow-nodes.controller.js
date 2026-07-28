const logger = require('../../utils/logger');
const flowService = require('../../services/flow');

const FlowNodesController = {};

function flowActorUuid(req) {
    const u = req.user;
    return (
        req.flowUserUuid ||
        (u && (u.uuid || (typeof u.get === 'function' ? u.get('uuid') : null) || u.dataValues?.uuid)) ||
        null
    );
}

function parseExecuteBody(body) {
    if (!body || typeof body !== 'object') {
        return { node: null, context: {}, dryRun: false, upstreamNodeId: null };
    }
    const hasEnvelope = body.node && typeof body.node === 'object';
    return {
        node: hasEnvelope ? body.node : body,
        context: body.context && typeof body.context === 'object' ? body.context : {},
        dryRun: !!body.dryRun,
        upstreamNodeId: typeof body.upstreamNodeId === 'string' ? body.upstreamNodeId : null
    };
}

/**
 * POST /nodes/execute — run one node (full n8n-style or canonical node in body).
 * Body: { node, context?, dryRun?, upstreamNodeId? } or the node object directly.
 */
FlowNodesController.execute = async (req, res) => {
    try {
        const userUuid = flowActorUuid(req);
        const { node, context, dryRun, upstreamNodeId } = parseExecuteBody(req.body);

        if (!node || typeof node !== 'object') {
            return res.status(400).json({ success: false, message: 'Request body must include a node object' });
        }

        const data = await flowService.executeNode(
            { node, context, upstreamNodeId },
            { userUuid, dryRun, context, upstreamNodeId }
        );

        const httpStatus = data.status === 'error' ? 422 : 200;
        return res.status(httpStatus).json({ success: data.status !== 'error', data });
    } catch (e) {
        if (e.statusCode === 400) {
            return res.status(400).json({ success: false, message: e.message });
        }
        logger.error('Flow node execute error:', e);
        return res.status(500).json({ success: false, message: e.message || 'Node execution failed' });
    }
};

/**
 * POST /nodes/:nodeType — same as execute; nodeType is optional hint (e.g. ai-prompt, http-request).
 */
FlowNodesController.executeByType = async (req, res) => {
    req.body = req.body && typeof req.body === 'object' ? req.body : {};
    return FlowNodesController.execute(req, res);
};

module.exports = FlowNodesController;
