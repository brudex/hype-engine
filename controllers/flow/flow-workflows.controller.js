const db = require('../../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { validateWorkflowDefinition, normalizeDefinition } = require('../../services/flow/flow-workflow-validation');
const { syncWorkflowGraph } = require('../../services/flow/flow-graph-sync.service');
const { runWorkflow } = require('../../services/flow/flow-executor.service');

const FlowWorkflowsController = {};

function flowActorUuid(req) {
    const u = req.user;
    return (
        req.flowUserUuid ||
        (u && (u.uuid || (typeof u.get === 'function' ? u.get('uuid') : null) || u.dataValues?.uuid)) ||
        null
    );
}

async function loadOwnedWorkflow(flowUuid, userUuid) {
    return db.FlowWorkflow.findOne({
        where: { uuid: flowUuid, userUuid }
    });
}

function stripSaveMetaFromBody(body) {
    if (!body || typeof body !== 'object') {
        return { defInput: {}, workflowUuid: '' };
    }
    const { workflowUuid: w, uuid: u, ...rest } = body;
    const workflowUuid =
        (typeof w === 'string' && w.trim()) || (typeof u === 'string' && u.trim()) || '';
    return { defInput: rest, workflowUuid };
}

FlowWorkflowsController.webhook = async (req, res) => {
    try {
        const { workflowUuid, secretPath } = req.params;
        const workflow = await db.FlowWorkflow.findOne({ where: { uuid: workflowUuid } });
        if (!workflow) {
            return res.status(404).json({ success: false, message: 'Workflow not found' });
        }
        const cfg = workflow.triggerConfig || {};
        if (cfg.webhookSecret && cfg.webhookSecret !== secretPath) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const triggerId = workflow.definition?.trigger?.id || 'trigger_1';
        const payload = req.body && typeof req.body === 'object' ? req.body : { body: req.body };

        const event = await db.FlowTriggerEvent.create({
            uuid: uuidv4(),
            workflowUuid: workflow.uuid,
            runUuid: null,
            triggerType: 'webhook',
            payload,
            headers: req.headers || {},
            status: 'received',
            receivedAt: new Date()
        });

        const initialContext = {
            [triggerId]: {
                status: 'success',
                output: { body: payload },
                meta: {},
                error: null
            }
        };

        const result = await runWorkflow(workflow, {
            userUuid: workflow.userUuid,
            initialContext,
            dryRun: false,
            triggerType: 'webhook'
        });

        await event.update({ runUuid: result.runId, status: 'processed' });

        return res.status(200).json({
            data: {
                eventId: event.uuid,
                runId: result.runId,
                status: result.status,
                context: result.context
            }
        });
    } catch (e) {
        logger.error('Flow webhook error:', e);
        return res.status(500).json({ success: false, message: e.message || 'Webhook failed' });
    }
};

/**
 * POST full definition for an existing flow: `POST /flows/save/:flowUuid`.
 * Create new flows via dashboard `POST /dashboard/api/flows` (or equivalent), then save here.
 */
FlowWorkflowsController.saveFlow = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userUuid = flowActorUuid(req);
        const flowUuid =
            req.params.flowUuid && String(req.params.flowUuid).trim()
                ? String(req.params.flowUuid).trim()
                : '';
        if (!flowUuid) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'flowUuid is required' });
        }

        const { defInput } = stripSaveMetaFromBody(req.body);
        const normalized = normalizeDefinition(defInput);
        const v = validateWorkflowDefinition(normalized);
        if (!v.ok) {
            await t.rollback();
            return res.status(400).json({ success: false, errors: v.errors });
        }

        const wf = await loadOwnedWorkflow(flowUuid, userUuid);
        if (!wf) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        let nextDescription;
        if (Object.prototype.hasOwnProperty.call(defInput, 'description')) {
            nextDescription =
                typeof defInput.description === 'string'
                    ? defInput.description.trim().slice(0, 5000) || null
                    : null;
        } else {
            nextDescription =
                wf.description != null ? String(wf.description).trim().slice(0, 5000) : null;
        }

        await wf.update(
            {
                name: normalized.name,
                description: nextDescription,
                version: normalized.version,
                triggerType: normalized.trigger?.type || wf.triggerType,
                triggerConfig: normalized.trigger?.config || {},
                definition: normalized
            },
            { transaction: t }
        );

        await syncWorkflowGraph(wf.uuid, normalized, t);
        await t.commit();

        const payload = {
            data: {
                uuid: wf.uuid,
                definition: wf.definition
            }
        };
        return res.json(payload);
    } catch (e) {
        await t.rollback();
        logger.error('Flow saveFlow error:', e);
        return res.status(500).json({ success: false, message: e.message || 'Save failed' });
    }
};

FlowWorkflowsController.get = async (req, res) => {
    try {
        const userUuid = flowActorUuid(req);
        const wf = await loadOwnedWorkflow(req.params.flowUuid, userUuid);
        if (!wf) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        return res.json({
            data: {
                uuid: wf.uuid,
                name: wf.name,
                description: wf.description || '',
                version: wf.version,
                triggerType: wf.triggerType,
                triggerConfig: wf.triggerConfig,
                status: wf.status,
                definition: wf.definition,
                updatedAt: wf.updatedAt
            }
        });
    } catch (e) {
        logger.error('Flow get error:', e);
        return res.status(500).json({ success: false, message: 'Failed to load workflow' });
    }
};

FlowWorkflowsController.delete = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userUuid = flowActorUuid(req);
        const wf = await loadOwnedWorkflow(req.params.flowUuid, userUuid);
        if (!wf) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const uuid = wf.uuid;
        await db.FlowRunNode.destroy({
            where: { workflowUuid: uuid },
            transaction: t
        });
        await db.FlowRun.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowTriggerEvent.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowNode.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await wf.destroy({ transaction: t });
        await t.commit();

        return res.json({ data: { deleted: true, uuid } });
    } catch (e) {
        await t.rollback();
        logger.error('Flow delete error:', e);
        return res.status(500).json({ success: false, message: 'Delete failed' });
    }
};

FlowWorkflowsController.run = async (req, res) => {
    try {
        const userUuid = flowActorUuid(req);
        const wf = await loadOwnedWorkflow(req.params.flowUuid, userUuid);
        if (!wf) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const trigger = req.body?.trigger || 'manual';
        const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
        const dryRun = !!req.body?.dryRun;

        const result = await runWorkflow(wf, {
            userUuid,
            initialContext: context,
            dryRun,
            triggerType: typeof trigger === 'string' ? trigger : 'manual'
        });

        return res.json({
            data: {
                runId: result.runId,
                status: result.status,
                context: result.context
            }
        });
    } catch (e) {
        logger.error('Flow run error:', e);
        return res.status(500).json({ success: false, message: e.message || 'Run failed' });
    }
};

FlowWorkflowsController.listRuns = async (req, res) => {
    try {
        const userUuid = flowActorUuid(req);
        const wf = await loadOwnedWorkflow(req.params.flowUuid, userUuid);
        if (!wf) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const runs = await db.FlowRun.findAll({
            where: { workflowUuid: wf.uuid, userUuid },
            order: [['startedAt', 'DESC']],
            limit: 100,
            attributes: [
                'uuid',
                'status',
                'triggerType',
                'startedAt',
                'finishedAt',
                'createdAt'
            ]
        });

        return res.json({ data: runs });
    } catch (e) {
        logger.error('Flow listRuns error:', e);
        return res.status(500).json({ success: false, message: 'Failed to list runs' });
    }
};

FlowWorkflowsController.getRun = async (req, res) => {
    try {
        const userUuid = flowActorUuid(req);
        const wf = await loadOwnedWorkflow(req.params.flowUuid, userUuid);
        if (!wf) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const run = await db.FlowRun.findOne({
            where: {
                uuid: req.params.runUuid,
                workflowUuid: wf.uuid,
                userUuid
            },
            include: [
                {
                    model: db.FlowRunNode,
                    as: 'runNodes',
                    required: false
                }
            ]
        });

        if (!run) {
            return res.status(404).json({ success: false, message: 'Run not found' });
        }

        return res.json({ data: run });
    } catch (e) {
        logger.error('Flow getRun error:', e);
        return res.status(500).json({ success: false, message: 'Failed to load run' });
    }
};

module.exports = FlowWorkflowsController;
