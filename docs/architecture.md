# Hype Engine Architecture

This document gives contributors a stable map of the system. For the shared
domain vocabulary, see [`CONTEXT.md`](../CONTEXT.md).

## System shape

Hype Engine is a CommonJS Node.js application with two independently started
Express processes backed by PostgreSQL:

```text
Browser / API client
        |
        v
Web application (bin/www -> app.js)
        |
        +--> routes -> controllers -> services -> Sequelize models
        |                                      |
        +--> EJS views and public assets       v
                                         PostgreSQL
                                              ^
                                              |
Job server (bin/job-www -> job-app.js -> job-runner)
        |
        +--> scheduled publication, token refresh, cleanup, maintenance

External social platforms <--> provider adapters <--> services/controllers/jobs
```

The web application defaults to port 3000. The job server defaults to port
3001. Both load environment configuration through `dotenv` and share the
models, services, logging, and database.

## Request path

`routes/index.js` mounts the main interfaces:

| Interface | Route prefix | Primary purpose |
| --- | --- | --- |
| Public pages | `/` | Landing and informational pages |
| Authentication | `/auth` | Registration, login, logout, and callbacks |
| Public API | `/api/v1` | API-key-authenticated integrations |
| Flow API | `/api/flow` | Workflow definition and execution |
| Dashboard | `/dashboard` | Authenticated product interface |
| Admin interface | `/admin` | Operational administration |

Routes should remain thin. Controllers translate HTTP input and output.
Reusable product behavior belongs in services. Persistence belongs behind the
Sequelize models.

## Persistence

Model factories live in `models/` and are loaded dynamically by
`models/index.js`. Associations are registered after all model factories have
loaded.

Schema changes are applied by the versioned migration runner before either
server starts. Applied migrations are recorded in `schema_migrations`, and a
PostgreSQL advisory lock serializes concurrent startup. Contributors should add
ordered migration files under `migrations/` and must not add implicit schema
mutation to request or job paths.

Important persistence groups include:

- Identity and access: users, sessions, API keys, projects.
- Social connections: accounts, OAuth configuration, services.
- Content: posts, post accounts, histories, versions, media, tags, calendars.
- Reporting: metrics, audiences, and platform insights.
- Workflows: workflows, workflow versions, runs, and trigger events.
- Operations: job batches, logs, and settings.

## Social platform adapters

Platform-specific behavior lives under `services/platform/<platform>/`. The
index, OAuth, and operational modules together translate Hype Engine concepts
into provider-specific behavior.

New platform work should:

1. Keep provider request/response details inside the adapter.
2. Return Hype Engine domain results to callers.
3. Avoid logging authorization material.
4. Make retry and partial-failure behavior explicit.
5. Add tests at the adapter interface rather than coupling tests to internal
   helper functions.

Some older provider-oriented modules also exist directly under `services/`.
New code should prefer the platform adapter structure and migrate legacy paths
deliberately rather than creating a third convention.

## Post scheduling and publication

The web process creates and edits posts and schedules. The job server registers
cron jobs from `job-runner/index.js` to:

- identify due scheduled and recurring posts;
- publish eligible post accounts;
- refresh provider tokens;
- clean up logs; and
- perform database maintenance.

Publication is externally visible and should be treated as an idempotent job.
Changes in this area must consider retries, partial success across accounts,
provider rate limits, and crash recovery.

## Workflow execution

`services/flow/index.js` is the public workflow execution entry point for
controllers, jobs, and future webhook triggers.

The workflow module is divided into:

- definition normalization and persistence;
- workflow validation;
- variable resolution;
- graph execution;
- single-node execution; and
- node-type implementations under `services/flow/nodes/`.

Callers should use the flow module's public entry point instead of importing
node implementations directly. This keeps the execution interface small and
makes workflow behavior testable through the same interface used in
production.

The Vue flow builder is developed in `social-flow-builder/`. Its distributable
assets are consumed by the main application from `public/modules/flow-builder/`.
The builder has its own package and test commands.

## Authentication and authorization

Browser authentication uses Passport and an Express session. Public API routes
use API credentials through dedicated middleware. Flow and admin routes have
their own authorization middleware.

Authorization checks must enforce both identity and ownership. Being
authenticated is not sufficient when accessing a project, account, post,
workflow, or run.

## Configuration and secrets

Configuration is read from `config/config.js` and the environment. Required
values currently include database connection fields, the canonical site URL,
and `JWT_SECRET`.

Secrets must not be committed, logged, placed in client assets, or given
functional default values. See
[`docs/security/secret-audit.md`](security/secret-audit.md) for the current
audit and release gates.

## Logging and observability

Application logging is centralized under `utils/logger.js`, with an optional
database transport. Log messages may include identifiers useful for tracing,
but must not include passwords, OAuth tokens, API keys, session material, or
post content unless explicitly redacted.

The job server exposes `/health` and `/jobs/status`. These endpoints should be
protected or restricted appropriately when the job server is network-accessible.

## Architectural direction

Contributors should optimize for:

- **Locality:** behavior and its rules should be understandable without
  bouncing through unrelated modules.
- **Stable interfaces:** controllers and jobs should depend on narrow service
  entry points.
- **Explicit side effects:** database writes, publication, network calls, and
  scheduling must be visible at the interface.
- **Testable seams:** platform adapters, workflow execution, and publication
  jobs should be testable without contacting real providers.
- **One domain language:** use the terms in `CONTEXT.md` consistently.

## Recording decisions

Long-lived architectural decisions should be recorded under `docs/adr/` using
short numbered Markdown files. Each record should state the context, decision,
consequences, and status. ADRs should explain constraints and tradeoffs rather
than restating implementation details.
