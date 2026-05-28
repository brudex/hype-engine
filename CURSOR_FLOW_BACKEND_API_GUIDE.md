# Cursor Guide: Social Flow Builder Backend API

Target project:

```txt
/Users/brudex/developer/QuizeFactor/VibeSocial/mixpost/mixpost-node-better
```

This document describes the backend API and persistence layer Cursor should build into that existing Express/Sequelize project.

## Existing Project Shape

The target project is an Express app with:

- Sequelize models in `models/*.js`, auto-loaded by `models/index.js`
- Existing API v1 routes in `routes/api-v1.routes.js`
- Existing API v1 auth middleware in `middlewares/api-v1.auth.middleware.js`
- New Social Flow routes should live in `routes/flow.routes.js` and be mounted at `/api/flow`
- Existing project-scoped routes shaped like `/:projectUuid/posts`, but Social Flow workflows must be user-owned and project-agnostic.
- Existing social publishing services under `services/mixpost/*`

Follow the existing CommonJS style.

## Naming Requirements

All Social Flow Builder models must be prefixed with `Flow`.

Recommended model files and Sequelize model names:

```txt
models/flow-workflow.js       -> FlowWorkflow
models/flow-node.js           -> FlowNode
models/flow-edge.js           -> FlowEdge
models/flow-run.js            -> FlowRun
models/flow-run-node.js       -> FlowRunNode
models/flow-trigger-event.js  -> FlowTriggerEvent
```

Recommended table names:

```txt
flow_workflows
flow_nodes
flow_edges
flow_runs
flow_run_nodes
flow_trigger_events
```

Use `uuid` as the public identifier, matching the existing project convention.

## Canonical Workflow Definition JSON

Persist workflows in this shape. The frontend will submit this exact contract from `flow.flowPayload`.

```json
{
  "id": "draft-flow",
  "name": "Daily Social Pulse",
  "version": "1.0.0",
  "trigger": {
    "id": "trigger_1",
    "type": "manual",
    "name": "Manual Trigger",
    "config": {},
    "outputSchema": {
      "body": "object"
    }
  },
  "nodes": [
    {
      "id": "fetch_trends",
      "type": "rest",
      "name": "REST",
      "position": { "x": 80, "y": 90 },
      "disabled": false,
      "config": {},
      "outputs": {
        "success": {},
        "error": {}
      }
    }
  ],
  "edges": [
    {
      "from": "fetch_trends",
      "fromOutput": "success",
      "to": "write_caption"
    }
  ]
}
```

## Supported Node Types

Frontend node type to backend workflow type mapping:

```txt
input         -> input
http_request  -> http_request
rest_api      -> rest
prompt        -> ai_prompt
javascript    -> javascript
post          -> publish
condition     -> logic
```

Backend should use the canonical workflow `type` values.

## Runtime Context Contract

Runtime context must wrap every node output consistently:

```json
{
  "node_id": {
    "status": "success",
    "output": {},
    "meta": {
      "startedAt": "2026-05-03T01:17:32.465Z",
      "finishedAt": "2026-05-03T01:17:35.221Z",
      "durationMs": 421
    },
    "error": null
  }
}
```

Use these variable paths:

```txt
node_id.status
node_id.output
node_id.meta
node_id.error
```

Examples:

```txt
{{fetch_trends.output.topics[0].name}}
{{write_caption.output.text}}
{{write_caption.meta.tokensUsed}}
{{format_output.output.caption}}
{{trigger.output.body.productId}}
```

## Model Responsibilities

### FlowWorkflow

Stores workflow-level metadata and optionally the full canonical JSON.

Recommended fields:

```txt
uuid STRING(36), unique, not null
userUuid STRING(36), not null
name STRING, not null
version STRING, default "1.0.0"
triggerType STRING, default "manual"
triggerConfig JSONB, default {}
definition JSONB, not null
status INTEGER, default 1  // 0=draft, 1=active, 2=paused, 3=archived
```

Associations:

```txt
FlowWorkflow belongsTo User by userUuid -> User.uuid
FlowWorkflow hasMany FlowNode by workflowUuid -> FlowWorkflow.uuid
FlowWorkflow hasMany FlowEdge by workflowUuid -> FlowWorkflow.uuid
FlowWorkflow hasMany FlowRun by workflowUuid -> FlowWorkflow.uuid
```

### FlowNode

Stores one node from the workflow definition.

Recommended fields:

```txt
uuid STRING(36), unique, not null
workflowUuid STRING(36), not null
nodeId STRING, not null
type STRING, not null
name STRING, not null
position JSONB, default {}
config JSONB, default {}
outputs JSONB, default {}
disabled BOOLEAN, default false
```

Unique index:

```txt
workflowUuid + nodeId
```

### FlowEdge

Stores graph connections.

Recommended fields:

```txt
uuid STRING(36), unique, not null
workflowUuid STRING(36), not null
fromNodeId STRING, not null
fromOutput STRING, default "success"
toNodeId STRING, not null
```

For Logic nodes, `fromOutput` is the condition id, for example `condition_1` or `has_topics`.

### FlowRun

Stores each workflow execution.

Recommended fields:

```txt
uuid STRING(36), unique, not null
workflowUuid STRING(36), not null
userUuid STRING(36), not null
triggerType STRING, default "manual"
status STRING, not null // running, success, partial_failure, failed
startedAt DATE, not null
finishedAt DATE, nullable
initialContext JSONB, default {}
contextSnapshot JSONB, default {}
error JSONB, nullable
```

### FlowRunNode

Stores per-node execution traces.

Recommended fields:

```txt
uuid STRING(36), unique, not null
runUuid STRING(36), not null
workflowUuid STRING(36), not null
nodeId STRING, not null
status STRING, not null // running, success, skipped, error
selectedOutput STRING, nullable
inputContext JSONB, default {}
output JSONB, default {}
meta JSONB, default {}
error JSONB, nullable
startedAt DATE, not null
finishedAt DATE, nullable
durationMs INTEGER, default 0
```

### FlowTriggerEvent

Stores incoming webhook/manual/schedule trigger payloads.

Recommended fields:

```txt
uuid STRING(36), unique, not null
workflowUuid STRING(36), not null
runUuid STRING(36), nullable
triggerType STRING, not null
payload JSONB, default {}
headers JSONB, default {}
status STRING, default "received"
receivedAt DATE, not null
```

## Ownership Model

Flows are user-owned, not project-owned. A workflow created by a user can be opened and referenced from any project context later. Do not require `projectUuid` in Flow workflow API routes or workflow rows.

Rules:

- On create, set `FlowWorkflow.userUuid = req.user.uuid`.
- On list/get/update/delete/run, scope queries by `userUuid = req.user.uuid`.
- Do not store `projectUuid` on `FlowWorkflow`.
- `FlowRun` should also store `userUuid`. If a run is launched from a project-specific surface later, optional project context can live in `initialContext.trigger.output.body.projectUuid`, not on the workflow itself.

## Flow Management Pages

Cursor should create server-rendered dashboard pages for managing flows. These are UI pages, separate from the JSON API.

Recommended controller:

```txt
controllers/flow/flow-pages.controller.js
```

Recommended routes mounted under dashboard/authenticated middleware, not API token middleware:

```js
router.get('/dashboard/flows', FlowPagesController.index);
router.get('/dashboard/flows/create', FlowPagesController.create);
router.post('/dashboard/flows', FlowPagesController.store);
router.get('/dashboard/flows/:flowUuid/edit', FlowPagesController.edit);
router.post('/dashboard/flows/:flowUuid', FlowPagesController.update);
router.post('/dashboard/flows/:flowUuid/delete', FlowPagesController.delete);
router.get('/dashboard/flows/:flowUuid/design', FlowPagesController.design);
```

Required pages:

- Flow index page: list flows owned by the logged-in user.
- Create page/action: create a user-owned flow.
- Update/edit page/action: edit name/status/basic metadata.
- Delete action: delete/archive a flow after confirmation.
- Design page: loads the Social Flow Builder Vue canvas for a specific flow UUID.

Design page behavior:

- Route: `GET /dashboard/flows/:flowUuid/design`.
- Verify the flow belongs to `req.user.uuid`.
- Render an Express/EJS page with the Vue bundle after `npm run build:lib` is copied into public assets.
- Mount the builder with `flowId: flow.uuid` and `apiBaseUrl: '/api/flow'`.
- When the canvas loads, it should call `GET /api/flow/workflows/:flowUuid` and populate nodes/edges for editing.
- Saving from the canvas should call `PUT /api/flow/workflows/:flowUuid`.

Example design page mount snippet:

```html
<link rel="stylesheet" href="/modules/flow-builder/flow-builder.css">
<script src="/modules/flow-builder/flow-builder.umd.cjs"></script>
<div id="flow-builder-root"></div>
<script>
  window.FlowBuilder.mount('#flow-builder-root', {
    apiBaseUrl: '/api/flow',
    flowId: '<%= flow.uuid %>',
    mode: 'embedded'
  });
</script>
```

## API Routes

Do not add these routes under `/api/v1`. Create a dedicated Flow API surface under `/api/flow`.

Add a controller at:

```txt
controllers/flow/flow-workflows.controller.js
```

Create `routes/flow.routes.js` and mount it from `routes/index.js` at `/api/flow`. Reuse the existing API token middleware unless a separate Flow auth middleware is needed:

```js
const express = require('express');
const router = express.Router();
const validateApiV1Token = require('../middlewares/api-v1.auth.middleware');
const FlowWorkflowsController = require('../controllers/flow/flow-workflows.controller');

router.use(validateApiV1Token);

router.get('/workflows', FlowWorkflowsController.list);
router.post('/workflows', FlowWorkflowsController.create);
router.get('/workflows/:flowUuid', FlowWorkflowsController.get);
router.put('/workflows/:flowUuid', FlowWorkflowsController.update);
router.delete('/workflows/:flowUuid', FlowWorkflowsController.delete);

router.post('/workflows/:flowUuid/run', FlowWorkflowsController.run);
router.get('/workflows/:flowUuid/runs', FlowWorkflowsController.listRuns);
router.get('/workflows/:flowUuid/runs/:runUuid', FlowWorkflowsController.getRun);

router.post('/webhooks/:workflowUuid/:path?', FlowWorkflowsController.webhook);

module.exports = router;
```

Mount in `routes/index.js`:

```js
const flowRoutes = require('./flow.routes');
router.use('/api/flow', flowRoutes);
```

## Endpoint Contracts

### Create Flow

```txt
POST /api/flow/workflows
```

Request body is the canonical workflow definition. The backend must set `userUuid` from the authenticated user, not from the request body.

Response:

```json
{
  "data": {
    "uuid": "workflow_uuid",
    "definition": {}
  }
}
```

### Update Flow

```txt
PUT /api/flow/workflows/:flowUuid
```

Only allow update when `FlowWorkflow.userUuid === req.user.uuid`. Replace the workflow definition and synchronize `FlowNode` and `FlowEdge` rows.

### Run Flow

```txt
POST /api/flow/workflows/:flowUuid/run
```

Request:

```json
{
  "trigger": "manual",
  "context": {
    "trigger": {
      "status": "success",
      "output": {
        "body": {}
      },
      "meta": {},
      "error": null
    }
  },
  "dryRun": true
}
```

Response:

```json
{
  "data": {
    "runId": "run_uuid",
    "status": "success",
    "context": {}
  }
}
```

## Execution Rules

Use a DAG executor:

1. Validate no cycles.
2. Start with `trigger` context.
3. Execute nodes in dependency order.
4. Skip disabled nodes with:

```json
{
  "status": "skipped",
  "output": null,
  "meta": {},
  "error": null
}
```

5. For regular nodes, only follow edges from `fromOutput: "success"` when status is success.
6. For Logic nodes, evaluate each condition independently and set `selectedOutput` to the first matching condition id. Execute downstream edges whose `fromOutput` equals a matched condition id.
7. Persist each node trace to `FlowRunNode`.
8. Persist final context to `FlowRun.contextSnapshot`.

## Node Execution Details

### input

Config:

```json
{
  "format": "json",
  "value": "{}"
}
```

Output:

```json
{
  "value": {},
  "format": "json"
}
```

### http_request / rest

Config:

```json
{
  "method": "GET",
  "url": "https://api.example.com",
  "headers": {},
  "body": {},
  "timeout": 10000
}
```

Output should be the response body. HTTP metadata goes in `meta`:

```json
{
  "status": "success",
  "output": {},
  "meta": {
    "statusCode": 200,
    "headers": {},
    "durationMs": 421
  },
  "error": null
}
```

### ai_prompt

Config:

```json
{
  "model": "gpt-5.5",
  "systemPrompt": "",
  "userPrompt": "",
  "temperature": 0.7,
  "maxTokens": 300
}
```

Output:

```json
{
  "text": "Generated copy",
  "variants": []
}
```

Meta:

```json
{
  "model": "gpt-5.5",
  "tokensUsed": 214
}
```

### javascript

Execute in a sandbox. Pass the current wrapped context as `input`.

Expected code shape:

```js
return {
  caption: input.write_caption.output.text,
  hashtags: '#Launch #SocialOps'
};
```

### logic

Config:

```json
{
  "conditions": [
    {
      "id": "has_topics",
      "label": "Has topics",
      "expression": "{{ fetch_trends.output.topics.length > 0 }}"
    }
  ]
}
```

Output:

```json
{
  "matched": true,
  "conditionId": "has_topics"
}
```

Set `selectedOutput` to the matching condition id.

### publish

Delegate to existing Mixpost social services. Do not store OAuth credentials in flow tables.

Output:

```json
{
  "published": false,
  "dryRun": true,
  "previewUrl": null,
  "results": []
}
```

## Variable Resolution

Implement a safe resolver for `{{path.to.value}}`.

Important:

- Missing paths resolve to empty string.
- Support bracket access like `items[0].name`.
- Resolve variables before node execution.
- Use the wrapped context paths, for example `write_caption.output.text`.

## Validation

Validate workflow definitions before save:

- `id`, `name`, `version` required.
- Every node has unique `id`.
- Every edge `from` and `to` references valid nodes or trigger.
- `fromOutput` exists in the source node `outputs`.
- Logic node condition ids are unique.
- Graph has no cycles.

## Cursor Implementation Checklist

1. Add the `Flow*` Sequelize models.
2. Add model associations.
3. Add `controllers/flow/flow-workflows.controller.js`.
4. Create `routes/flow.routes.js` and mount it in `routes/index.js` with `router.use('/api/flow', flowRoutes)`.
5. Implement workflow validation helpers.
6. Implement variable resolver.
7. Implement DAG executor service at `services/flow/flow-executor.service.js`.
8. Implement node runners under `services/flow/nodes/*.js`.
9. Connect `publish` runner to existing Mixpost publishing services.
10. Add the flow management pages and design page.
11. Add tests or Postman examples for create, update, run, and get run.

