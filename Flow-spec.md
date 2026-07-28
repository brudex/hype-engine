# Flow-spec: Flow File Format (n8n-Compatible)

This document specifies the JSON structure of a **flow file** as adopted by hype-engine, based on the n8n workflow JSON format. `n8n-sample-flow.json` is the reference example used throughout. When a flow file is imported into the flow builder, every node listed in `nodes` must appear on the canvas at its defined `position`, with edges drawn between nodes as described by `connections`.

**Scope**: this document covers the **definition** format only — the static shape of a flow file as stored, edited on the canvas, and imported. It says nothing about how a flow *runs*. For execution semantics (entry-point resolution, the runtime context object, branch routing, error/skip propagation, run modes, and persisted run/result schemas), see `Flow-run-spec.md`.

## 1. Top-Level Structure

A flow file is a single JSON object with these top-level keys:

```json
{
  "nodes": [ /* array of node objects, see §2 */ ],
  "connections": { /* map of node name -> output connections, see §3 */ },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "..."
  }
}
```

- **`nodes`** — every node that must be rendered on the canvas. Order in the array has no rendering significance; placement comes from each node's `position`.
- **`connections`** — the edges between nodes, keyed by the *source* node's `name`.
- **`pinData`** — optional cached/pinned execution data per node (empty object if unused).
- **`meta`** — workflow-level metadata (credential setup flags, instance id, etc.), not rendered on canvas.

## 2. Node Object Schema

Each entry in `nodes` represents one canvas node:

```json
{
  "parameters": { /* node-type-specific config */ },
  "type": "http_request",
  "typeVersion": 1,
  "position": [80, -100],
  "id": "f1503b54-97cf-41a4-b1f1-8f4c67234086",
  "name": "Call Helper Agent",
  "notes": "Delegate to Helper Agent",
  "webhookId": "38ead8ca-bdf8-4113-8f84-74761f3f2b74",
  "credentials": {
    "openAiApi": { "id": "R9YAyc5IE3q54XwG", "name": "OpenAi account" }
  }
}
```

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable unique identifier (UUID) for the node. Used internally; not shown to the user. |
| `name` | yes | Display label on the canvas. Also the key used to reference this node from `connections` and from other nodes' expressions (e.g. `{{$json[...]}}` runs in the context of the node that references it). |
| `type` | yes | One of hype-engine's existing canonical node types: `input`, `http_request` (alias `rest`), `ai_prompt`, `javascript`, `logic`, `publish`. No vendor prefix (e.g. no `n8n-nodes-base.` / `@n8n/n8n-nodes-langchain.`) — n8n's namespaced type strings are mapped onto these via `FRONTEND_TO_CANONICAL_TYPE` (see `services/flow/flow-workflow-validation.js`). Determines which canvas component/icon renders, which runner in `services/flow/nodes/` executes the node, and which `parameters` shape is expected. |
| `typeVersion` | yes | Version of the node type's parameter schema (e.g. `1`, `1.1`, `2`, `3.2`). The importer should use this to pick the correct parameter shape per type. |
| `position` | yes | `[x, y]` canvas coordinates (numbers). The node must be rendered at this exact position. |
| `parameters` | yes | Node-type-specific configuration object — e.g. a `url` + `jsonParameters` for `http_request`, a `jsCode` string for `javascript`, a `rules.values[]` condition tree for `logic`, an `options.systemMessage` prompt plus `model` for `ai_prompt`. |
| `credentials` | no | Map of credential-type name → `{ id, name }` reference to a stored credential (e.g. `openAiApi`). Not stored inline — only a reference. |
| `webhookId` | no | Present on trigger/webhook-capable nodes (e.g. `input`, or HTTP nodes acting as webhook entry points). Identifies the webhook registration. |
| `notes` | no | Free-text annotation shown on the node (e.g. `"Delegate to Helper Agent"`). |

### Node types used in the reference file

The reference file's n8n node types are represented using hype-engine's existing canonical types:

| `name` | `type` | Role |
|---|---|---|
| `When chat message received` | `input` | Workflow entry point/trigger |
| `AI Agent` | `ai_prompt` | LLM agent; `parameters.options.systemMessage` holds its prompt and `parameters.model` holds the model config (e.g. `gpt-4.1-mini`) — the separate `OpenAI Chat Model` node from n8n is folded into this node's `parameters` rather than represented as its own node/connection |
| `Code` | `javascript` | Inline JS transform (`parameters.jsCode`) |
| `Switch` | `logic` | Conditional router; `parameters.rules.values[]` defines one condition set per output branch |
| `Call Helper/Research/Media/Poster Agent` | `http_request` | Outbound HTTP call (`parameters.url`, `parameters.jsonParameters`) |

## 3. Connections Object Schema

`connections` is a map from a **source node's `name`** to its outgoing edges, grouped by **connection type** and **output index**:

```json
"connections": {
  "<source node name>": {
    "<connection type, e.g. \"main\" or \"ai_languageModel\">": [
      [ { "node": "<target node name>", "type": "<connection type>", "index": 0 }, ... ],
      [ /* output index 1 */ ],
      ...
    ]
  }
}
```

- The outer array is indexed by **output port number** of the source node (0-based). A node with one output has one inner array; a node with multiple outputs (e.g. a `logic` node) has one inner array per branch, in the same order as the branch is defined in `parameters`.
- Each inner array lists zero or more `{ node, type, index }` targets — a single output can fan out to multiple target nodes.
- `type` describes the kind of data flowing on the edge — for hype-engine flows this is `"main"` (regular data flow) for every connection. n8n's `ai_languageModel` side-channel (a separate model node feeding an agent node) is not used here, since model config lives inside the `ai_prompt` node's own `parameters` (see §2).
- `index` is the **target node's input port** the edge connects to (almost always `0` for single-input nodes).

### Worked example from the reference file

```
When chat message received --main(0)--> AI Agent (main input 0)
AI Agent --main(0)--> Code (main input 0)
Code --main(0)--> Switch (main input 0)
Switch --main(0)--> Call Helper Agent (main input 0)
Switch --main(1)--> Call Research Agent (main input 0)
Switch --main(2)--> Call Media Agent (main input 0)
Switch --main(3)--> Call Poster Agent (main input 0)
```

The `Switch` (`logic`) node's four `parameters.rules.values[]` entries (conditions checking `agent == "helper" | "research" | "media" | "poster"`) correspond positionally to its four `connections.Switch.main[0..3]` output branches. Branch order in `parameters` must match branch order in `connections` — the canvas must draw output handle *N* of the Switch node going to whatever node is listed at `connections.Switch.main[N]`.

## 4. Canvas Rendering Rules (Import Behavior)

When a flow file is imported:

1. **Create one canvas node per entry in `nodes`**, positioned at `position`, labeled with `name`, and typed/iconified according to `type` (+ `typeVersion` for parameter-shape compatibility).
2. **Populate each node's config panel** from `parameters` (and `credentials`, `webhookId`, `notes` where applicable), according to the schema for that `type`/`typeVersion`.
3. **Draw an edge for every entry in `connections`**: for source node `S`, connection type `T`, output index `i`, and each target `{ node: D, type: T, index: j }`, draw an edge from `S`'s output port `i` (of kind `T`) to `D`'s input port `j` (of kind `T`).
4. Nodes with multiple output branches (e.g. `logic`) must render one output handle per entry in `connections.<node>.main`, in array order, matching the order of the corresponding condition/rule in `parameters`.

## 5. Relation to hype-engine's Flow Engine

hype-engine's existing custom format (documented in `social-flow-builder/workflow-json-spec.md`, using `edges` with `from`/`to`/`fromOutput` and `position: {x, y}`) is superseded for *import* purposes by this n8n-derived format. Because `type` values are already hype-engine's own canonical node types (`input`, `http_request`, `ai_prompt`, `javascript`, `logic`, `publish`), each node maps directly to its runner in `services/flow/nodes/` (`input.js`, `http-request.js`, `ai-prompt.js`, `javascript.js`, `logic.js`, `publish.js`) via `getRunner(type)`. How each node's `parameters` (n8n-style) map onto each runner's expected `config` fields, and how the graph is actually executed, is defined in `Flow-run-spec.md`.

## 6. No Top-Level `trigger`

Unlike hype-engine's previous custom format (which had a separate top-level `trigger` object with its own `id`, `type: "webhook"`, `config`, and `outputSchema`), a flow file under this spec has **no top-level `trigger` key**. The workflow's entry point(s) are ordinary entries in `nodes` with `type: "input"`.

- A node is an **entry point** if its `name` never appears as a `node` target anywhere in `connections` (i.e. it has no incoming edge). In the reference file this is `"When chat message received"`.
- Trigger-specific configuration (webhook method/path, chat-trigger options, etc.) lives in that node's own `parameters` and `webhookId`, exactly like any other node — there is no separate schema for it.
- A flow file is expected to have exactly one entry-point `input` node. Validation, execution ordering, and how the inbound trigger payload is seeded into the run are described in `Flow-run-spec.md`.
