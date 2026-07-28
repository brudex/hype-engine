const db = require('../../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { validateWorkflowDefinition, normalizeDefinition } = require('../../services/flow/flow-workflow-validation');
const flowService = require('../../services/flow');
const {
    entryTriggerMeta,
    findEntryPoint,
    secureTriggerConfig
} = require('../../services/flow/flow-definition.service');

const FlowWorkflowsController = {};

function flowActorUuid(req) {
    const u = req.user;
    return (
        req.flowUserUuid ||
        (u && (u.uuid || (typeof u.get === 'function' ? u.get('uuid') : null) || u.dataValues?.uuid)) ||
        null
    );
}

async function loadOwnedWorkflow(flowUuid, userUuid, options = {}) {
    return db.FlowWorkflow.findOne({
        where: { uuid: flowUuid, userUuid },
        ...options
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
        if (
            typeof cfg.webhookSecret !== 'string' ||
            cfg.webhookSecret.length < 32 ||
            cfg.webhookSecret !== secretPath
        ) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const payload = req.body && typeof req.body === 'object' ? req.body : { body: req.body };

        const event = await db.FlowTriggerEvent.create({
            uuid: uuidv4(),
            workflowUuid: workflow.uuid,
            runUuid: null,
            triggerType: 'webhook',
            payload,
            headers: {
                'content-type': req.get('content-type') || null,
                'user-agent': req.get('user-agent') || null,
                'x-request-id': req.get('x-request-id') || null
            },
            status: 'received',
            receivedAt: new Date()
        });

        const result = await flowService.executeFlow(workflow, {
            userUuid: workflow.userUuid,
            initialContext: payload,
            dryRun: false,
            triggerType: 'webhook'
        });

        await event.update({ runUuid: result.runId, status: 'processed' });

        return res.status(200).json({
            data: {
                eventId: event.uuid,
                runId: result.runId,
                status: result.status,
                nodes: result.nodes,
                context: result.nodes
            }
        });
    } catch (e) {
        logger.error('Flow webhook error:', e);
        return res.status(500).json({ success: false, message: e.message || 'Webhook failed' });
    }
};

/**
 * POST full definition for an existing flow: `POST /flows/save/:flowUuid`.
 * Appends an immutable FlowWorkflowVersion row on each save.
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

        const wf = await loadOwnedWorkflow(flowUuid, userUuid, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if (!wf) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const definition = v.definition || normalized;
        const entry = findEntryPoint(definition);
        const { triggerType, triggerConfig: rawTriggerConfig } = entry
            ? entryTriggerMeta(entry, definition)
            : { triggerType: wf.triggerType, triggerConfig: wf.triggerConfig || {} };
        const triggerConfig = secureTriggerConfig(
            triggerType,
            rawTriggerConfig,
            wf.triggerConfig || {}
        );

        const maxVersion = await db.FlowWorkflowVersion.max('versionNumber', {
            where: { workflowUuid: wf.uuid },
            transaction: t
        });
        const versionNumber = (maxVersion || 0) + 1;

        await db.FlowWorkflowVersion.create(
            {
                uuid: uuidv4(),
                workflowUuid: wf.uuid,
                versionNumber,
                name: normalized.name || wf.name,
                definition,
                createdBy: userUuid
            },
            { transaction: t }
        );

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
                description: nextDescription,
                triggerType,
                triggerConfig,
                definition
            },
            { transaction: t }
        );

        await t.commit();

        return res.json({
            data: {
                uuid: wf.uuid,
                versionNumber,
                definition
            }
        });
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
        const wf = await loadOwnedWorkflow(req.params.flowUuid, userUuid, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if (!wf) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const uuid = wf.uuid;
        await db.FlowRun.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowTriggerEvent.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowWorkflowVersion.destroy({ where: { workflowUuid: uuid }, transaction: t });
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

        const result = await flowService.executeFlow(wf, {
            userUuid,
            initialContext: context,
            dryRun,
            triggerType: typeof trigger === 'string' ? trigger : 'manual'
        });

        return res.json({
            data: {
                runId: result.runId,
                status: result.status,
                nodes: result.nodes,
                context: result.nodes
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
            }
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
