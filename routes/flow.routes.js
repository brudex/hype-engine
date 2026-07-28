const express = require('express');
const router = express.Router();
const flowApiAuth = require('../middlewares/flow-api.auth.middleware');
const FlowWorkflowsController = require('../controllers/flow/flow-workflows.controller');
const FlowNodesController = require('../controllers/flow/flow-nodes.controller');

router.post('/webhooks/:workflowUuid/:secretPath?', FlowWorkflowsController.webhook);

router.use(flowApiAuth);

router.post('/nodes/execute', FlowNodesController.execute);
router.post('/nodes/:nodeType', FlowNodesController.executeByType);

router.post('/flows/save/:flowUuid', FlowWorkflowsController.saveFlow);
router.get('/flows/:flowUuid', FlowWorkflowsController.get);
router.delete('/flows/:flowUuid', FlowWorkflowsController.delete);

router.post('/flows/:flowUuid/run', FlowWorkflowsController.run);
router.get('/flows/:flowUuid/runs', FlowWorkflowsController.listRuns);
router.get('/flows/:flowUuid/runs/:runUuid', FlowWorkflowsController.getRun);

module.exports = router;
