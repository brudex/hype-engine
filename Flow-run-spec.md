# Flow-run-spec: Runtime Execution Format

This document specifies how a flow file conforming to `Flow-spec.md` is **executed**: how the entry point is found, how nodes are addressed at runtime, the shape of the accumulated execution context, how `logic` nodes route between branches, how errors/skips propagate, the available run modes, and the schemas used to persist a run. It supersedes §2 of `social-flow-builder/workflow-json-spec.md` (the old `context.<node_id>.{status,output,meta,error}` format) and folds in the execution-engine concepts from `social-flow-builder/flow-builder-spec.md` §4 (Variable System), §6 (Execution Engine) and §8 (Data Model).

## 1. Addressing: `id` vs `name`

A flow file (`Flow-spec.md` §2) gives every node both:

- `id` — a stable UUID, never shown to the user, never changes after creation.
- `name` — the editable display label. `connections` and `{{ }}` / `{{$json[...]}}` expressions in `parameters` reference nodes by `name` (per `Flow-spec.md` §2-3).

At runtime, all of the following are keyed by the node's stable **`id`**, not `name`:

- The execution context (`RunContext`, §4 below).
- Persisted per-node run records (`FlowRunNode.nodeId`, see §7).

**Load-time resolution**: before execution, the engine builds a `name -> id` map from `nodes[]` and resolves every `connections` entry and every `{{ }}`/`{{$json[...]}}` reference in `parameters` from `name` to the target node's `id`. This is a pure, side-effect-free pass over the definition (it does not mutate the stored flow file). Consequences:

- Renaming a node's `name` on the canvas does not break runtime addressing, because `id` is stable — but the editor must keep `connections`/expressions in the *stored definition* in sync with the new `name` (rename-sync), since those are resolved by `name` at load time.
- Two nodes may not share the same `name` within a flow (this is the uniqueness constraint the flow builder must enforce, analogous to the `nodeId` uniqueness rule in `flow-builder-spec.md` §8).

## 2. Entry Point Resolution

Per `Flow-spec.md` §6, a flow file has no top-level `trigger`. At load time:

1. Compute the set of nodes that appear as a `node` target anywhere in `connections`.
2. The **entry point** is the node in `nodes` with `type: "input"` that is *not* in that set (no incoming edge). A flow must have exactly one such node — if zero or more than one `input` node has no incoming edge, the flow fails validation.

The entry point node is **not executed by its runner** (`services/flow/nodes/input.js`). Instead, the inbound trigger payload for this run (webhook body, manual-run payload, or schedule-firing metadata, supplied by the caller as `options.initialContext`) is written directly into the entry node's context slot before the DAG walk begins:

```js
context[entryNodeId] = {
  status: 'success',
  output: { body: <inbound payload>, ... },
  meta: { triggeredAt: '<ISO timestamp>' },
  error: null
}
```

`entryNodeId` is the entry node's `id`. Downstream nodes reference this payload the same way they reference any other node's output (e.g. `{{$json["chatInput"]}}` resolved relative to the entry node, or `{{ <entryName>.output.body.productId }}`).

## 3. Execution Model (DAG)

- The dependency graph is derived from `connections`: for source node `S` and every `{ node: D }` listed under `connections.S.main[*]`, `D` depends on `S`.
- Nodes with no dependencies other than the entry point run as soon as the entry point's context slot is populated (§2).
- A node is **ready** when every node that has an edge into it (per `connections`) has a terminal status (`success`, `error`, or `skipped`) in the context, AND at least one such edge is "active" per the branch-routing rules in §6 (for non-`logic` sources, the single `main[0]` output is always active when the source is `success`).
- All ready nodes in a given round execute in parallel (mirroring `flow-builder-spec.md` §6's "nodes with no upstream dependencies run first, in parallel").
- Execution proceeds round by round until no pending node is ready.

## 4. RunContext Object

A single object, `context`, accumulates one entry per node `id` as it completes:

```json
{
  "<entry node id>": {
    "status": "success",
    "output": { "body": { "productId": "demo-launch", "platform": "x" } },
    "meta": { "triggeredAt": "2026-05-03T01:17:32.465Z" },
    "error": null
  },
  "<node id>": {
    "status": "success | error | skipped",
    "selectedOutput": null,
    "output": { /* runner-specific */ },
    "meta": { "startedAt": "...", "finishedAt": "...", "durationMs": 0 },
    "error": null
  }
}
```

- `status` — `"success"`, `"error"`, or `"skipped"` (a node that never becomes ready because no upstream edge into it is active is recorded as `"skipped"`, never left absent).
- `output` — the runner's result object (`r.output`), or `{}`/`null` for `error`/`skipped`.
- `meta` — timing (`startedAt`, `finishedAt`, `durationMs`) plus any runner-specific metadata (e.g. `label` for `logic`, `model`/`tokensUsed` for `ai_prompt`).
- `error` — `{ message, stack }` on `error`, otherwise `null`.
- `selectedOutput` — only meaningful for `logic` nodes; see §6.

Each node's runner receives a deep snapshot of `context` as it executes (matching `flow-builder-spec.md` §6's "each node receives a deep-cloned snapshot of the current context").

## 5. Variable Resolution

- Syntax: `{{ <path> }}`, resolved against `context` (after the `name -> id` rewrite from §1), with dot/bracket deep-path access (`topics[0].name`), exactly as implemented in `services/flow/flow-variable-resolver.js`.
- n8n shorthand `{{$json[...]}}` (seen in `ai_prompt`/`logic` `parameters` in the reference file) is resolved as a reference to the **immediate predecessor node's `output`** in the connection graph — i.e. `{{$json["agent"]}}` inside node `N`'s parameters means `{{ <id of N's single upstream node>.output.agent }}`. A node with multiple upstream connections cannot use `$json` shorthand (use the explicit `{{ <name>.output... }}` form instead).
- Missing path → resolves to empty string `''` (never throws), matching `flow-builder-spec.md` §4 "Resolution Rules".
- Resolution happens immediately before each node executes, against the latest context snapshot — not at load time.

## 6. `logic` Node: Branch Evaluation & Routing

A `logic` node's `parameters.rules.values[]` is an array of n8n-style condition groups:

```json
{
  "conditions": {
    "combinator": "and" | "or",
    "options": { "caseSensitive": true, "typeValidation": "strict" },
    "conditions": [
      { "leftValue": "{{$json[\"agent\"]}}", "rightValue": "helper", "operator": { "type": "string", "operation": "equals" } }
    ]
  }
}
```

Evaluation:

1. Resolve `leftValue`/`rightValue` for every condition (§5).
2. Evaluate each `conditions.conditions[]` entry per its `operator.type`/`operation` (e.g. `string`/`equals`, `number`/`gt`, etc.).
3. Combine per-condition results with `conditions.combinator` (`"and"` = all true, `"or"` = any true).
4. Iterate `rules.values[]` **in array order**; the first entry whose combined result is `true` is the **matched branch**. Its zero-based index `i` becomes `selectedOutput` (e.g. `selectedOutput: 0`).
5. If no entry matches, `selectedOutput: null` and the node's `status` is still `"success"` (matching/non-matching is not an error).

Routing: only the edges in `connections.<name>.main[<selectedOutput>]` are **active**. Every other branch's target subtree (and anything reachable only through it) is marked `"skipped"`. If `selectedOutput: null`, all branches are skipped.

This replaces the previous `fromOutput`/`conditionId`-string matching (`canTraverseEdge` in `flow-executor.service.js`) with purely positional (index-based) routing, consistent with `Flow-spec.md` §3's requirement that `parameters.rules.values[]` order matches `connections.<node>.main[]` order.

## 7. Error & Skip Propagation

- If a node's runner throws or returns an error, its context entry is `{ status: "error", output: {}, meta: {...}, error: { message, stack } }`.
- A node downstream of an `"error"` node is marked `"skipped"` — there is no `outputs.error` port to route to in this format (unlike the old format's `fromOutput: "error"` edges; `Flow-spec.md` §3 notes every connection `type` is `"main"`).
- `"skipped"` propagates transitively: a node downstream of a `"skipped"` node is also `"skipped"`.
- Overall run status (`aggregateRunStatus`): `"success"` if every executed node succeeded; `"failed"` if every executed node errored; `"partial_failure"` if a mix of `"success"` and `"error"` occurred.

## 8. Run Modes

| Mode | Description |
|---|---|
| **Test Run** (`dryRun: true`) | Full DAG walk. `publish` nodes do not call the platform service — they return `{ published: false, dryRun: true, previewUrl: null, results: [] }` (see `services/flow/nodes/publish.js`). Every other node executes normally. |
| **Live Run** (`dryRun: false`) | Full execution, including `publish` nodes actually calling `PlatformServiceFactory`. |
| **Step Debug** | Pauses after each round of ready nodes; caller inspects `context` before resuming. (Future work — not yet implemented in `flow-executor.service.js`.) |
| **Replay** | Re-run using a previously persisted `FlowRun.initialContext` as `options.initialContext`, producing a new `FlowRun`. (Future work.) |

## 9. Persisted Schemas

### `FlowRun`

| Field | Description |
|---|---|
| `uuid` | Run identifier. |
| `workflowUuid` | Owning flow. |
| `triggerType` | `"manual" \| "webhook" \| "schedule" \| "replay"`. |
| `status` | `"running" \| "success" \| "partial_failure" \| "failed"`. |
| `startedAt` / `finishedAt` | Timestamps. |
| `initialContext` | The inbound trigger payload supplied to the run (seeds the entry node, §2). |
| `contextSnapshot` | Full `RunContext` (§4) at the end of the run. |
| `error` | `{ message }` if the run threw outside normal node error handling. |

### `FlowRunNode` (one per executed/skipped node)

| Field | Description |
|---|---|
| `runUuid` / `workflowUuid` | Owning run/flow. |
| `nodeId` | The node's stable `id` (§1). |
| `status` | `"success" \| "error" \| "skipped"`. |
| `selectedOutput` | Matched branch index for `logic` nodes (§6), else `null`. |
| `inputContext` | `RunContext` snapshot as seen by this node when it executed. |
| `output` / `meta` / `error` | As in `RunContext` (§4). |
| `startedAt` / `finishedAt` / `durationMs` | Timing. |

## 10. JavaScript Node Sandbox

`javascript` nodes (`parameters.jsCode` → `config.code`) execute in an isolated VM context:

| Capability | Status |
|---|---|
| Network access (`fetch`, `XMLHttpRequest`, `WebSocket`) | Blocked |
| File system | Blocked |
| `process` / `global` | Blocked |
| `lodash` (`_`) | Pre-imported |
| `dayjs` | Pre-imported |
| `uuid` (`{ v4 as uuidv4 }`) | Pre-imported |
| Timeout | 5000ms default, configurable up to 30000ms |
| Memory | 64MB default, hard cap |
