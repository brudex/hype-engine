# Workflow JSON — Superseded

> **This document is superseded.** The declarative workflow format below (`trigger` / `nodes[].config` / `edges[].fromOutput`) and the `context.<node_id>.{...}` runtime format have both been replaced:
>
> - **Definition format** → `hype-engine/Flow-spec.md` (`{ nodes, connections, pinData, meta }`, n8n-compatible, **no top-level `trigger`** — see its §6).
> - **Runtime format** → `hype-engine/Flow-run-spec.md` (`RunContext` keyed by node **`id`**, entry-point resolution, `logic` branch routing by index, run modes, persisted schemas).
>
> This file is kept only as a **worked example** showing the same "Social Trend Caption Workflow" translated from the old format into the new one, for anyone migrating existing flows.

## Old format (for migration reference only)

The previous declarative format used a top-level `trigger` object, `nodes[].config`, and `edges[]` with `from`/`to`/`fromOutput`:

```json
{
  "id": "social_trend_caption_workflow",
  "name": "Social Trend Caption Workflow",
  "version": "1.0.0",

  "trigger": {
    "id": "trigger_1",
    "type": "webhook",
    "name": "Product Launch Trigger",
    "config": { "method": "POST", "path": "/launch" },
    "outputSchema": { "productId": "string", "platform": "string" }
  },

  "nodes": [
    {
      "id": "fetch_trends",
      "type": "rest",
      "name": "Fetch Trends",
      "position": { "x": 120, "y": 220 },
      "config": {
        "method": "GET",
        "url": "https://api.example.com/trends",
        "headers": { "content-type": "application/json" },
        "query": { "productId": "{{ trigger.body.productId }}" }
      }
    },
    {
      "id": "check_length",
      "type": "logic",
      "name": "Check Trend Length",
      "position": { "x": 120, "y": 40 },
      "config": {
        "conditions": [
          { "id": "has_topics", "label": "Has topics", "expression": "{{ fetch_trends.result.topics.length > 0 }}" },
          { "id": "no_topics", "label": "No topics", "expression": "{{ fetch_trends.result.topics.length === 0 }}" }
        ]
      }
    },
    {
      "id": "write_caption",
      "type": "ai_prompt",
      "name": "Write Caption",
      "position": { "x": 280, "y": 420 },
      "config": {
        "model": "gpt-5.5",
        "prompt": "Write a short social caption for this trend: {{ fetch_trends.result.topics[0].name }}",
        "temperature": 0.7,
        "maxTokens": 300
      }
    },
    {
      "id": "format_output",
      "type": "javascript",
      "name": "Format Output",
      "position": { "x": 560, "y": 420 },
      "config": {
        "code": "return { caption: input.write_caption.result.text, hashtags: '#Launch #SocialOps' };"
      }
    },
    {
      "id": "publish_post",
      "type": "publish",
      "name": "Publish Post",
      "position": { "x": 840, "y": 420 },
      "config": {
        "platform": "{{ trigger.body.platform }}",
        "caption": "{{ format_output.result.caption }}",
        "hashtags": "{{ format_output.result.hashtags }}",
        "dryRun": true
      }
    }
  ],

  "edges": [
    { "from": "trigger_1", "fromOutput": "success", "to": "fetch_trends" },
    { "from": "fetch_trends", "fromOutput": "success", "to": "check_length" },
    { "from": "check_length", "fromOutput": "has_topics", "to": "write_caption" },
    { "from": "write_caption", "fromOutput": "success", "to": "format_output" },
    { "from": "format_output", "fromOutput": "success", "to": "publish_post" }
  ]
}
```

## New format — same workflow under `Flow-spec.md`

```json
{
  "nodes": [
    {
      "id": "trigger_1",
      "name": "Product Launch Trigger",
      "type": "input",
      "typeVersion": 1,
      "position": [120, -160],
      "parameters": {
        "triggerType": "webhook",
        "method": "POST",
        "path": "/launch"
      },
      "webhookId": "launch-webhook"
    },
    {
      "id": "fetch_trends",
      "name": "Fetch Trends",
      "type": "http_request",
      "typeVersion": 1,
      "position": [120, 220],
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com/trends",
        "headers": { "content-type": "application/json" },
        "query": { "productId": "{{$json[\"productId\"]}}" }
      }
    },
    {
      "id": "check_length",
      "name": "Check Trend Length",
      "type": "logic",
      "typeVersion": 3.2,
      "position": [380, 220],
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "combinator": "and",
                "conditions": [
                  {
                    "leftValue": "={{$json[\"topics\"].length}}",
                    "rightValue": 0,
                    "operator": { "type": "number", "operation": "gt" }
                  }
                ]
              }
            },
            {
              "conditions": {
                "combinator": "and",
                "conditions": [
                  {
                    "leftValue": "={{$json[\"topics\"].length}}",
                    "rightValue": 0,
                    "operator": { "type": "number", "operation": "equals" }
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      "id": "write_caption",
      "name": "Write Caption",
      "type": "ai_prompt",
      "typeVersion": 1,
      "position": [640, 120],
      "parameters": {
        "model": "gpt-5.5",
        "userPrompt": "Write a short social caption for this trend: {{$json[\"topics\"][0][\"name\"]}}",
        "temperature": 0.7,
        "maxTokens": 300
      }
    },
    {
      "id": "format_output",
      "name": "Format Output",
      "type": "javascript",
      "typeVersion": 2,
      "position": [900, 120],
      "parameters": {
        "jsCode": "return { caption: $input.first().json.text, hashtags: '#Launch #SocialOps' };"
      }
    },
    {
      "id": "publish_post",
      "name": "Publish Post",
      "type": "publish",
      "typeVersion": 1,
      "position": [1160, 120],
      "parameters": {
        "projectUuid": "{{ \"Product Launch Trigger\".output.body.projectUuid }}",
        "accountUuids": ["{{ \"Product Launch Trigger\".output.body.accountUuid }}"],
        "content": "{{$json[\"caption\"]}} {{$json[\"hashtags\"]}}",
        "media": []
      }
    }
  ],

  "connections": {
    "Product Launch Trigger": {
      "main": [
        [ { "node": "Fetch Trends", "type": "main", "index": 0 } ]
      ]
    },
    "Fetch Trends": {
      "main": [
        [ { "node": "Check Trend Length", "type": "main", "index": 0 } ]
      ]
    },
    "Check Trend Length": {
      "main": [
        [ { "node": "Write Caption", "type": "main", "index": 0 } ],
        []
      ]
    },
    "Write Caption": {
      "main": [
        [ { "node": "Format Output", "type": "main", "index": 0 } ]
      ]
    },
    "Format Output": {
      "main": [
        [ { "node": "Publish Post", "type": "main", "index": 0 } ]
      ]
    }
  },

  "pinData": {},
  "meta": {}
}
```

Notes on the translation:

- The old `trigger` object becomes an ordinary `nodes[]` entry with `type: "input"` (`Flow-spec.md` §6). It's the entry point because no `connections` entry targets `"Product Launch Trigger"`.
- `edges[].fromOutput` named branches (`"has_topics"`/`"no_topics"`) become **positional**: `Check Trend Length`'s `parameters.rules.values[0]` (has topics) and `values[1]` (no topics) correspond to `connections["Check Trend Length"].main[0]` and `main[1]`. The `no_topics` branch has no downstream node, so `main[1]` is `[]`.
- `{{ fetch_trends.result.topics[0].name }}` (old, addressed by node `id`) becomes `{{$json["topics"][0]["name"]}}` (new, n8n shorthand for "immediate upstream node's `output`") since `Write Caption`'s only input is `Fetch Trends`.
- `{{ format_output.result.caption }}` becomes `{{$json["caption"]}}` for the same reason (`Publish Post`'s only input is `Format Output`).
- `{{ trigger.body.platform }}` becomes `{{ "Product Launch Trigger".output.body.platform }}` — addressed by the entry node's `name`, since `Publish Post` does not have the trigger as its *immediate* upstream node (so `$json` shorthand doesn't apply).
- The old per-node `config` object is now `parameters` (n8n-shaped); `config.code` → `parameters.jsCode`, `config.dryRun`/`config.platform`/`config.caption`/`config.hashtags` → `parameters.projectUuid`/`accountUuids`/`content`/`media` (dry-run is now a run-mode flag, not per-node config — see `Flow-run-spec.md` §8).

## Runtime output — same example, new `RunContext` format

```json
{
  "runId": "run_01HX9QK",
  "workflowId": "social_trend_caption_workflow",
  "status": "success",
  "startedAt": "2026-05-03T01:17:32.465Z",
  "finishedAt": "2026-05-03T01:17:35.221Z",

  "context": {
    "trigger_1": {
      "status": "success",
      "output": { "body": { "productId": "demo-launch", "platform": "x" } },
      "meta": { "triggeredAt": "2026-05-03T01:17:32.465Z" },
      "error": null
    },

    "fetch_trends": {
      "status": "success",
      "output": {
        "topics": [{ "name": "Summer Drops", "score": 97 }],
        "items": [{ "title": "Summer Drops trend report", "engagement": "high" }]
      },
      "meta": { "statusCode": 200, "durationMs": 421 },
      "error": null
    },

    "check_length": {
      "status": "success",
      "selectedOutput": 0,
      "output": { "matched": true },
      "meta": { "durationMs": 12 },
      "error": null
    },

    "write_caption": {
      "status": "success",
      "output": {
        "text": "Fresh angle: Summer Drops are taking over. Launch smarter with trend-backed content.",
        "variants": ["Fresh angle: Summer Drops are taking over. Launch smarter with trend-backed content."]
      },
      "meta": { "model": "gpt-5.5", "tokensUsed": 214, "durationMs": 1180 },
      "error": null
    },

    "format_output": {
      "status": "success",
      "output": {
        "caption": "Fresh angle: Summer Drops are taking over. Launch smarter with trend-backed content.",
        "hashtags": "#Launch #SocialOps"
      },
      "meta": { "durationMs": 18 },
      "error": null
    },

    "publish_post": {
      "status": "success",
      "output": { "published": false, "dryRun": true, "results": [] },
      "meta": { "durationMs": 230 },
      "error": null
    }
  }
}
```

Key differences from the old runtime format:

- `context` is keyed by node **`id`** (unchanged from before), but `id` is now always a stable UUID-or-slug independent of the `name` used in `connections`/expressions (`Flow-run-spec.md` §1).
- `trigger_1` (the entry node) is present in `context` like any other node — there is no separate `context.trigger` key.
- `check_length`'s `selectedOutput` is now the **branch index** (`0`), not a condition id string (`"has_topics"`).
- `publish_post.output` no longer has `previewUrl`; dry-run publish returns `{ published: false, dryRun: true, results: [] }` per `services/flow/nodes/publish.js`.

For the canonical schema (field meanings, error/skip propagation, run modes, persisted `FlowRun`/`FlowRunNode` records), see `hype-engine/Flow-run-spec.md`.
