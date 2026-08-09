# Contributor-ready issue drafts

Prepared for Day 5 of the 30-day contributor-growth plan. These eight drafts
were approved and published as GitHub issues #10 through #17 on August 9,
2026. Each has one bounded outcome, a credential-free verification path, and
labels from the taxonomy in `docs/marketing/issue-management-standards.md`.

The published issues remain the canonical contributor-facing copies. This file
retains the reviewed source material and publication record.

## Good first issue drafts

### GFI-01 — Make calendar post cards usable with a keyboard

**Proposed labels:** `accessibility`, `area:frontend`, `good first issue`

**Context**

The month and week calendar views render previewable posts as clickable `div`
elements. Mouse users can open a post preview, but these elements are not
keyboard-focusable controls and their icon-only affordances need accessible
names.

**Suggested starting points**

- `public/scripts/app/calendar-month-view.directive.js`
- `public/scripts/app/calendar-week-view.directive.js`
- the calendar styles and existing post-preview handler reached from
  `calendarCtrl.openPostPreview(post)`

**Scope**

Replace the mouse-only post-card interaction with native semantic controls or
an equivalent accessible pattern. Preserve the existing click behavior and
visual layout. Add accessible names for icon-only controls in the affected
calendar views when they do not already have a programmatic name.

**Non-goals**

- Do not redesign the calendar or change scheduling behavior.
- Do not change the post-preview data contract.

**Acceptance criteria**

- Every interactive post card is reachable by Tab in both month and week
  views.
- Enter and Space open the same preview as mouse activation without creating
  a duplicate action.
- Focus is visible against the existing calendar card styling.
- Icon-only calendar controls have meaningful accessible names.
- Existing mouse preview and add-post interactions continue to work.

**Verification**

1. Run `npm test`.
2. Run the app locally with representative scheduled posts.
3. With only a keyboard, navigate to post cards in both calendar views and
   activate each with Enter and Space; confirm the existing preview opens.

### GFI-02 — Add an accessible input contract to `datepicker-input`

**Proposed labels:** `accessibility`, `area:frontend`, `good first issue`

**Context**

The reusable `datepicker-input` directive creates a readonly text input, but
callers cannot reliably supply an input ID or connect a visible label and
description. Its popup state is also not communicated to assistive technology.

**Suggested starting points**

- `public/scripts/app/datepicker-input.directive.js`
- templates that render `<datepicker-input>`, including post-editor views
- the bundled datepicker's show/hide lifecycle already handled by the
  directive

**Scope**

Add optional directive attributes for an input ID and label/description wiring.
Expose the datepicker's expanded state and popup relationship using suitable
ARIA attributes, keeping the existing Angular model and date format behavior.

**Non-goals**

- Do not replace or upgrade the datepicker library.
- Do not change date serialization, min/max-date semantics, or default popup
  placement.

**Acceptance criteria**

- A caller can give the generated input a stable ID and associate it with a
  label and optional description.
- The input communicates that it opens a date dialog/popup and whether it is
  expanded.
- Opening, selecting a date, pressing Escape, and hiding the picker leave the
  ARIA state accurate.
- Existing `ngModel`, min/max dates, and `on-change` behavior remain intact.

**Verification**

1. Run `npm test`.
2. Exercise an existing post-editor date picker with a keyboard: focus, open,
   select a date, press Escape, and confirm the value and popup state update.
3. Inspect the rendered input in browser developer tools to confirm label and
   ARIA relationships are present when attributes are supplied.

### GFI-03 — Add a provider-adapter contract test harness

**Proposed labels:** `testing`, `area:providers`, `good first issue`

**Context**

Hype Engine routes provider behavior through its platform-service registry,
but its provider adapters do not share root-level contract coverage. A small
mocked test harness would make adapter expectations explicit without using
real provider accounts or tokens.

**Suggested starting points**

- `services/platform/index.js`
- provider adapter modules under `services/platform/`
- `test/` (the repository's existing Node test suite)

**Scope**

Introduce a focused test helper and contract tests that verify supported
adapters expose `testCredentials` and `publishPost`. Cover safe structured
failure behavior for incomplete fixtures, including the Instagram-to-Facebook
alias. Mock all HTTP boundaries.

**Non-goals**

- Do not add or change provider credentials.
- Do not make real HTTP requests, publish content, or refactor provider
  implementation details beyond the minimum test seam.

**Acceptance criteria**

- The supported registry adapters satisfy the documented interface.
- Incomplete test fixtures produce a safe, structured failure rather than an
  uncaught exception or secret-bearing log.
- The Instagram alias resolves to the intended Facebook publishing path.
- The new tests make no network calls and pass with `npm test`.

**Verification**

1. Run `npm test` with the new tests included.
2. Confirm the tests use fakes/mocks and do not read environment provider
   tokens.
3. Run `git diff --check`.

### GFI-04 — Document the first successful Docker evaluation

**Proposed labels:** `documentation`, `area:docker`, `good first issue`

**Context**

The development guide documents Docker Compose setup and health endpoints, but
an evaluator does not have one short, reproducible checklist for confirming a
successful web, jobs, and migration run.

**Suggested starting points**

- `docs/development.md`
- `compose.yaml`
- `README.md` (only if a brief link improves discoverability)

**Scope**

Add a concise post-start verification checklist with expected health responses,
a safe migration-status check, common symptoms, and cleanup guidance. Ensure
all commands use placeholders and never instruct readers to expose secrets.

**Non-goals**

- Do not change Docker images, Compose services, or environment-variable
  defaults.
- Do not add destructive database cleanup commands.

**Acceptance criteria**

- The guide explains how to verify the web service, job service, and database
  migration state after `docker compose up`.
- Expected success output and common failure symptoms are explicit.
- Commands are consistent with `compose.yaml`, avoid secrets, and include safe
  stop/cleanup guidance.
- The Compose configuration validates successfully.

**Verification**

1. Run `docker compose config --quiet`.
2. Review each command against `compose.yaml` and `docs/development.md`.
3. Run `npm test` if a repository script or documentation fixture changes.

### GFI-05 — Add a safe development OAuth configuration matrix

**Proposed labels:** `documentation`, `area:providers`, `good first issue`

**Context**

Contributors can find per-provider OAuth code and configuration screens, but
there is no single safe reference that explains repository-defined field names,
local callback expectations, test approaches, and log-redaction requirements.

**Suggested starting points**

- `CONTRIBUTING.md`
- `docs/architecture.md`
- `services/platform/*/oauth.js`
- `public/scripts/app/oauth-connect-configuration.client.controller.js`

**Scope**

Create a contributor-facing configuration matrix for the providers already
implemented in the repository. Link to official provider documentation where
helpful, list only repository-defined field names and local prerequisites, and
describe credential-safe local tests and redaction practices.

**Non-goals**

- Do not create provider apps, request credentials, or add secrets to example
  files.
- Do not document bypasses for OAuth consent, callback validation, or provider
  policy.

**Acceptance criteria**

- Every currently supported provider has an entry with repository-defined
  settings, callback-origin prerequisites, safe local verification, and
  redaction guidance.
- Examples contain placeholders only; no real client IDs, secrets, tokens, or
  customer URLs are added.
- Provider claims and field names match the current OAuth implementations.
- The new document is linked from an appropriate contributor/development
  document.

**Verification**

1. Cross-check each matrix row against the corresponding OAuth module and UI
   configuration code.
2. Run `npm test`.
3. Run `git diff --check` and search the new documentation for accidental
   secret-like values before submitting it.

## Help wanted drafts

### HW-01 — Test scheduled-post job outcomes with fakes

**Proposed labels:** `testing`, `area:backend`, `help wanted`

**Context**

Scheduled-post cron modules make status, schedule-status, and batch-counter
transitions that are important to publishing reliability. The root test suite
currently concentrates on API contracts and release smoke checks rather than
these job outcome combinations.

**Suggested starting points**

- `job-runner/schedule-due-posts-cron.js`
- `job-runner/publish-scheduled-cron.js`
- `job-runner/publish-recurring-cron.js`
- `job-runner/lib/publish-post-accounts.js`
- `test/`

**Scope**

Add the smallest practical dependency seams and fake models/publishers needed
to cover no-due-post, all-success, partial-success, and total-failure paths.
Assert post status, schedule status, and relevant batch counters for each path.

**Non-goals**

- Do not change scheduling or retry policy unless a failing test demonstrates
  an existing defect and the maintainer agrees on the behavior.
- Do not invoke real providers, cron daemons, or database infrastructure.

**Acceptance criteria**

- Tests cover all four outcome classes for the affected scheduled/recurring
  flow.
- Assertions include final post and schedule status plus batch accounting where
  the module maintains it.
- The test suite is deterministic and makes no network calls.
- Production behavior is unchanged unless a separately documented bug fix is
  included with a regression test.

**Verification**

1. Run `npm test` twice to confirm deterministic results.
2. Confirm all provider/model boundaries in the new tests are faked.
3. Run `git diff --check`.

### HW-02 — Cover flow validation and execution edge cases

**Proposed labels:** `testing`, `area:flows`, `help wanted`

**Context**

Server-side workflow validation enforces graph rules, while flow execution
decides which reachable nodes run or are skipped. The separate flow-builder
tests do not provide equivalent server-side coverage for malformed graphs and
branch execution behavior.

**Suggested starting points**

- `services/flow/flow-workflow-validation.js`
- `services/flow/flow-executor.service.js`
- `services/flow/flow-node-executor.service.js`
- `services/flow/nodes/`
- `social-flow-builder/tests/unit/` (for existing graph examples only)
- new root tests under `test/`

**Scope**

Add table-driven server-side tests for malformed connections, duplicate IDs or
names, entry-point rules, side-channel nodes, cycles, and one valid minimum
graph. Use mock node handlers to prove non-selected branches do not execute.

**Non-goals**

- Do not alter workflow JSON semantics or the browser flow-builder UI.
- Do not execute real publish, HTTP-request, AI, or JavaScript node side
  effects in tests.

**Acceptance criteria**

- Invalid graph cases return the current structured validation outcome and do
  not throw unexpectedly.
- A valid minimum graph passes validation and executes its selected path.
- Mocked handlers demonstrate skipped branches do not run.
- Tests are isolated from external services and pass through `npm test`.

**Verification**

1. Run `npm test` twice.
2. Inspect test doubles to confirm no node can perform a real external action.
3. Run `git diff --check`.

### HW-03 — Surface safe job-server status for operators

**Proposed labels:** `enhancement`, `area:backend`, `area:docker`, `help wanted`

**Context**

The job application exposes `/jobs/status`, while job registration lives in the
job runner and Compose health checks focus on liveness. Operators need a
minimal non-sensitive view of registered jobs and schedules that does not
confuse process readiness with successful job execution.

**Suggested starting points**

- `job-app.js`
- `job-runner/index.js`
- `compose.yaml`
- `docs/development.md`
- `test/release-smoke.test.js` and new focused tests under `test/`

**Scope**

Extend the status response with non-sensitive registered job names and
schedules, clearly distinguishing service readiness from execution health.
Document the response and test its shape.

**Non-goals**

- Do not expose environment configuration, database data, credentials, job
  payloads, user data, or internal error stacks.
- Do not change endpoint authentication/access policy or claim that a job has
  successfully run when only registration is known.

**Acceptance criteria**

- `/jobs/status` returns a stable, documented shape containing readiness and
  safe registered-job metadata.
- The response cannot reveal configuration values, credentials, payloads, or
  database details.
- Tests cover the response shape and retain the existing health behavior.
- Compose configuration remains valid.

**Verification**

1. Run `npm test`.
2. Run `docker compose config --quiet`.
3. Start the job app with safe local configuration where available and inspect
   `/jobs/status`; otherwise cover the handler with a focused test.
4. Run `git diff --check`.

## Publication request

Owner approval was granted on August 9, 2026. The approved labels were created
and the drafts were published at:

- GFI-01: <https://github.com/brudex/hype-engine/issues/10>
- GFI-02: <https://github.com/brudex/hype-engine/issues/11>
- GFI-03: <https://github.com/brudex/hype-engine/issues/12>
- GFI-04: <https://github.com/brudex/hype-engine/issues/13>
- GFI-05: <https://github.com/brudex/hype-engine/issues/14>
- HW-01: <https://github.com/brudex/hype-engine/issues/15>
- HW-02: <https://github.com/brudex/hype-engine/issues/16>
- HW-03: <https://github.com/brudex/hype-engine/issues/17>
