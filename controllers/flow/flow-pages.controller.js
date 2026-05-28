const db = require('../../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const { validateWorkflowDefinition, normalizeDefinition } = require('../../services/flow/flow-workflow-validation');
const { syncWorkflowGraph } = require('../../services/flow/flow-graph-sync.service');

const FlowPagesController = {};

function emptyDefinition(name) {
    return normalizeDefinition({
        id: `flow_${uuidv4().replace(/-/g, '').slice(0, 12)}`,
        name,
        version: '1.0.0',
        trigger: {
            id: 'trigger_1',
            type: 'manual',
            name: 'Manual Trigger',
            config: {},
            outputSchema: { body: 'object' }
        },
        nodes: [],
        edges: []
    });
}

async function formatFlowsForUser(userUuid) {
    const rows = await db.FlowWorkflow.findAll({
        where: { userUuid },
        order: [['updatedAt', 'DESC']],
        attributes: [
            'uuid',
            'name',
            'description',
            'version',
            'triggerType',
            'status',
            'createdAt',
            'updatedAt'
        ]
    });
    return rows.map((f) => ({
        uuid: f.uuid,
        name: f.name,
        description: f.description || '',
        version: f.version,
        triggerType: f.triggerType,
        status: f.status,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt
    }));
}

FlowPagesController.index = async (req, res) => {
    try {
        if (!req.user || !req.user.uuid) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/dashboard');
        }
        res.render('dashboard/flows/index', {
            currentPage: 'flows',
            layout: 'layouts/dashboard/index',
            script: ''
        });
    } catch (e) {
        logger.error('Flow pages index:', e);
        req.flash('error', 'Could not load flows');
        res.redirect('/dashboard');
    }
};

FlowPagesController.apiList = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const data = await formatFlowsForUser(userUuid);
        return res.json({ success: true, data });
    } catch (e) {
        logger.error('Flow apiList:', e);
        return res.status(500).json({ success: false, message: 'Failed to list flows' });
    }
};

FlowPagesController.apiCreate = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userUuid = req.user.uuid;
        const name = (req.body && req.body.name ? String(req.body.name) : 'Untitled flow').trim();
        if (!name) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const description =
            req.body && req.body.description != null
                ? String(req.body.description).trim().slice(0, 5000)
                : '';

        const definition = emptyDefinition(name);
        const v = validateWorkflowDefinition(definition);
        if (!v.ok) {
            await t.rollback();
            return res.status(400).json({ success: false, message: v.errors.join('; ') });
        }

        const wf = await db.FlowWorkflow.create(
            {
                uuid: uuidv4(),
                userUuid,
                name: definition.name,
                description: description || null,
                version: definition.version,
                triggerType: definition.trigger.type,
                triggerConfig: definition.trigger.config || {},
                definition,
                status: 0
            },
            { transaction: t }
        );

        await syncWorkflowGraph(wf.uuid, definition, t);
        await t.commit();

        return res.status(201).json({
            success: true,
            data: {
                uuid: wf.uuid,
                name: wf.name,
                description: wf.description || '',
                version: wf.version,
                triggerType: wf.triggerType,
                status: wf.status
            }
        });
    } catch (e) {
        await t.rollback();
        logger.error('Flow apiCreate:', e);
        return res.status(500).json({ success: false, message: e.message || 'Could not create flow' });
    }
};

FlowPagesController.apiUpdate = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const wf = await db.FlowWorkflow.findOne({
            where: { uuid: req.params.flowUuid, userUuid: req.user.uuid },
            transaction: t
        });
        if (!wf) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Flow not found' });
        }

        const name =
            req.body && req.body.name != null
                ? String(req.body.name).trim()
                : wf.name;
        if (!name) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const status =
            req.body && req.body.status != null ? parseInt(req.body.status, 10) : wf.status;
        const description =
            req.body && req.body.description != null
                ? String(req.body.description).trim().slice(0, 5000)
                : wf.description != null
                  ? String(wf.description).trim().slice(0, 5000)
                  : '';

        const def = { ...wf.definition, name };
        const normalized = normalizeDefinition(def);
        const v = validateWorkflowDefinition(normalized);
        if (!v.ok) {
            await t.rollback();
            return res.status(400).json({ success: false, message: v.errors.join('; ') });
        }

        await wf.update(
            {
                name,
                description: description || null,
                status: Number.isNaN(status) ? wf.status : status,
                definition: normalized
            },
            { transaction: t }
        );
        await syncWorkflowGraph(wf.uuid, normalized, t);
        await t.commit();

        return res.json({
            success: true,
            data: {
                uuid: wf.uuid,
                name: wf.name,
                description: wf.description || '',
                version: wf.version,
                triggerType: wf.triggerType,
                status: wf.status
            }
        });
    } catch (e) {
        await t.rollback();
        logger.error('Flow apiUpdate:', e);
        return res.status(500).json({ success: false, message: 'Update failed' });
    }
};

FlowPagesController.apiDelete = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const wf = await db.FlowWorkflow.findOne({
            where: { uuid: req.params.flowUuid, userUuid: req.user.uuid },
            transaction: t
        });
        if (!wf) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Flow not found' });
        }

        const uuid = wf.uuid;
        await db.FlowRunNode.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowRun.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowTriggerEvent.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await db.FlowNode.destroy({ where: { workflowUuid: uuid }, transaction: t });
        await wf.destroy({ transaction: t });
        await t.commit();

        return res.json({ success: true, data: { deleted: true, uuid } });
    } catch (e) {
        await t.rollback();
        logger.error('Flow apiDelete:', e);
        return res.status(500).json({ success: false, message: 'Delete failed' });
    }
};

FlowPagesController.design = async (req, res) => {
    try {
        const wf = await db.FlowWorkflow.findOne({
            where: { uuid: req.params.flowUuid, userUuid: req.user.uuid }
        });
        if (!wf) {
            req.flash('error', 'Flow not found');
            return res.redirect('/dashboard/flows');
        }
        const userUuid =
            req.user?.uuid ||
            (typeof req.user?.get === 'function' ? req.user.get('uuid') : null) ||
            req.user?.dataValues?.uuid ||
            '';
        const apiFlowBaseUrl = `${req.protocol}://${req.get('host')}/api/flow`;

        res.render('dashboard/flows/design', {
            layout: false,
            flow: wf,
            userUuid,
            apiFlowBaseUrl
        });
    } catch (e) {
        logger.error('Flow pages design:', e);
        req.flash('error', 'Could not open designer');
        res.redirect('/dashboard/flows');
    }
};

module.exports = FlowPagesController;
