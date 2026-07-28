# Social Flow Builder — Product Specification
**Vue 3 Module · JavaScript · Mixpost Platform · v1.0 Draft · May 2026**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Node Types](#3-node-types)
4. [Variable System](#4-variable-system)
5. [Canvas & UX](#5-canvas--ux)
6. [Execution Engine](#6-execution-engine)
7. [Express Embedding](#7-express-embedding)
8. [Data Model](#8-data-model)
9. [File Structure](#9-file-structure)
10. [Roadmap](#10-roadmap)

---

## 1. Overview

A visual, node-based workflow engine for composing and publishing social media content — built as an **embeddable Vue 3 module** for integration into existing Node.js/Express MVC applications.

| | |
|---|---|
| **Module Type** | Vue 3 Component — embeds in any Express page |
| **Language** | JavaScript (no TypeScript) |
| **Node Types** | 6 at v1.0 launch |
| **Social Auths** | Host app only — no OAuth inside this module |

### Problem Statement

Social media teams constantly context-switch between data tools, AI writing tools, and publishing platforms. Existing schedulers treat content as static text — they cannot dynamically fetch data, run AI generation, or transform outputs in a unified pipeline. The Flow Builder closes this gap: a composable, repeatable visual pipeline where every step is connected.

### Scope

**In Scope ✓**
- Visual flow canvas (Vue 3 component)
- Six canonical node types: `input` (trigger/entry point), `http_request`, `ai_prompt`, `javascript`, `logic`, `publish`
- Variable system with dot-notation references (`{{ <nodeName>.output... }}`, plus n8n-style `{{$json[...]}}` for the immediate upstream node)
- Embeds into any Express.js page via a script tag
- Standalone Vue app mode for isolated development and testing
- Delegates publishing to the host app's existing social service layer
- No social API credentials stored or managed in this module

**Out of Scope ✗**
- OAuth flows for Instagram, X, Facebook, LinkedIn, etc.
- Social media API integration
- Account management or connection UI
- User authentication / sessions
- Media storage or CDN
- Billing, plans, or usage limits
- Email or push notification delivery

---

## 2. Architecture

### Dual-Mode Design

The module runs in two modes from the **same codebase**:

#### Embedded Mode
Mounted inside an existing Express.js view. The host application provides connected social accounts, an API bridge URL, and optional theme config. The module renders inside a designated DOM element with no page-level side effects.

```js
window.FlowBuilder.mount('#flow-builder-root', config)
```

#### Standalone Mode
Runs as a fully independent Vue app for development, testing, and isolated preview. Uses mock social accounts and a local API server (MSW) to simulate the host app's bridge endpoints.

```bash
npm run dev  →  Vite dev server at http://localhost:5173
```

---

### Technology Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Vue 3 | Composition API with `<script setup>`. Options API for simpler leaf components. |
| Language | JavaScript (not TypeScript) | No TS build step. JSDoc annotations for IDE hints where useful. |
| Build Tool | Vite | Fast dev server. Library mode build for embeddable UMD/ES bundle. |
| State | Pinia | Stores: flow, run, accounts, config. |
| Canvas | VueFlow | Vue-native port of React Flow. Handles nodes, edges, pan, zoom, lasso. |
| Styling | CSS Modules + CSS custom properties | Scoped per component. No Tailwind dependency — safe to embed anywhere. |
| HTTP | Axios | API calls to the host app bridge and within REST API node execution. |
| Routing | Vue Router (standalone only) | Hash-based routing for the standalone flow list. Embedded mode has no router. |
| Testing | Vitest + Vue Test Utils | Unit tests for variable resolution, DAG logic, and node execution. |
| E2E | Playwright | Canvas interaction tests run against the standalone app. |

---

### Component Tree

```
FlowBuilderApp.vue                   ← root, detects embedded vs standalone mode
├── AppShell.vue                     ← layout: sidebar + canvas + panels
│   ├── NodeLibrary.vue              ← left sidebar — draggable node palette
│   ├── FlowCanvas.vue               ← main canvas (wraps VueFlow)
│   │   ├── nodes/
│   │   │   ├── InputNode.vue
│   │   │   ├── HttpRequestNode.vue
│   │   │   ├── AiPromptNode.vue
│   │   │   ├── JavascriptNode.vue
│   │   │   ├── LogicNode.vue
│   │   │   └── PublishNode.vue
│   │   └── FlowEdge.vue             ← custom animated edge component
│   ├── ConfigPanel.vue              ← right sidebar, context-sensitive
│   │   ├── config/
│   │   │   ├── InputConfig.vue
│   │   │   ├── HttpRequestConfig.vue
│   │   │   ├── AiPromptConfig.vue
│   │   │   ├── JavascriptConfig.vue
│   │   │   ├── LogicConfig.vue
│   │   │   └── PublishConfig.vue
│   │   └── VariableInspector.vue    ← live RunContext viewer
│   └── RunLog.vue                   ← bottom drawer, per-node trace
├── FlowToolbar.vue                  ← top bar: Run · Test · Save · Zoom
└── standalone/
    ├── StandaloneApp.vue            ← dev wrapper with mock config
    └── FlowList.vue                 ← list/create/delete flows (standalone only)
```

---

### Pinia Stores

| Store | Responsibility |
|---|---|
| `useFlowStore` | Active flow definition: `nodes[]`, `connections`, `pinData`, `meta` (see `hype-engine/Flow-spec.md`). No top-level `trigger` field — the entry point is the `nodes[]` entry with `type: "input"` that has no incoming `connections` edge. |
| `useRunStore` | Current run state, per-node results, full run log entries |
| `useAccountsStore` | Connected social accounts — populated from embed config or mock data |
| `useConfigStore` | Module config: apiBaseUrl, theme overrides, enabledNodes, mode |

---

## 3. Node Types

Each canonical node type (`input`, `http_request`, `ai_prompt`, `javascript`, `logic`, `publish` — see `hype-engine/Flow-spec.md` §2) is a self-contained Vue component pair: a **canvas node component** and a **config panel component**. On disk/over the API a node is `{ id, name, type, typeVersion, position, parameters, credentials?, webhookId?, notes? }`; the config panel edits `parameters`. At runtime every node writes a `{ status, output, meta, error }` record into `RunContext` keyed by its `id` (see `hype-engine/Flow-run-spec.md` §4). `output` is the type-specific result described per node below; `meta` carries timing plus type-specific metadata.

---

### ◷ Input Node — `Trigger / Entry Point` (`type: "input"`)

The workflow's entry point. There is **no separate top-level `trigger` object** (`Flow-spec.md` §6) — the entry point is whichever `input` node has no incoming `connections` edge. A flow must contain exactly one such node.

**Config Fields** (`parameters`)

| Field | Type | Description |
|---|---|---|
| `triggerType` | enum | `manual` · `webhook` · `chat` |
| `options` | object | Trigger-specific options, e.g. `options.systemMessage` for a chat trigger |
| `webhookId` (top-level, sibling of `parameters`) | string | Present when `triggerType` is `webhook`; identifies the webhook registration |

**Outputs** (`RunContext[id]`)

The entry node is **not executed by a runner** — its context slot is seeded directly from the inbound trigger payload before the run starts:

| Key | Description |
|---|---|
| `output.body` (or the raw payload, spread) | The inbound webhook/manual-run payload |
| `meta.triggeredAt` | ISO timestamp when the run started |

Downstream nodes reference this via `{{ <inputNodeName>.output.body.productId }}` or, for the node immediately downstream, `{{$json["productId"]}}`.

---

### ⚡ HTTP Request Node — `Data Source` (`type: "http_request"`, alias `rest`)

Fetch external data from any HTTP endpoint. Outputs are immediately available to all downstream nodes.

**Config Fields** (`parameters`)

| Field | Type | Description |
|---|---|---|
| `url` | string | Target endpoint. Supports `{{ }}` / `{{$json[...]}}` interpolation |
| `method` | enum | GET · POST · PUT · PATCH · DELETE (default GET) |
| `headers` | key-value | Static or dynamically resolved headers |
| `body` / `jsonBody` | JSON/text | Request payload for POST/PUT. Supports `{{ }}` tokens |
| `jsonParameters` | boolean | n8n flag indicating `body`/params are JSON (matches reference file's `Call *Agent` nodes) |
| `timeout` | number | Max wait in ms (default 10000, capped at 120000) |

**Outputs** (`RunContext[id]`)

| Key | Description |
|---|---|
| `output` | Full parsed response body (JSON object or raw string) — deep path access e.g. `{{ "Call Helper Agent".output.items[0].title }}` |
| `meta.statusCode` | HTTP status number e.g. 200, 404 |
| `meta.headers` | Response headers as a flat key-value object |
| `meta.durationMs` | Request duration |
| `error` | `{ message, stack }` if the request fails or returns >= 400 — node `status` becomes `"error"` and downstream nodes are skipped |

---

### ✦ AI Prompt Node — `AI Generation` (`type: "ai_prompt"`)

Sends a prompt to an LLM and receives generated text. In the n8n reference file, the separate `OpenAI Chat Model` node is folded into this node's `parameters` (`Flow-spec.md` §2) rather than being its own node/connection.

**Config Fields** (`parameters`)

| Field | Type | Description |
|---|---|---|
| `model` | string \| object | Model identifier, e.g. `"gpt-4o-mini"` or n8n's `{ value: "gpt-4.1-mini", ... }` |
| `options.systemMessage` | textarea | System/persona prompt. Supports `{{ }}` / `{{$json[...]}}` tokens |
| `userPrompt` / `prompt` | textarea | The generation task |
| `temperature` | number | 0 = deterministic, 1 = creative (default 0.7) |
| `maxTokens` | number | Hard cap on output length (default 300) |

**Outputs** (`RunContext[id]`)

| Key | Description |
|---|---|
| `output.text` | Primary generated text string |
| `output.variants[]` | `[text]` when generation succeeds, `[]` otherwise |
| `meta.model` | Model identifier that ran |
| `meta.tokensUsed` | Total token count (prompt + completion) |

---

### `{ }` JavaScript Node — `Transform` (`type: "javascript"`)

Runs sandboxed JavaScript to reshape, merge, filter, or format data between nodes.

**Config Fields** (`parameters`)

| Field | Type | Description |
|---|---|---|
| `jsCode` | code-editor | Code body executed as `(function(input, $input) { <jsCode> })(input, $input)`. Must end with `return <value>`. |
| `timeout` | number | Max execution time in ms (default 5000, capped at 30000) |

The sandbox exposes:

- `input` — the full `RunContext` snapshot (every upstream node's `{ status, output, meta, error }`, keyed by `id`).
- `$input.all()` / `$input.first()` — n8n-style helpers returning `[{ json: <immediate upstream node's output> }]`.

**Outputs** (`RunContext[id]`)

| Key | Description |
|---|---|
| `output` | The returned value if it's an object; otherwise wrapped as `{ value: <returned value> }` |
| `output.KEY` | Named field if the returned object has one, e.g. `{{ Code.output.caption }}` |

**Example Code**

```js
// $input.first().json === immediate upstream node's `output`
const actions = $input.first().json.actions;
return actions.map(action => ({ json: action }));
```

---

### ◈ Logic Node — `Condition / Switch` (`type: "logic"`)

Branches the flow based on `parameters.rules.values[]` — an n8n-style condition tree, one entry per output branch. See `Flow-run-spec.md` §6 for full evaluation rules.

**Config Fields** (`parameters`)

| Field | Type | Description |
|---|---|---|
| `rules.values[]` | array | One entry per branch. Each entry has `conditions.combinator` (`"and"`/`"or"`) and `conditions.conditions[]` of `{ leftValue, rightValue, operator: { type, operation } }`. `leftValue`/`rightValue` may use `{{$json[...]}}` / `{{ }}`. |

Branch *order* in `rules.values[]` must match branch order in `connections.<name>.main[]` (`Flow-spec.md` §3) — output handle *N* on the canvas corresponds to `rules.values[N]`.

**Outputs** (`RunContext[id]`)

| Key | Description |
|---|---|
| `output.matched` | `true` if any branch's conditions evaluated true |
| `selectedOutput` | Zero-based index of the first matching `rules.values[]` entry, or `null` if none matched |
| `meta.label` | Optional label of the matched branch |

Only `connections.<name>.main[selectedOutput]` is traversed; every other branch (and anything reachable only through it) is recorded as `"skipped"`. If `selectedOutput` is `null`, all branches are skipped.

---

### ↑ Publish Node — `Publish` (`type: "publish"`)

Publishes content to social media accounts already connected in the **host Mixpost application**. No OAuth or API keys are managed by this module — publishing is delegated to the host app's social service layer (`PlatformServiceFactory`).

**Config Fields** (`parameters`)

| Field | Type | Description |
|---|---|---|
| `projectUuid` | string | Target Mixpost project |
| `accountUuids[]` | array | Connected account UUIDs to publish to. Populated from the host app's connected accounts (passed in embed config) |
| `content` | textarea | Post body. Supports `{{ }}` tokens, e.g. `{{ "Format Output".output.caption }}` |
| `media[]` | array | Image/video references from an upstream node or Media Library |

**Outputs** (`RunContext[id]`)

| Key | Description |
|---|---|
| `output.published` | `true` if at least one account succeeded |
| `output.dryRun` | `true` for Test Run — no platform call is made |
| `output.results[]` | One entry per account attempted: `{ ok, accountUuid, provider, data?, error? }` |

> **Note:** The Publish node never manages OAuth or API credentials. Project/account ownership is checked against `req.user.uuid` server-side before publishing.

---

## 4. Variable System

Every upstream node's `{ status, output, meta, error }` record (`RunContext`, see `Flow-run-spec.md` §4) is accessible from any downstream node. There are two forms:

### Core Syntax

```
{{ <nodeName>.output... }}
{{$json[...]}}  /  {{$json.key}}
```

| Part | Description |
|---|---|
| `<nodeName>` | The node's display `name` as shown on the canvas (the same key used in `connections`, `Flow-spec.md` §2-3). **Not** a separate `nodeId` field — `name` is both the label and the reference key. |
| `.output` | The node's primary result, shape depends on `type` (see §3 per-node Outputs tables). `.meta` and `.error` are also accessible. |
| `{{$json[...]}}` / `{{$json.key}}` | n8n shorthand for "the immediate upstream node's `output`" — only valid when the referencing node has exactly one incoming connection. Equivalent to `{{ <single upstream node name>.output[...] }}`. |
| `{{ }}` | Double-curly braces mark a variable token. Resolved immediately before the node executes, against the current `RunContext` snapshot. |

At load time, every `{{ <nodeName>... }}` reference (and every `connections` entry) is resolved from the node's `name` to its stable `id` for runtime addressing (`Flow-run-spec.md` §1) — this resolution is internal and invisible to the user.

---

### Quick-Reference Cheatsheet

| Token | What it gives you |
|---|---|
| `{{ "Fetch Trends".output }}` | Full JSON response body from an `http_request` node |
| `{{ "Fetch Trends".output.topics[0].name }}` | Nested field from the response body |
| `{{ "Fetch Trends".meta.statusCode }}` | HTTP status code number |
| `{{ "Write Caption".output.text }}` | Generated text string from an `ai_prompt` node |
| `{{ "Write Caption".meta.tokensUsed }}` | Token count — useful for cost tracking or `logic` conditions |
| `{{ "Write Caption".output.variants[1] }}` | Second AI-generated variant |
| `{{ "Format Output".output }}` | Return value of a `javascript` node |
| `{{ "Format Output".output.caption }}` | Named field from the returned object |
| `{{ "Publish Post".output.results[0].data.url }}` | Public URL of the first publish result |
| `{{$json["agent"]}}` | `agent` field of the immediate upstream node's `output` (n8n shorthand) |
| `{{ "When chat message received".output.body }}` | Inbound trigger payload for this run |
| `{{ "When chat message received".output.body.productId }}` | Nested field from the trigger payload |

---

### End-to-End Flow Example

**Step 01 — `Fetch Trends` (`http_request`)**
```
parameters.url: https://api.trends.io/v1/today
parameters.method: GET

RunContext:
  output                    ← full JSON body
  output.topics[0].name     ← first topic title
  meta.statusCode           ← 200
```

**Step 02 — `Write Caption` (`ai_prompt`)**
```
parameters.options.systemMessage / parameters.userPrompt:
"Write a punchy caption about {{ "Fetch Trends".output.topics[0].name }}.
Under 150 words. Add 5 hashtags."

RunContext:
  output.text     ← generated caption string
  meta.tokensUsed ← 214
```

**Step 03 — `Format Output` (`javascript`)**
```js
const lines = $input.first().json.text.split("\n").filter(Boolean);
return { caption: lines[0], hashtags: lines.slice(1).join(" ") };

RunContext:
  output.caption   ← clean first line
  output.hashtags  ← hashtag block
```

**Step 04 — `Publish Post` (`publish`)**
```
parameters.content: {{ "Format Output".output.caption }}
parameters.accountUuids: ["<instagram_biz uuid>", "<linkedin_page uuid>"]

RunContext:
  output.results[0].data.url  ← live post URL
  output.published            ← true
```

---

### Resolution Rules

| Rule | Detail |
|---|---|
| Scope | Only connected upstream ancestors are accessible. Siblings and downstream nodes resolve to undefined. |
| Timing | Resolved immediately before a node executes — always against the latest `RunContext` snapshot. |
| Undefined | Missing node `name` or key resolves to empty string `''`. A warning badge appears on the node. |
| Deep paths | Any depth of dot/bracket access: `{{ "JS Node".output.items[2].tags[0] }}` |
| `$json` shorthand | Only valid for a node with exactly one incoming connection — resolves against that single upstream node's `output`. |
| Anywhere | Works in all text config fields: URLs, prompts, headers, JS string literals (`parameters.*`). |
| Case sensitive | Node `name`s and output keys are both case-sensitive. |
| Uniqueness | Node `name`s must be unique within a flow (this is the key `connections` and expressions resolve against). |
| Rename sync | Renaming a node's `name` on the canvas must rewrite every `connections` entry and `{{ <oldName>... }}` reference to the new `name` in the stored definition. `$json` references need no rewrite, since they address by graph position, not name. |

### Autocomplete in Config Panel

Typing `{{` in any config field opens an inline picker listing all upstream node `name`s and their available `output`/`meta` keys with type hints (per §3). Selecting an entry inserts the full token. Implemented as the shared Vue composable `useVariablePicker()` used across all config components.

---

## 5. Canvas & UX

### Canvas Interactions

| Action | Input | Notes |
|---|---|---|
| Pan | Middle-click drag or Space + drag | Infinite canvas |
| Zoom | Scroll wheel · Ctrl+= · Ctrl+- | 10%–200% |
| Select | Click or lasso drag | Multi-select with Shift |
| Connect | Drag output port → input port | Ports glow on hover. Incompatible types rejected. |
| Disconnect | Click edge → Delete | Or drag edge off its port |
| Duplicate | Cmd/Ctrl + D | Copies node with full config, new nodeId suffixed `_2` |
| Delete | Select + Backspace | Removes node and all connected edges |
| Fit View | Cmd/Ctrl + Shift + F | Auto-zoom to show all nodes |
| Minimap | Always-on, bottom-right corner | Click to teleport to any area |

### Node Visual States

| State | Meaning |
|---|---|
| Idle | Default — not yet executed |
| Running | Currently executing |
| Success | Completed without error |
| Warning | Completed with a non-fatal warning (e.g. undefined variable) |
| Error | Failed — error message shown in Run Log |
| Skipped | Bypassed due to Condition branch or upstream failure with Skip behavior |

### Panels

| Panel | Location | Purpose |
|---|---|---|
| Node Library | Left sidebar | Searchable, categorised. Drag onto canvas to add. |
| Config Panel | Right sidebar | Context-sensitive — shows config form for selected node. |
| Variable Inspector | Right sidebar tab | Live view of FlowContext — all outputs from completed nodes. |
| Run Log | Bottom drawer | Per-node execution trace: timing, inputs, outputs, errors. |
| Flow Toolbar | Top bar | Run · Test · Save · Undo/Redo · Zoom controls. |

### Theming

The module exposes CSS custom properties that the host app can override to match its design system. All styles are scoped — no class name collisions with the host app.

```css
/* Override in your host app's stylesheet */
#flow-builder-root {
  --fb-bg:      #07080A;
  --fb-surface: #0F1014;
  --fb-border:  #1E2028;
  --fb-text:    #E8E6F0;
  --fb-accent:  #6C8EF5;
  --fb-font:    'IBM Plex Mono', monospace;
  --fb-radius:  8px;
}
```

---

## 6. Execution Engine

### Execution Model

Flows execute as **directed acyclic graphs (DAGs)** derived from `connections` (`Flow-spec.md` §3 → `Flow-run-spec.md` §3). The entry-point `input` node's context slot is seeded directly from the inbound trigger payload (`Flow-run-spec.md` §2) and is not executed by a runner. Nodes with no remaining unmet dependencies run in parallel rounds. A node downstream of an `"error"` or `"skipped"` node is itself recorded `"skipped"` — there is no separate error-output port (`Flow-spec.md` §3 notes every connection `type` is `"main"`).

### RunContext Object

A single object — `RunContext` — accumulates one `{ status, output, meta, error }` record per node **`id`** as it completes (`Flow-run-spec.md` §4). Each node receives a deep-cloned snapshot before it executes; variable tokens are resolved against this snapshot. `connections`/`{{ }}` references use node `name`, resolved to `id` at load time (§4 above).

```js
// RunContext grows as nodes complete (keyed by node id; names shown as comments):
{
  "id-of-When-chat-message-received": {       // entry node — seeded, not executed
    status: "success",
    output: { body: { productId: "abc123" } },
    meta: { triggeredAt: "2026-05-02T09:00Z" },
    error: null
  },
  "id-of-Fetch-Trends": {                     // http_request
    status: "success",
    output: { topics: [{ name: "Summer Drops" }] },
    meta: { statusCode: 200, headers: { "content-type": "application/json" }, durationMs: 421 },
    error: null
  },
  "id-of-Write-Caption": {                    // ai_prompt
    status: "success",
    output: { text: "Summer Drops are here! ...", variants: ["Summer Drops are here! ..."] },
    meta: { model: "claude-sonnet-4", tokensUsed: 214 },
    error: null
  },
  "id-of-Format-Output": {                    // javascript
    status: "success",
    output: { caption: "Summer Drops are here!", hashtags: "#summer" },
    meta: {},
    error: null
  }
}
```

### Variable Resolution Utility

```js
// src/composables/useVariableResolver.js

export function resolveVariables(template, context, { nameToId, upstreamId } = {}) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, rawPath) => {
    let path = rawPath.trim();

    // n8n shorthand: {{$json[...]}} / {{$json.key}} → immediate upstream node's output
    if (path.startsWith('$json')) {
      const upstreamOutput = context[upstreamId]?.output;
      const key = path.replace(/^\$json\.?/, '').replace(/^\[["']?|["']?\]$/g, '');
      const value = key ? getDeep(upstreamOutput, key) : upstreamOutput;
      return value !== undefined ? stringify(value) : '';
    }

    // {{ "Node Name".output.path }} → resolve "Node Name" to its id, then deep-get
    const value = getDeep(context, resolveNodeNameToId(path, nameToId));
    return value !== undefined ? stringify(value) : '';
  });
}

// Safe deep getter — never throws on missing paths
function getDeep(obj, path) {
  return String(path)
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .reduce((acc, key) => acc?.[key], obj);
}

function stringify(v) {
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
}

// Usage:
const resolvedUrl = resolveVariables(
  'https://api.example.com/{{ "Fetch Trends".output.topics[0].name }}',
  runContext,
  { nameToId }
);
// → "https://api.example.com/Summer Drops"
```

### Run Modes

| Mode | Description | Access |
|---|---|---|
| Test Run | Full DAG walk. `publish` nodes are dry-run — `output: { published: false, dryRun: true, results: [] }`, no platform call. All other nodes execute fully. | Toolbar: Test button |
| Live Run | Full execution including `publish` nodes calling the host app's social service layer. | Toolbar: Run button |
| Step Debug | Pauses after each round of ready nodes. Inspect `RunContext` in Variable Inspector, then continue manually. | v1.1 |
| Replay | Re-execute using a previously persisted `FlowRun.initialContext` as the new run's seed. | From Run History |

### JavaScript Node Sandbox

The `javascript` node (`parameters.jsCode`) executes in an isolated VM context (`services/flow/nodes/javascript.js`):

| Capability | Status | Notes |
|---|---|---|
| `input` | ✓ Available | Full `RunContext` snapshot, keyed by node `id` |
| `$input.all()` / `$input.first()` | ✓ Available | `[{ json: <immediate upstream node's output> }]` |
| `console` | ✓ Available | |
| Network access | ✗ Blocked | No fetch, XMLHttpRequest, or WebSocket |
| File system / `process` / `global` / `require` | ✗ Blocked | |
| Timeout | 5 000 ms default | Configurable up to 30 000 ms |

---

## 7. Express Embedding

### Build Output

```bash
# Build the embeddable library bundle
npm run build:lib

# Output:
dist/
  flow-builder.umd.js    ← UMD bundle (works in any page via script tag)
  flow-builder.es.js     ← ES module (for modern bundler consumption)
  flow-builder.css       ← scoped component styles
```

### Embedding in an Express View (EJS)

```html
<!-- In your EJS layout or view file -->
<link  rel="stylesheet" href="/modules/flow-builder/flow-builder.css">
<script src="/modules/flow-builder/flow-builder.umd.js"></script>

<!-- Mount target -->
<div id="flow-builder-root"></div>

<script>
  window.FlowBuilder.mount('#flow-builder-root', {

    // Required: where the module sends execution requests
    apiBaseUrl: '/api/flow-builder',

    // Required: connected social accounts from the host Mixpost app.
    // The Post node populates its account picker from this list.
    // No OAuth happens in the module — accounts are managed by the host.
    accounts: <%- JSON.stringify(connectedAccounts) %>,

    // Optional: pre-load a saved flow by ID
    flowId: '<%= flow.id %>',

    // Optional: restrict which node types appear in the palette
    // (canonical types from hype-engine/Flow-spec.md §2)
    enabledNodes: ['input', 'http_request', 'ai_prompt', 'javascript', 'logic', 'publish'],

    // Optional: override CSS custom properties
    theme: {
      accent: '#6C8EF5',
      font:   'IBM Plex Mono, monospace',
    },

  });
</script>
```

### Host App API Bridge

The module communicates with the host application via a small REST API that the host must implement at the `apiBaseUrl` prefix. All social publishing, AI key management, and JS sandboxing happen server-side in the host app.

| Method | Path | Purpose |
|---|---|---|
| POST | `/flows` | Save a new flow (`{ nodes, connections, pinData, meta }`, per `Flow-spec.md` §1) |
| GET | `/flows/:id` | Load a saved flow by ID |
| PUT | `/flows/:id` | Update an existing flow |
| POST | `/flows/:id/run` | Execute a flow. Returns `runId` for polling. |
| GET | `/runs/:runId` | Poll run status and per-node `RunContext` results |
| POST | `/nodes/http-request` | Proxy external HTTP request (host enforces allowlist) |
| POST | `/nodes/ai-prompt` | Proxy prompt to AI model (host holds API keys) |
| POST | `/nodes/javascript` | Execute sandboxed JS in host isolate |
| POST | `/nodes/publish` | Publish via host app's existing Mixpost social service |
| GET | `/accounts` | List connected social accounts (alternative to config inject) |

### `embed.js` — Mount Entry Point

```js
// src/embed.js — exported as window.FlowBuilder in the UMD build
import { createApp }   from 'vue';
import { createPinia } from 'pinia';
import FlowBuilderApp  from './FlowBuilderApp.vue';
import { useConfigStore } from './stores/config.store';
import './styles/base.css';

export function mount(selector, config = {}) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`FlowBuilder: no element for "${selector}"`);

  const app   = createApp(FlowBuilderApp);
  const pinia = createPinia();
  app.use(pinia);

  // Seed config store before mount so all components see it immediately
  const cfg = useConfigStore(pinia);
  cfg.init(config);  // { apiBaseUrl, accounts, flowId, theme, enabledNodes }

  app.mount(el);

  // Return handle for host app to unmount when navigating away
  return { app, unmount: () => app.unmount() };
}

if (typeof window !== 'undefined') {
  window.FlowBuilder = { mount };
}
```

### `vite.config.js` — Dual Mode

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => ({
  plugins: [vue()],

  ...(mode === 'lib'
    // ── Library build: npm run build:lib ──
    ? {
        build: {
          lib: {
            entry:    'src/embed.js',
            name:     'FlowBuilder',
            fileName: 'flow-builder',
            formats:  ['umd', 'es'],
          },
          // Bundle everything — host app may not have Vue installed
          rollupOptions: { external: [] },
        },
      }
    // ── Standalone app build: npm run dev / npm run build ──
    : {
        build: { outDir: 'dist-app' },
      }
  ),
}));
```

### Standalone Development

```bash
# Run as a standalone Vue app (no Express needed)
npm run dev
# → Vite dev server at http://localhost:5173

# StandaloneApp.vue provides:
#   - Mock social accounts list
#   - MSW (Mock Service Worker) intercepts all /api/flow-builder/* calls
#   - Flow list page: create / open / delete flows
#   - Full canvas with all node types enabled

# Run tests
npm run test          # Vitest unit tests
npm run test:ui       # Vitest browser UI
npm run test:e2e      # Playwright against standalone app
```

---

## 8. Data Model

This module's flow definition **is** the format described in `hype-engine/Flow-spec.md`: `{ nodes, connections, pinData, meta }`, with no top-level `trigger` (`Flow-spec.md` §6). Runtime concepts (`RunContext`, `FlowRun`, `NodeResult`) follow `hype-engine/Flow-run-spec.md`.

### Node Naming Rules

| Rule | Detail | Example |
|---|---|---|
| `id` | Stable UUID, assigned on creation, never shown to the user, never changes. Used for `RunContext`/persistence addressing (`Flow-run-spec.md` §1). | `f1503b54-97cf-41a4-b1f1-8f4c67234086` |
| `name` | Editable display label. Used as the addressing key in `connections` and in `{{ }}` expressions. | `"Fetch Trends"`, `"Write Caption"` |
| Uniqueness | `name` must be unique within a flow | Duplicates rejected on save |
| Rename sync | Renaming a node's `name` rewrites every `connections` entry and `{{ <oldName>... }}` reference to the new `name` (`id` is untouched) | Canvas warns on broken refs before rewrite completes |
| Reserved names | `trigger` · `flow` · `context` | Cannot be used as a node `name`, since they could collide with future implicit context keys |

### Core Schemas (JSDoc)

```js
/**
 * @typedef {Object} FlowDefinition
 * @description Top-level flow file shape — see Flow-spec.md §1. No top-level `trigger`.
 * @property {FlowNode[]} nodes
 * @property {Object<string, NodeConnections>} connections  — keyed by source node `name`
 * @property {Object} pinData
 * @property {Object} meta
 */

/**
 * @typedef {Object} FlowNode
 * @property {string} id           — stable UUID, internal addressing only
 * @property {string} name         — display label; key used in `connections` and `{{ }}` refs
 * @property {'input'|'http_request'|'ai_prompt'|'javascript'|'logic'|'publish'} type
 * @property {number|string} typeVersion
 * @property {[number, number]} position — [x, y]
 * @property {Object} parameters   — type-specific config, see §3
 * @property {Object} [credentials]
 * @property {string} [webhookId]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} NodeConnections
 * @description One entry per connection type (almost always just "main").
 * @property {Array<Array<{node: string, type: string, index: number}>>} main
 *           — outer array indexed by output port; inner arrays list `{node: <target name>, type, index}`
 */

/**
 * @typedef {Object} RunContext
 * @description Accumulated per-node results keyed by node `id` (Flow-run-spec.md §4).
 *               Every node writes: { status, output, meta, error, selectedOutput? }
 * @example
 * {
 *   "<entry node id>":   { status: "success", output: { body: {...} }, meta: { triggeredAt: "..." }, error: null },
 *   "<fetchTrends id>":  { status: "success", output: {...}, meta: { statusCode: 200, headers: {...} }, error: null },
 *   "<writeCaption id>": { status: "success", output: { text: "...", variants: [...] }, meta: { model: "...", tokensUsed: 214 }, error: null },
 *   "<formatOutput id>": { status: "success", output: { caption: "...", hashtags: "..." }, meta: {}, error: null }
 * }
 */

/**
 * @typedef {Object} FlowRun
 * @property {string}      uuid
 * @property {string}      workflowUuid
 * @property {'manual'|'webhook'|'schedule'|'replay'} triggerType
 * @property {'running'|'success'|'partial_failure'|'failed'} status
 * @property {string}      startedAt
 * @property {string}      finishedAt
 * @property {Object}      initialContext    — inbound trigger payload, seeds the entry node
 * @property {RunContext}  contextSnapshot   — full RunContext at end of run
 */

/**
 * @typedef {Object} NodeResult
 * @property {string}      nodeId          — the node's stable `id`
 * @property {'success'|'error'|'skipped'} status
 * @property {number|null} selectedOutput  — matched branch index for `logic` nodes, else null
 * @property {number}      durationMs
 * @property {RunContext}  inputContext    — RunContext snapshot at execution time
 * @property {*}           output          — value written to RunContext[nodeId].output
 * @property {{message: string, stack?: string}|null} error
 */
```

---

## 9. File Structure

```
flow-builder/                        ← drop into host project as a module folder
├── package.json
├── vite.config.js                   ← dual output: lib build + standalone app
├── index.html                       ← standalone dev entry point
├── src/
│   ├── main.js                      ← standalone Vue app entry
│   ├── embed.js                     ← library entry (exports FlowBuilder.mount)
│   │
│   ├── FlowBuilderApp.vue           ← root component
│   ├── AppShell.vue                 ← layout shell
│   │
│   ├── components/
│   │   ├── FlowCanvas.vue           ← wraps VueFlow
│   │   ├── FlowEdge.vue             ← custom edge component
│   │   ├── FlowToolbar.vue          ← top action bar
│   │   ├── NodeLibrary.vue          ← left palette sidebar
│   │   ├── ConfigPanel.vue          ← right config sidebar
│   │   ├── RunLog.vue               ← bottom run trace drawer
│   │   └── VariableInspector.vue    ← live FlowContext viewer
│   │
│   ├── nodes/                       ← canvas node components (rendered by VueFlow)
│   │   ├── RestApiNode.vue
│   │   ├── PromptNode.vue
│   │   ├── JavascriptNode.vue
│   │   ├── PostNode.vue
│   │   ├── ConditionNode.vue
│   │   └── ScheduleNode.vue
│   │
│   ├── config/                      ← right-panel config forms (one per node type)
│   │   ├── RestApiConfig.vue
│   │   ├── PromptConfig.vue
│   │   ├── JavascriptConfig.vue
│   │   ├── PostConfig.vue
│   │   ├── ConditionConfig.vue
│   │   └── ScheduleConfig.vue
│   │
│   ├── stores/                      ← Pinia stores
│   │   ├── flow.store.js
│   │   ├── run.store.js
│   │   ├── accounts.store.js
│   │   └── config.store.js
│   │
│   ├── composables/
│   │   ├── useVariablePicker.js     ← {{ autocomplete (shared across all configs)
│   │   ├── useFlowExecutor.js       ← DAG walk + node dispatch
│   │   ├── useVariableResolver.js   ← resolveVariables(template, context)
│   │   └── useApiBridge.js          ← Axios calls to apiBaseUrl endpoints
│   │
│   ├── utils/
│   │   ├── dagUtils.js              ← topological sort, cycle detection
│   │   ├── contextUtils.js          ← safe deep get/set for FlowContext
│   │   └── nodeDefaults.js          ← default config shapes per node type
│   │
│   └── standalone/
│       ├── StandaloneApp.vue        ← dev/test wrapper
│       ├── FlowList.vue             ← flow management (standalone only)
│       └── mockData.js              ← mock accounts, flows, API responses
│
├── tests/
│   ├── unit/
│   │   ├── variableResolver.test.js
│   │   ├── dagUtils.test.js
│   │   └── flowExecutor.test.js
│   └── e2e/
│       └── canvas.spec.js           ← Playwright tests against standalone app
│
└── dist/                            ← generated by build — do not commit
    ├── flow-builder.umd.js
    ├── flow-builder.es.js
    └── flow-builder.css
```

---

## 10. Roadmap

### v1.0 — Launch
- FlowCanvas.vue with VueFlow — pan, zoom, connect, lasso
- 4 core node types: REST API, Prompt, JavaScript, Post
- Condition node + Schedule Trigger node
- Variable system: dot-notation + `useVariablePicker` autocomplete
- Config panel per node type with live variable token insertion
- FlowContext DAG execution engine (`useFlowExecutor` composable)
- `resolveVariables` utility with safe deep path getter
- Test Run (dry-run Post nodes) + Live Run modes
- Run Log drawer with per-node timing and output
- Pinia stores: flow, run, accounts, config
- Embed mode: UMD + ES bundle via Vite lib build
- Standalone mode: Vite dev server + MSW mock data
- Vitest unit tests: resolver, DAG utils, executor

### v1.1 — DX & Debugging
- Step Debug mode — pause after each node, inspect FlowContext
- Variable Inspector panel (live context viewer)
- Undo / Redo stack (Ctrl+Z / Ctrl+Y)
- Node validation — warns before run if config fields are incomplete
- Flow templates library (pre-built starter flows)
- Import / Export flow as JSON

### v1.2 — Collaboration
- Flow versioning with rollback
- Duplicate flow
- Playwright e2e tests for canvas interactions
- Improved error messages with suggested fixes
- CSS custom property theming documentation

### v2.0 — AI-Native
- AI Flow Composer — describe a flow in plain language to generate it
- Image Generation node (DALL·E, Stable Diffusion)
- A/B Variant node with automatic winner selection after publish
- Optimal-time publishing recommendation
- Brand-safety guard node (runs before Post node)

---

*Social Flow Builder · Vue 3 Module · JavaScript · Mixpost Platform · v1.0 Draft · May 2026*
