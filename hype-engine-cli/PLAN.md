# HypeEngine CLI implementation plan

## Status and scope

This directory currently contains planning documentation only. No CLI implementation
code has been added.

The CLI is intended primarily for AI agents and unattended automation. It will call
HypeEngine's HTTP API rather than access the database or social-provider APIs
directly. It will use the same core stack and conventions as HypeEngine:

- Node.js 24
- CommonJS (`require`, `module.exports`)
- Axios for HTTP
- Joi for input and configuration validation
- Commander for command parsing (promote it from the root lockfile's transitive
  dependency to a direct CLI dependency)
- Node's built-in test runner

Working binary name in this plan: `hype-engine`.

## Repository findings

### Existing API coverage

The Postman collection at
`public/download/postman/HypeEngine-API-v1.postman_collection.json` matches the
routes mounted at `/api/v1` in `routes/api-v1.routes.js`.

| CLI requirement | Existing API | Readiness |
| --- | --- | --- |
| Discover projects | `GET /api/v1/projects` and `GET /api/v1/projects/:projectUuid` | Usable; results honor API-key project scope and user ownership |
| Get connected accounts | `GET /api/v1/:projectUuid/accounts` | Scope-aware, but the list route still needs an ownership lookup for all-project keys |
| Upload media | `POST /api/v1/media` using multipart field `file` or `files[]` | Usable; optional `name`, 200 MB request limit, user-scoped library |
| Create a post for selected accounts | `POST /api/v1/:projectUuid/posts` | Usable; strict Joi validation, reference checks, and transactional writes are implemented |
| One-time schedule | Create with `date` and `time`, or `POST .../:postUuid/schedule` with `scheduled_at` | Usable; the dedicated schedule route accepts a future ISO-8601 timestamp |
| Recurring schedule | Create/update using `recurringType`, `recurringDays`, `recurringTime`, and `recurringEndAt` | Usable; daily/weekly recurrence is interpreted in UTC |
| Immediate publish | Job runner can publish scheduled work | Not exposed by API v1; `posts publish` is blocked |
| Inspect publish result/history | Post list/get return status; `GET /api/v1/:projectUuid/posts/:postUuid/history` returns per-account attempts | Available |

The job server must be running for scheduled and recurring posts to publish.

API v1 rejects unknown post fields. The CLI payload builder must use the exact
camelCase write contract and must not send the snake_case response names back to
create/update endpoints.

### Authentication decision

Reuse the Postman authentication mechanism: an API key sent as
`Authorization: Bearer <token>`. The middleware in
`middlewares/api-v1.auth.middleware.js` already validates an active API key,
loads its user, and updates `lastUsedAt`. Session authentication from
`middlewares/auth.middleware.js` is not suitable for a CLI.

Project scope enforcement is now implemented through
`middlewares/api-v1.project-scope.middleware.js`. An API key with
`allProjects: true` can use all projects owned by its user; otherwise only UUIDs
in `scopes.projects` are permitted. Project listings are filtered to the
effective scope, and inaccessible scoped resources return `404`.

The remaining authentication and authorization work is:

1. `GET /api/v1/:projectUuid/accounts` must load the user-owned project before
   listing accounts. The scope middleware alone is insufficient for an
   `allProjects` key supplied with another user's project UUID.
2. Media is user-scoped, so a project-restricted token currently still sees all
   media belonging to that user. Decide explicitly whether this is acceptable.
   Recommended: keep media user-scoped for v1 and document it, then introduce
   media-specific permissions if finer isolation becomes necessary.
3. API keys are stored in plaintext in the database. Plan a separate server
   hardening task to store only a keyed hash or secure digest while showing the
   plaintext token once at creation.

The authenticated identity endpoint proposed for CLI verification does not yet
exist:

`GET /api/v1/auth/me`

It should return API-key identity, user identity, effective project scopes, and
API version, without returning the token. The CLI will use it for
`auth check` and configuration validation.

## Backend API status and remaining work

Do not block available CLI commands on unrelated future API work. Gate only the
commands that depend on missing routes.

### 1. Project authorization — mostly complete

The reusable scope guard is applied to project-scoped get/account/tag/post
routes, and project list results are filtered. Ownership checks also exist in
the project and post controllers.

Remaining: add an ownership check to the account list route before querying
accounts. Keep the existing `404` behavior for inaccessible projects.

### 2. Atomic post validation — complete for API v1

Create/update now use strict Joi schemas, reject unknown fields, validate
project accounts/tags and user-owned media, require active and authorized
accounts for scheduled work, and write post associations transactionally.
Media/provider compatibility validation is intentionally not part of v1.

The implemented recurring write shape is:

```json
{
  "recurringType": 2,
  "recurringDays": ["MON", "FRI"],
  "recurringTime": "14:30",
  "recurringEndAt": "2026-12-31T23:59:59Z"
}
```

`recurringType` is `0` for one-time, `1` for daily, and `2` for weekly.
Weekly days use `MON` through `SUN`. The server does not accept or store an IANA
timezone: `recurringTime` is UTC. The CLI may accept `--timezone` for usability,
but it must convert the requested local wall time to UTC before sending this
payload and warn that daylight-saving wall-clock stability is not represented
by the current server contract.

### 3. Publish and history — history complete, publish missing

History is implemented at:

`GET /api/v1/:projectUuid/posts/:postUuid/history`

It returns paginated per-account history with provider post IDs and sanitized
metadata.

Immediate publishing still requires a new asynchronous endpoint:

`POST /api/v1/:projectUuid/posts/:postUuid/publish`

It should return `202 Accepted` and enqueue work through the real job publishing
path. Until it exists, omit or clearly mark `posts publish` and `--publish-now`
as unavailable in the first CLI implementation.

### 4. Automation retry safety — partially complete

`Idempotency-Key` is implemented for media upload, post creation, and one-time
scheduling. Records are scoped by user, API key, method, path, and key with a
24-hour expiry. A completed retry replays the response; payload reuse conflicts
return `409`.

Add the same middleware to immediate publish if that endpoint is implemented.

### 5. API contract documentation — current for implemented routes

The Postman collection documents project scopes, strict post validation,
recurring UTC fields, post history, idempotent writes, optional media `name`,
and the 200 MB upload limit. It intentionally does not advertise `/auth/me` or
immediate publish because those routes are not implemented.

## CLI architecture

Keep the CLI in this directory as its own publishable package, without loading
the web application's models or configuration at runtime.

Planned layout:

```text
hype-engine-cli/
  bin/
    hype-engine.js
  src/
    cli.js
    commands/
      auth.js
      config.js
      projects.js
      accounts.js
      media.js
      posts.js
    config/
      config-store.js
      schema.js
    http/
      api-client.js
      errors.js
      multipart.js
    domain/
      account-selector.js
      post-payload.js
      schedule.js
    output/
      formatter.js
      json.js
      table.js
    utils/
      exit-codes.js
      stdin.js
  test/
  package.json
  README.md
```

Responsibilities:

- command modules parse flags and call domain functions;
- domain modules resolve project/account selectors and build validated API
  payloads;
- one Axios client handles URL construction, Bearer auth, timeouts, errors,
  request IDs, retries, and idempotency keys;
- output modules keep stdout machine-readable and send diagnostics to stderr;
- config storage owns project selection and secret handling.

## Multiple-project configuration

Use one global HypeEngine base URL and a map of named project credentials. Each
project entry contains its project UUID and its own API key, used as the Postman
collection uses it:

`Authorization: Bearer <project-api-key>`

The project name (for example, `acme`) is a local CLI alias so users and agents
do not need to repeatedly pass a UUID. It does not have to match the project's
display name in HypeEngine.

Conceptual configuration (the exact serialization is an implementation detail):

```json
{
  "version": 1,
  "baseUrl": "https://social.example.com",
  "currentProject": "acme",
  "timeoutMs": 30000,
  "projects": {
    "acme": {
      "projectUuid": "project-uuid",
      "apiKey": "hypengn-acme-api-key"
    },
    "personal": {
      "projectUuid": "another-project-uuid",
      "apiKey": "hypengn-personal-api-key"
    }
  }
}
```

`currentProject` means the locally selected default project. In this example,
commands that omit `--project` use the `acme` entry, its project UUID, and its API
key. It does not change anything on the HypeEngine server. Running
`hype-engine project use personal` changes this field to `personal`.

Precedence:

1. command flags;
2. `HYPE_ENGINE_*` environment variables;
3. selected project entry and its API key;
4. safe defaults.

Default config location follows the platform convention, with
`HYPE_ENGINE_CONFIG` as an override. On Unix, use
`$XDG_CONFIG_HOME/hype-engine/config.json` or
`$HOME/.config/hype-engine/config.json`.

Secret policy:

- store each project's API key directly in the config file;
- create the config directory with mode `0700` and the config file with mode
  `0600` on Unix-like systems;
- refuse to use a config file with unsafe permissions unless the user explicitly
  repairs or overrides the check;
- clearly document that the config file is sensitive, must not be committed,
  uploaded, logged, or shared;
- never print tokens in normal output, errors, debug logs, or `config list`;
- reject config directories/files that are broadly writable where practical;
- do not accept tokens as positional arguments because shell history and process
  listings can expose them;
- accept an API key through a masked interactive prompt or `--api-key-stdin`, then
  write it directly into the protected config file.

## Command surface

All commands accept `--project`, `--output json|table`, `--timeout`, and
`--no-color` where relevant. `--project` selects a configured project alias. For
commands that operate on a project, the CLI obtains both the UUID and API key
from that entry.

### Configuration and authentication

```text
hype-engine config set-server --base-url <url>
hype-engine config list
hype-engine config show
hype-engine project add <alias> --uuid <uuid> --api-key-stdin
hype-engine project use <alias>
hype-engine project list
hype-engine project show [<alias>]
hype-engine project remove <alias> --yes
hype-engine auth check [--project <alias>]
```

Until `/auth/me` exists, `project add` verifies credentials and project access
with `GET /api/v1/projects/:projectUuid`. A future `/auth/me` call can add
identity and effective-scope diagnostics without changing the config format.

### Projects and accounts

```text
hype-engine projects list
hype-engine projects get <project>
hype-engine accounts list [--provider x|twitter|linkedin|facebook|instagram]
hype-engine accounts get <account>
```

Normalize aliases at the CLI boundary: `x` and `twitter` map to the API's
canonical provider value. Output retains the server provider value.

Account selection for post commands:

- `--account <uuid>` may be repeated;
- `--provider <name>` may be repeated and selects all matching connected,
  authorized, active accounts in the project;
- `--all-accounts` selects all eligible accounts;
- those three selection modes are mutually exclusive;
- ambiguous provider selection is intentional (all eligible accounts for that
  provider), while names/usernames must never be guessed.

### Media

```text
hype-engine media upload <path>... [--name <name>]
hype-engine media list [--page <n>] [--limit <n>]
hype-engine media get <media-uuid>
```

Upload returns media UUIDs suitable for `posts create --media`. Validate file
existence/readability locally and use streaming multipart uploads where supported
instead of loading a 200 MB file into memory.

### Posts

```text
hype-engine posts create --text <text> <account-selection> [--media <uuid>...]
hype-engine posts create --text-file <path|-> <account-selection> [--media <uuid>...]
hype-engine posts get <post-uuid>
hype-engine posts list [--status draft|scheduled|published|failed]
hype-engine posts history <post-uuid>
```

`posts create` creates a draft unless a publish or schedule option is supplied:

- `--schedule-at <ISO-8601>`;
- `--daily-at <HH:mm> [--timezone <IANA>] [--ends-at <ISO-8601>]`;
- `--weekly-on <MON,TUE,...> --at <HH:mm> [--timezone <IANA>] [--ends-at <ISO-8601>]`.

These modes are mutually exclusive. Require an explicit offset in
`--schedule-at`, or combine local time with an explicit `--timezone`.
Convert recurring local times to the UTC `recurringTime` expected by API v1.
Document that the current API stores only UTC time and therefore cannot preserve
the same local wall-clock time across daylight-saving changes.

Add `posts publish` and `--publish-now` only after the asynchronous API v1
publish route is implemented.

Support per-account variants without an unwieldy flag grammar through
`--input <post.json>` (or `--input -` for stdin). The file/stdin schema mirrors
the stable API payload and enables agents to supply original and account-specific
content deterministically.

For convenience, local media paths may later be accepted by `posts create` as a
composed workflow (upload, then create), but implement this only after the basic
media and posts commands are reliable. If one upload fails, do not create the
post.

## Agent-oriented interface contract

Machine behavior is a product requirement, not an optional formatter:

- JSON is the default when stdout is not a TTY; table/human output is the default
  only for an interactive terminal.
- `--output json` always emits exactly one JSON document to stdout.
- logs, progress, warnings, and retry messages go to stderr.
- `--quiet` suppresses non-error stderr output.
- no command prompts in non-TTY mode.
- destructive operations require `--yes` in non-TTY mode.
- accept text and complete post documents from stdin.
- stable top-level envelope:
  `{ "ok": true, "data": ..., "meta": { "requestId": ... } }` or
  `{ "ok": false, "error": { "code": ..., "message": ..., "details": ... } }`.
- preserve API request/correlation IDs.
- redact Authorization headers and token-like values from every error.
- define stable exit codes:
  `0` success, `2` usage/validation, `3` config, `4` authentication,
  `5` authorization/not found, `6` conflict, `7` network/timeout,
  `8` server failure, and `9` partial publish failure.
- retry only safe reads and idempotent writes, with bounded exponential backoff
  and jitter; honor `Retry-After`.
- add `--wait` and `--wait-timeout` to publish flows once immediate publishing
  exists; history can already be queried explicitly for completed scheduled
  occurrences.

## Delivery phases

### Phase 0: API contract and security

Completed:

- API-key project scope enforcement and filtered project discovery;
- strict API v1 post/schedule validation and transactional writes;
- UTC daily/weekly recurring schedule fields;
- post-history endpoint with sanitized metadata;
- idempotency for upload, create, and one-time schedule;
- updated Postman collection and focused API contract tests.

Remaining:

1. Add account-list project ownership enforcement.
2. Add `/auth/me` (helpful, but not required to start the CLI).
3. Add asynchronous immediate publish and apply idempotency to it.

The CLI foundation, discovery, media, draft creation, one-time scheduling,
recurring scheduling, and history commands can proceed before items 2 and 3.
Do not ship immediate-publish commands until item 3 is complete.

### Phase 1: CLI foundation

1. Initialize the standalone CommonJS package and executable.
2. Implement the global server config, named project credentials, protected
   direct API-key storage, and config permission checks.
3. Implement the Axios client, error normalization, output envelope, and exit
   codes.
4. Add mock-server contract tests.

Exit criterion: `config`, `auth check`, and a generic authenticated request work
without leaking credentials.

### Phase 2: Discovery and media

1. Implement projects and accounts commands.
2. Implement deterministic provider/account selection.
3. Implement media upload/list/get with multipart progress only on TTY.

Exit criterion: an agent can select a configured project, resolve eligible
accounts, upload media, and receive stable JSON UUIDs.

### Phase 3: Posting and scheduling

1. Implement draft creation and per-account variants.
2. Implement one-time, daily, and weekly schedules using the exact API v1 field
   names and UTC recurrence semantics.
3. Implement get/list/history.
4. Add immediate publish and optional polling after its backend route exists.
5. Add composed local-media posting after the primitives pass.

Exit criterion: every API-supported posting flow works against a local
HypeEngine instance and reports per-account history; immediate publishing has a
separate backend-dependent release gate.

### Phase 4: packaging and agent readiness

1. Add command reference, examples, JSON schemas, and shell completion.
2. Test installation through `npm link` and packaged tarball.
3. Test Linux and macOS config permissions and Node 24.
4. Add end-to-end smoke tests against HypeEngine plus its job server.
5. Freeze the command/output contract before creating AI skills.

Exit criterion: an AI agent can discover commands via `--help`, operate entirely
with JSON/stdin, retry safely, and determine final or partial post outcomes.

## Verification plan

### Backend

- authentication: missing, malformed, inactive, and valid tokens;
- authorization: all-project and allow-listed keys across every project route;
- account route cannot access another user's or out-of-scope project;
- media ownership validation for post payloads;
- invalid/cross-project account UUID causes a full rollback;
- one-time scheduling with a future ISO-8601 timestamp;
- daily and weekly UTC recurrence, including end date;
- partial provider failure appears in history;
- repeated idempotency key produces only one upload, post, or schedule action;
- after the publish route is added, immediate publish returns `202`, runs through
  the job server, and is idempotent.

### CLI unit and contract tests

- config precedence and current-project switching;
- token redaction and file permissions;
- account/provider selection including `x`/`twitter`;
- payload construction for original and per-account versions;
- schedule parsing across timezone and daylight-saving boundaries;
- multipart upload;
- response/error normalization and exit codes;
- TTY versus non-TTY output;
- stdin operation and absence of prompts;
- retry rules and idempotency headers.

### End-to-end smoke scenarios

1. Configure one HypeEngine base URL and two projects with different API keys.
2. Prove each project key sees only its permitted project/accounts.
3. Upload an image and create a Facebook + Instagram draft.
4. Schedule a one-time X + LinkedIn post and inspect its history.
5. Schedule daily and weekly recurring posts and verify the job runner sees them.
6. Retry a timed-out media upload, post creation, and schedule request and prove
   no duplicate resource or transition occurs.
7. After the publish API exists, publish immediately and poll account results.

Use provider test/sandbox accounts where available. Never run automated smoke
tests against real production social accounts without an explicit opt-in.

## Decisions to lock before implementation

Recommended defaults are included so implementation can proceed without blocking:

- package/binary name: `hype-engine`;
- config model: one global base URL with named project UUID/API-key entries and
  one locally selected current project;
- machine output: automatic JSON for non-TTY, overridable with `--output`;
- immediate publishing: deferred until an asynchronous API v1 route exists;
- recurrence: expose IANA timezone flags in the CLI, convert to UTC client-side,
  and clearly document the server's daylight-saving limitation;
- provider selection: all eligible accounts matching each requested provider;
- scoped-token media behavior: retain current user-level media scope for API v1,
  clearly documented;
- initial supported recurring types: daily and weekly, matching the current model
  and job runner.

Monthly/custom cron recurrence, social-account connection/OAuth from the CLI,
analytics, and AI skills are intentionally outside the first CLI release.
