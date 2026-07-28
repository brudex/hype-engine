# Hype Engine Domain Language

This glossary defines the terms contributors should use in code,
documentation, issues, and pull requests.

## Core concepts

**User**
: A person authenticated with Hype Engine. A user owns projects, accounts,
  posts, workflows, and API credentials.

**Project**
: A workspace that groups social accounts, posts, tags, calendars, and related
  activity. Project isolation is an authorization boundary.

**Account**
: A connection between a Hype Engine user and an identity on a social
  platform. An account stores the provider identity and authorization material
  needed for platform operations.

**Platform**
: An external social network supported through an adapter under
  `services/platform/`, such as Facebook, Instagram, LinkedIn, Mastodon,
  TikTok, or X/Twitter.

**Provider adapter**
: The module that translates Hype Engine operations into a platform's OAuth,
  publishing, and account-management behavior.

**Post**
: Content authored in Hype Engine for publication to one or more accounts. A
  post can be immediate, scheduled, recurring, imported, or versioned.

**Post account**
: The delivery-specific association between a post and one target account. It
  carries per-destination publication state.

**Schedule**
: The time and recurrence rules that determine when a post becomes eligible
  for publication.

**Publication**
: An attempt to deliver a post account to its external platform.

**Job server**
: The independently started process that registers scheduled jobs and performs
  background publication, token-refresh, cleanup, and maintenance work.

## Workflow concepts

**Workflow**
: A user-owned, versionable definition of connected nodes that transforms
  input and may produce side effects such as publishing.

**Workflow definition**
: The canonical JSON representation of a workflow's nodes, connections,
  trigger, and configuration.

**Workflow version**
: An immutable saved definition associated with a workflow.

**Node**
: One executable step in a workflow. Node types include input, HTTP request,
  prompt, JavaScript, logic, and publish.

**Connection**
: A directed edge declaring that one node's result is available to a
  downstream node.

**Workflow run**
: One execution of a workflow definition, including its status, timestamps,
  node results, and failure information.

**Execution context**
: The values available to a node, including initial input and upstream node
  results.

**Dry run**
: An execution mode that evaluates behavior without performing external side
  effects where the node supports it.

## Interface concepts

**Web application**
: The Express/EJS process started by `bin/www`. It serves browser pages,
  session-authenticated routes, and HTTP APIs.

**Public API**
: Versioned routes under `/api/v1`, authenticated with Hype Engine API
  credentials.

**Flow API**
: Workflow-management and execution routes under `/api/flow`.

**Dashboard**
: The authenticated browser interface under `/dashboard`.

**Admin interface**
: Privileged operational routes under `/admin`.

## Invariants

- A user or project must never read or mutate another tenant's data.
- Authorization material must never be logged or returned to the browser.
- A publication must be safe to retry without creating unintended duplicates.
- A workflow run uses a stable definition; later edits must not change its
  historical meaning.
- Background work must be observable and must record failures without exposing
  secrets.
