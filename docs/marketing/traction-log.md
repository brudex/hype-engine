# Hype Engine contributor-growth traction log

## 2026-07-28 — Day 1: Baseline audit

**Work completed**

- Audited the public GitHub repository and the local contributor funnel.
- Established the campaign baseline: 0 stars, 0 forks, 0 watchers/subscribers,
  0 topics, 0 GitHub releases, no local Git tags, and GitHub Discussions
  disabled.
- Confirmed that GitHub reports 5 open items, all of which are pull requests
  (#2–#6); there are 0 non-pull-request open issues.
- Reviewed the README, Docker Compose setup, development guide, contribution
  guide, issue forms, pull-request template, and CI workflow.

**Files or external drafts produced**

- This baseline entry in `docs/marketing/traction-log.md`.

**Verification performed**

- Read the unauthenticated GitHub repository, open-item, and release API
  responses at 2026-07-28 10:15 GMT (Africa/Accra).
- Ran `npm test`: 8 passing, 0 failing.
- Confirmed `package.json` is version `0.1.0`, while no GitHub release or Git
  tag currently exists.

**Current metrics**

| Metric | Baseline |
| --- | ---: |
| Stars | 0 |
| Forks | 0 |
| Watchers/subscribers | 0 / 0 |
| Open issues (excluding pull requests) | 0 |
| Open pull requests | 5 |
| GitHub releases | 0 |
| GitHub topics | 0 |
| GitHub Discussions | Disabled |

**Decisions made**

- Treat the first 30 days as a cold-start contributor funnel: make the
  repository easier to discover, then provide clearly scoped starter work
  before any launch activity.
- Preserve the existing Docker quick start, product tour, live-demo link,
  contributor guide, issue forms, and pull-request template; they are useful
  foundations for the funnel.

**README conversion gaps and onboarding friction**

- The GitHub repository description is misspelled and generic, the homepage
  setting is empty, and no topics are configured, limiting discovery before a
  visitor reaches the README.
- The README has a clear product description, Docker quick start, demo, and
  visual tour, but no badges, release/install confidence signal, prominent
  contributor call-to-action, or link to an immediately actionable starter
  task.
- The project has no public release despite its `0.1.0` package version; this
  makes version selection and upgrade expectations unclear for evaluators.
- Docker setup is documented and its services have health checks, but a new
  evaluator must create a private `.env` and replace two secret placeholders
  before the first run. There is no single documented expected-success screen
  or starter contribution to validate immediately after setup.
- Contributor guidance and issue/PR forms exist, but there are no open user
  issues or contributor labels yet. CI is configured for pull requests and
  pushes to `main`, while the repository default branch is `master`.

**Blockers**

- None for this audit. Applying the Day 2 repository description, homepage,
  and topics requires owner approval because those are GitHub settings.

**Exact owner input or permission required**

- Before Day 2 can fully complete, approve changing the GitHub repository
  description, homepage, and topics after the proposed values are drafted.

**Recommended next action**

- Complete Day 2: draft the repository positioning and make only the approved
  repository-file improvements; present the GitHub-setting changes for owner
  approval.

## 2026-07-29 — Day 2: Repository positioning

**Work completed**

- Drafted a focused repository positioning statement for teams seeking control
  of their social publishing stack and workflow automation.
- Prepared the proposed GitHub description, homepage, and 15-topic discovery
  set without changing any GitHub setting.
- Updated the README opening to use the same positioning, keeping the
  capability claims aligned with the existing feature list and implementation
  documentation.

**Files or external drafts produced**

- `docs/marketing/repository-positioning.md` contains the exact GitHub-setting
  values, rationale, and approval request.
- `README.md` now presents the approved repository-file positioning before the
  live demo and feature list.

**Verification performed**

- Cross-checked the positioning and topic choices against the README,
  `package.json`, and architecture documentation; every capability and stack
  claim is represented in the repository.
- Confirmed the homepage is the live-demo URL already linked from the README.
- Ran `npm test` after the documentation change.

**Current metrics**

- Baseline remains 0 stars, 0 forks, 0 watchers/subscribers, 0 topics, 0
  releases, 0 non-pull-request open issues, and 5 open pull requests, measured
  on 2026-07-28. No external metrics were changed or re-queried in this run.

**Decisions made**

- Use product-category and verified-stack topics only; avoid provider-specific
  and comparative topics until they are supported by a public contribution
  backlog and comparison material.
- Preserve the detailed README conversion work for Day 6; this change is
  limited to a consistent opening promise.

**Blockers**

- Applying the description, homepage, and topics is blocked pending owner
  approval because these are GitHub repository settings.

**Exact owner input or permission required**

- Approve changing the GitHub repository description, homepage, and topics to
  the exact values in `docs/marketing/repository-positioning.md`.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 3 by preparing
  ten scoped contribution opportunities. The GitHub-settings approval can be
  acted on separately when granted.

## 2026-07-29 — Day 2: Approved repository-setting application blocked

**Work completed**

- Received owner approval to apply the Day 2 GitHub repository description,
  homepage, and topics exactly as drafted in
  `docs/marketing/repository-positioning.md`.
- Verified the configured GitHub remote is `github.com/brudex/hype-engine` and
  checked the local GitHub CLI authentication state before making any external
  change.

**Files or external drafts produced**

- No new external draft. The approved values remain in
  `docs/marketing/repository-positioning.md`.

**Verification performed**

- Ran `gh auth status` on 2026-07-29; it reported that no GitHub host is
  authenticated in this workspace.
- Confirmed no repository setting was changed because an authenticated session
  is required to apply and verify the approved values.

**Current metrics**

- No metrics were changed or re-queried during this blocked application
  attempt.

**Decisions made**

- Preserve the approved Day 2 values unchanged and do not substitute a
  different account or credential.

**Blockers**

- GitHub CLI authentication for an account with administrator access to
  `brudex/hype-engine` is unavailable in this workspace.

**Exact owner input or permission required**

- Provide an authenticated GitHub CLI session with administrator access to
  `brudex/hype-engine`, or apply the approved values manually in the GitHub
  repository settings.

**Recommended next action**

- Once authenticated access is available, apply and verify the three approved
  Day 2 repository settings. The next numbered campaign day remains Day 3 on
  the next eligible Africa/Accra calendar date.

## 2026-07-29 — Day 2: Approved repository settings applied

**Work completed**

- Applied the approved GitHub repository description, homepage, and 15-topic
  discovery set to `brudex/hype-engine`.

**Files or external drafts produced**

- No new repository file. The applied values continue to be documented in
  `docs/marketing/repository-positioning.md`.

**Verification performed**

- Confirmed authenticated GitHub CLI access by listing repositories owned by
  `brudex`.
- Read the repository settings back with `gh repo view`; the description,
  homepage (`https://hypeengine.cachetechs.com`), and all 15 approved topics
  exactly match the Day 2 draft.

**Current metrics**

- GitHub topics: 15 (previously 0 at the campaign baseline).
- Other campaign metrics were not re-queried in this application run.

**Decisions made**

- Applied only the owner-approved settings and left all other GitHub settings
  unchanged.

**Blockers**

- None for the Day 2 repository-setting application.

**Exact owner input or permission required**

- None.

**Recommended next action**

- Complete Day 3 on the next eligible Africa/Accra calendar date by preparing
  ten scoped contribution opportunities; do not advance again today.

## 2026-07-30 — Day 3: Contributor backlog

**Work completed**

- Identified ten distinct, scoped contribution opportunities spanning frontend, backend, providers, testing, documentation, accessibility, and Docker.
- Prioritized the opportunities by contributor-friendly size and recorded explicit scope, likely files, safety boundaries, and verification expectations.
- Kept the backlog internal and issue-ready; no GitHub issue, label, comment, or other external content was created.

**Files or external drafts produced**

- docs/marketing/contributor-backlog.md — the ten-item internal backlog.

**Verification performed**

- Checked each proposal against the current repository structure, including provider adapters, scheduled-job modules, flow services, Compose health checks, the development guide, and existing root and flow-builder tests.
- Confirmed coverage for frontend (CB-01/02), backend (CB-03/08/09/10), providers (CB-04/05/07), testing (CB-03/04/08), documentation (CB-06/07), accessibility (CB-01/02), and Docker (CB-06/10).
- Confirmed that all proposed automated checks can use fixtures or mocks and do not require provider credentials or external publication.

**Current metrics**

- No external metrics were changed or re-queried. The most recently verified repository topic count remains 15 from the approved Day 2 application.

**Decisions made**

- Prioritized accessibility, documentation, and test-harness work as starter opportunities; retained provider publishing and SSRF-safe media work as bounded medium-size tasks with explicit safety constraints.
- Deferred choosing the five initial good-first-issue and three help-wanted drafts until Day 4 defines templates, labels, and standards.

**Blockers**

- None for preparing the internal backlog.

**Exact owner input or permission required**

- None for Day 3. Owner approval will be required before Day 5 issue drafts are published to GitHub.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 4 by improving issue templates, proposing a label taxonomy, and adding issue-writing standards plus a contributor issue checklist.

## 2026-07-31 — Day 4: Issue quality

**Work completed**

- Improved the bug-report form to collect a safe affected-area classification,
  expected versus actual behavior, minimal reproduction, sanitized evidence,
  environment, and a duplicate/sensitive-data acknowledgement.
- Improved the feature-request form to collect the affected area, evidence-based
  problem statement, smallest proposal, acceptance criteria, alternatives, and
  scope trade-offs.
- Defined a proposed, grouped label taxonomy and a contributor-issue writing
  standard with a pre-publication checklist. No GitHub label, issue, discussion,
  comment, setting, or permission was changed.

**Files or external drafts produced**

- `.github/ISSUE_TEMPLATE/bug_report.yml` — improved local bug-report form.
- `.github/ISSUE_TEMPLATE/feature_request.yml` — improved local feature-request
  form.
- `docs/marketing/issue-management-standards.md` — owner-reviewable proposed
  taxonomy, writing standard, and contributor issue checklist.

**Verification performed**

- Parsed both issue-form YAML files with Ruby's YAML parser successfully.
- Ran `git diff --check` successfully.
- Ran `npm test`: 16 passing, 0 failing.
- Confirmed the taxonomy supports the Day 3 backlog categories and separates
  kind, area, contributor fit, and blocked-triage states.

**Current metrics**

- No external metrics were changed or re-queried. The most recently verified
  repository topic count remains 15 from Day 2.

**Decisions made**

- Keep `bug` and `enhancement` as the existing form-default labels; propose all
  additional labels locally before any GitHub change.
- Reserve `good first issue` for independently bounded work with likely files,
  acceptance criteria, and a credential-free verification path, following the
  contributor-funnel guidance in the marketing playbook.

**Blockers**

- None for completing Day 4 locally.
- Creating the proposed labels or publishing issues is intentionally deferred:
  each is an external GitHub action requiring owner approval.

**Exact owner input or permission required**

- No input is required for Day 4. Before a future GitHub application, approve
  creation of the proposed labels in `docs/marketing/issue-management-standards.md`.
- Day 5 will separately require approval before any prepared issue draft is
  published.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 5 by drafting
  five `good first issue` and three `help wanted` issues from the contributor
  backlog; do not publish them without owner approval.

## 2026-07-31 — Day 5: Contributor-ready issues

**Work completed**

- Prepared five independently bounded `good first issue` drafts and three
  larger `help wanted` drafts from the Day 3 contributor backlog.
- Included the required context, suggested files, scope and non-goals,
  testable acceptance criteria, and credential-free verification steps in each
  draft.
- Kept all work local. No GitHub issue, label, discussion, comment, setting,
  permission, or external message was created or changed.

**Files or external drafts produced**

- `docs/marketing/contributor-issue-drafts.md` — local publication-ready
  drafts GFI-01 through GFI-05 and HW-01 through HW-03, plus the exact
  publication request.

**Verification performed**

- Cross-checked each draft's suggested starting points against the current
  calendar directives, reusable datepicker, provider registry, job-runner
  cron modules, flow validation/execution services, Docker Compose file, and
  existing test layout.
- Confirmed every draft follows the Day 4 issue-writing standard: it has a
  bounded outcome, named entry points, observable acceptance criteria, and a
  verification path that does not require production credentials or external
  publication.
- Ran `npm test`: 16 passing, 0 failing.
- Ran `git diff --check` successfully.

**Current metrics**

- No external metrics were changed or re-queried. The most recently verified
  repository topic count remains 15 from Day 2.

**Decisions made**

- Selected accessibility, documentation, and isolated provider-contract work
  for first-time contributors; selected cross-module job, flow, and operator
  status testing for broader `help wanted` work.
- Kept the Mastodon implementation and external-media security work out of the
  first eight drafts because they carry provider-behavior or security-design
  risk that is less suitable for the first publication batch.

**Blockers**

- Publishing the drafts and creating any missing proposed labels are external
  GitHub actions and require owner approval.

**Exact owner input or permission required**

- Approve creating the relevant proposed labels and publishing the eight
  drafts exactly as prepared in `docs/marketing/contributor-issue-drafts.md`.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 6 by improving
  the README conversion path; do not advance again today. Apply Day 5 drafts
  externally only after the owner grants the explicit approval above.

## 2026-08-01 — Day 6: README conversion

**Work completed**

- Reshaped the README opening into a concise landing path: trust badges,
  positioning, and an immediate choice between the live demo and Docker quick
  start.
- Preserved the existing 77.5-second (rounded 78-second) silent product tour
  and made it the primary visual proof point, with links to the high-quality
  video, dashboard screenshot, and full media gallery.
- Replaced the feature list with a six-area table covering publishing,
  organization, reporting, workflows, connected channels, and self-hosting.
- Strengthened the contributor invitation while accurately explaining that the
  prepared starter-task drafts are not GitHub issues until the owner authorizes
  their publication.

**Files or external drafts produced**

- `README.md` — improved hero, CI/version/license badges, demo call-to-action,
  feature presentation, and contributor path.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 6 complete.

**Verification performed**

- Ran `npm test`: 16 passing, 0 failing.
- Ran `git diff --check` successfully.
- Inspected the workflow, package metadata, license, contributor guide, and
  linked media. `ffprobe` measured the existing WebM tour at 77.5 seconds;
  the README's rounded 78-second description is accurate.
- Confirmed the README links point to tracked local assets or the already
  documented live-demo URL, and that no tour asset was changed.

**Current metrics**

- No external metrics were changed or re-queried. The most recently verified
  GitHub topic count remains 15 from Day 2.

**Decisions made**

- Used CI, version, and license badges as compact trust signals without
  claiming a release or a public community that does not yet exist.
- Kept the contributor call-to-action candid about the unpublished Day 5 issue
  drafts, avoiding a broken or misleading starter-issue promise.

**Blockers**

- Day 6 has no blocker. Publishing the Day 5 issue drafts and creating any
  missing proposed labels remain external GitHub actions that require owner
  approval.

**Exact owner input or permission required**

- To publish the contributor-ready work, approve creating the relevant
  proposed labels and publishing the eight drafts exactly as prepared in
  `docs/marketing/contributor-issue-drafts.md`.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, prepare Day 7's `v0.1.0`
  release package locally. Do not create or publish a GitHub release without
  owner approval.

## 2026-08-02 — Day 7: Release package

**Work completed**

- Prepared a complete, local `v0.1.0` release package for the current
  `master` candidate commit without creating a tag, GitHub release, or any
  other external publication.
- Included owner-reviewable release notes, first-install instructions,
  upgrade steps, evidence-based known limitations, screenshots, product-tour
  guidance, a contributor call, and the exact approval request.
- Chose `c6c51cecddc3f9bfe1e0b92ec6d5eed5302c48fb` (`expand API v1 automation
  support`) as the explicit candidate ref so a later GitHub release cannot
  accidentally be cut from a different commit.

**Files or external drafts produced**

- `docs/marketing/v0.1.0-release-package.md` — publication-ready local draft
  for the GitHub release body and release assets.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 7 complete
  after the local package was prepared.

**Verification performed**

- Confirmed `package.json` declares version `0.1.0`, `master` resolves to the
  candidate commit, and no local Git tag currently exists.
- Cross-checked the release highlights against the API v1 routes, idempotency
  middleware, migration files, Docker configuration, health endpoints, and
  contributor/security documentation.
- Verified all four linked screenshots are tracked 1440x900 PNGs and the
  product-tour WebM is present; the existing marketing gallery confirms the
  tour is silent and the screenshots contain no credential or authentication
  views.
- Derived limitations only from repository evidence, including the current
  Mastodon publish implementation, OAuth connection message, unimplemented
  media integrations, and password-reset TODO.

**Current metrics**

- No external metrics were re-queried and no external state changed. The most
  recently verified repository topic count remains 15 from Day 2; no GitHub
  release or tag exists yet.

**Decisions made**

- Release source archives only; do not imply a container image, binary, or npm
  publication that has not been prepared.
- Keep the release candidate pinned to the current `master` commit and require
  the owner to reconfirm it before tagging, since the project has no existing
  tag or published release.

**Blockers**

- Creating the `v0.1.0` tag and GitHub release is an external publication and
  requires explicit owner approval.

**Exact owner input or permission required**

- Approve creating annotated tag `v0.1.0` at
  `c6c51cecddc3f9bfe1e0b92ec6d5eed5302c48fb` and creating/publishing the
  GitHub release from `docs/marketing/v0.1.0-release-package.md`, with its
  listed screenshot and product-tour assets.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 8 by drafting
  the founder story locally. Do not publish the Day 7 release without the
  owner's explicit approval.

## 2026-08-03 — Day 8: Founder story

**Work completed**

- Drafted a founder-story narrative, “Why I open-sourced Hype Engine,” that
  explains the product problem, the documented gap it addresses, and the
  project's contributor-facing vision.
- Kept first-person motivation, audience assumptions, and external-use
  language explicitly subject to founder review rather than presenting inferred
  personal history as fact.
- Made no external post, release, issue, discussion, comment, or message.

**Files or external drafts produced**

- `docs/marketing/founder-story.md` — a local, publication-guarded story draft
  with repository-backed claims, founder-review prompts, and a future launch
  call to action.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 8 complete
  after the local draft was prepared.

**Verification performed**

- Cross-checked product, deployment, workflow, API, contributor, and license
  claims against `README.md`, `docs/architecture.md`, `docs/development.md`,
  `CONTRIBUTING.md`, and `docs/adr/0001-license-hype-engine-under-agpl.md`.
- Confirmed the draft does not state that a GitHub release or the prepared
  `good first issue` drafts have been published.
- Ran `npm test` successfully and `git diff --check` successfully.

**Current metrics**

- No external metrics were re-queried and no external state changed. The most
  recently verified repository topic count remains 15 from Day 2; no GitHub
  release or tag exists yet.

**Decisions made**

- Center the story on verifiable product values: self-hosting, operational
  visibility, workflow adaptability, and open contribution.
- Include a candid early-release qualifier rather than imply feature parity or
  production maturity beyond what the repository supports.

**Blockers**

- Day 8 is complete locally. External use is intentionally blocked until the
  founder confirms the first-person narrative and approves a publication
  destination; the Day 5 starter-issue publication approval remains separate.

**Exact owner input or permission required**

- Before any future publication, confirm the founder's personal origin story
  and intended audience, approve the final wording in
  `docs/marketing/founder-story.md`, and approve each external destination.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 9 by preparing
  tailored social-launch drafts locally; do not publish the founder story or
  Day 7 release without explicit owner approval.

## 2026-08-04 — Day 9: Social launch kit

**Work completed**

- Prepared local, tailored launch drafts for LinkedIn, X, a DEV/Hashnode
  article, and short self-hosted, open-source, and JavaScript community
  announcements.
- Gave every draft one explicit action and one canonical destination link;
  none claims that the first release or contributor-ready GitHub issues have
  been published.
- Added founder review, link recheck, community-rule review, and per-destination
  owner-approval guardrails. No post, article, message, comment, release,
  issue, discussion, or other external content was published.

**Files or external drafts produced**

- `docs/marketing/social-launch-kit.md` — publication-guarded social and
  community launch drafts.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 9 complete
  after all required local drafts were prepared.

**Verification performed**

- Cross-checked positioning, capability, early-project, licensing, Docker, and
  contributor claims against `README.md`, `package.json`, `CONTRIBUTING.md`,
  `docs/marketing/founder-story.md`, and
  `docs/marketing/v0.1.0-release-package.md`.
- Confirmed the repository and live-demo URLs used in the kit match the
  canonical URLs already referenced by the project.
- Ran `npm test` successfully and `git diff --check` successfully.

**Current metrics**

- No external metrics were re-queried and no external state changed. The most
  recently verified repository topic count remains 15 from Day 2; no GitHub
  release or tag exists yet.

**Decisions made**

- Use the live demo for evaluation-oriented posts, the repository for
  contributor-oriented posts, and the Docker quick start for self-hosted
  evaluation; each draft deliberately has one action instead of competing
  calls to action.
- Keep the DEV/Hashnode material as a launch article rather than asserting a
  separately published founder story.

**Blockers**

- Day 9 is complete locally. Publishing any item in this kit requires explicit
  owner approval and destination-specific community-rule verification.
- The Day 5 starter-issue publication, Day 7 release, and Day 8 founder-story
  approvals remain outstanding and are not implied by this kit.

**Exact owner input or permission required**

- Confirm the founder's first-person story and intended audience, select and
  approve the final copy plus each external destination, and authorize each
  individual post or submission before publishing.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 10 by making a
  local recommendation for the project's community home; do not enable GitHub
  Discussions or create Discord without owner approval.

## 2026-08-05 — Day 10: Community home

**Work completed**

- Recommended GitHub Discussions as Hype Engine's initial community home and
  documented why it is a better early-stage fit than creating a Discord server.
- Defined a minimal five-category structure and public-safe response and
  moderation standards for questions, ideas, announcements, general
  conversation, and sanitized user examples.
- Made no external change: GitHub Discussions was not enabled, no category or
  discussion was created, and no Discord server or account was created.

**Files or external drafts produced**

- `docs/marketing/community-home-recommendation.md` — owner-reviewable
  recommendation, category definitions, operating standards, and narrowly
  scoped approval request.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 10 complete
  after the local recommendation and operating model were prepared.

**Verification performed**

- Rechecked the README, contributor guidance, prepared release package,
  contributor-issue drafts, and social launch kit. They confirm the release
  and starter issues are still local, so a repository-native, searchable
  community surface is lower operational overhead than a separate real-time
  server.
- Attempted a read-only current GitHub metadata query on 2026-08-05; the API
  connection was unavailable in this workspace. No external state was changed
  or inferred from that failed query.
- Ran `git diff --check` successfully after the documentation changes.

**Current metrics**

- Current GitHub metrics could not be re-queried because the API connection was
  unavailable. The last verified state remains 15 repository topics from Day 2;
  the Day 5 issue drafts and Day 7 release remain unpublished according to the
  locally maintained campaign artifacts.

**Decisions made**

- Start with GitHub Discussions, not Discord. It consolidates early discovery,
  contributor context, and searchable answers without creating a separate
  moderation and account surface before demand exists.
- Launch only Announcements, Q&A, Ideas, General, and Show and tell. Defer
  polls and any real-time support expectation until usage demonstrates a need.

**Blockers**

- Enabling GitHub Discussions and creating categories are external GitHub
  settings changes and require owner approval.

**Exact owner input or permission required**

- Approve enabling GitHub Discussions for `brudex/hype-engine` and creating
  exactly the five categories in
  `docs/marketing/community-home-recommendation.md`. This authorization should
  not be interpreted as approval to create Discord or publish a discussion.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 11 by building
  a private, public-source-only prospect research list. Do not contact anyone.

## 2026-08-06 — Day 11: Contributor prospecting

**Work completed**

- Built a private, public-source-only research list of 20 relevant developer
  and community prospects: ten public GitHub handles credited for adjacent
  open-source work and ten public project, ecosystem, or directory sources.
- Matched each entry only to a potential future Hype Engine issue area, with
  explicit limits against assuming availability, expertise, a relationship, or
  consent to contact.
- Made no contact and no external change: no direct message, email, GitHub
  issue, comment, discussion, mention, post, directory submission, or
  community join action occurred.

**Files or external drafts produced**

- `docs/marketing/contributor-prospect-research.md` — private research list,
  source links, suitability notes, and a no-contact/owner-approval gate.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 11 complete
  after the requested 20-entry list was prepared.

**Verification performed**

- Rechecked the local contributor backlog and eight local issue drafts to
  ensure suggested fit is tied to real, bounded Hype Engine work and not an
  unsupported generic invitation.
- Checked the linked public GitHub repositories and release credits on
  2026-08-06 for their stated open-source scope, relevant public contribution
  evidence, or community surface. The research document retains source URLs
  rather than copied profile data or contact details.
- Ran `git diff --check` successfully after the documentation changes.

**Current metrics**

- No Hype Engine external metrics were changed or re-queried. The research
  concerns public source fit only; it does not imply prospect availability or
  interest.

**Decisions made**

- Treat adjacent social-scheduling maintainers and project communities as
  research sources, not proactive outreach targets.
- Delay any invitation until a matching Hype Engine issue is owner-approved,
  labeled, and published; use a specific contribution fit rather than
  popularity or broad cold outreach.

**Blockers**

- Day 11 is complete locally and has no blocker.
- Any future contact, directory submission, community participation, or
  publication remains blocked pending destination-specific owner approval.
- The separate Day 5 approval to create labels and publish the eight prepared
  Hype Engine issue drafts remains outstanding.

**Exact owner input or permission required**

- No input is required for Day 11. Before Day 12 could send anything, approve
  the specific recipients, final individualized text, and sending channel; do
  not treat drafting approval as sending approval.
- To give future drafts a valid contribution destination, approve creating the
  proposed labels and publishing the eight local drafts in
  `docs/marketing/contributor-issue-drafts.md`.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 12 by writing
  ten individualized, non-spam invitation drafts tied to specific local
  contribution issues. Do not send any message.

## 2026-08-07 — Day 12: Personal outreach drafts

**Work completed**

- Prepared ten private, individualized, low-pressure invitation drafts tied to
  five bounded local contribution drafts: GFI-01, GFI-03, GFI-05, HW-01, and
  HW-02.
- Used only the prior Day 11 public-source evidence for the ten named public
  GitHub handles; each draft limits its personalization to that evidence and
  avoids claims of availability, interest, expertise, or a relationship.
- Added a strict per-draft sending gate: the local issue must first be
  approved, labeled, and published; the source and contact preference must be
  rechecked; and the owner must approve the recipient, text, and channel.
- Made no external contact or change. No message, email, GitHub mention,
  comment, issue, discussion, post, community action, or credential use
  occurred.

**Files or external drafts produced**

- `docs/marketing/personal-outreach-drafts.md` — ten private drafts, source
  basis, one-send/no-follow-up rule, and maintainer review checklist.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 12 complete
  after all ten local drafts and gates were prepared.

**Verification performed**

- Counted ten draft sections (OD-01 through OD-10), each mapped to one named
  Day 11 public prospect and one explicit local issue draft.
- Cross-checked the issue IDs, scope, credential-free verification paths, and
  local-only publication state against
  `docs/marketing/contributor-issue-drafts.md`.
- Cross-checked each personalization premise against the bounded source record
  and no-contact disposition in
  `docs/marketing/contributor-prospect-research.md`.
- Ran `npm test` and `git diff --check` successfully after the documentation
  change.

**Current metrics**

- No Hype Engine external metrics were queried or changed. The drafts are
  local-only and do not establish delivery, interest, responses, issues, or
  contributors.

**Decisions made**

- Use explicit `[published issue URL]` placeholders rather than silently
  directing anyone to an unpublished task.
- Keep the drafts one-time and opt-out by design: no urgency, incentive,
  follow-up sequence, or request for a response.
- Retain adjacent-project maintainer caution: a draft is available for owner
  review but may only be used through a permitted direct channel, never in an
  adjacent project's issue tracker, forum, or community space.

**Blockers**

- Day 12 is complete locally. Sending any draft remains blocked because the
  matching Hype Engine issues are unpublished and personal outreach requires
  explicit owner approval.
- The separate Day 5 approval to create the proposed labels and publish the
  eight local issue drafts remains outstanding.

**Exact owner input or permission required**

- To send any one draft: approve publishing the matching issue and required
  label, then approve that named recipient, the final text with the published
  URL, and one recipient-permitted sending channel. Do not treat this approval
  as approval for any other recipient or message.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 13 by preparing
  the founder story and social launch drafts for publication, verifying every
  link and asset, then requesting final publication approval. Do not publish
  anything.

## 2026-08-08 — Day 13: Soft launch

**Work completed**

- Consolidated the Day 8 founder-story draft and Day 9 destination-specific
  social-launch drafts into a final owner-reviewable soft-launch package.
- Verified all three canonical destinations, all six selected social-copy
  links, local Docker anchor, product-tour assets, and four screenshot assets.
- Requested final, destination-specific owner approval. No post, article,
  community announcement, issue, comment, message, release, or scheduled
  item was published or created.

**Files or external drafts produced**

- `docs/marketing/soft-launch-approval-request.md` — final-review package,
  verification evidence, and exact approval gate.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 13 complete
  after preparing and verifying the local soft-launch package.

**Verification performed**

- Checked `https://hypeengine.cachetechs.com`: it resolves to `/auth/login`
  with HTTP 200. Checked the GitHub repository and its `#quick-start` anchor:
  each returned HTTP 200; the local README contains `## Quick start`.
- Confirmed the product-tour GIF (960×600), WebM, and four 1440×900 PNG
  screenshots exist and have the expected file types.
- Cross-checked source claims against `README.md`, `package.json`, `LICENSE`,
  `compose.yaml`, `app.js`, and `job-app.js`; retained the early-project
  qualifier and excluded unverified release, public-issue, customer,
  performance, and provider-coverage claims.
- Ran `npm test`: 16 passing, 0 failing. Ran `git diff --check`: passed.

**Current metrics**

- No campaign metrics were changed or re-queried. The most recently verified
  GitHub topic count remains 15 from Day 2.

**Decisions made**

- Keep the one-link, one-action structure from Day 9 to make each selected
  post measurable and avoid launch-copy sprawl.
- Treat the live-demo login redirect as working link verification, not evidence
  that the sign-in experience is the preferred public call to action.

**Blockers**

- External publication is blocked pending owner review and explicit approval.
- The founder-origin statements remain founder-review material; no automation
  may claim personal experience without confirmation.

**Exact owner input or permission required**

- Confirm or replace the first-person origin and intended audience in
  `docs/marketing/founder-story.md`; select the exact social drafts and
  destinations to publish; confirm current destination rules; approve each
  final text, link, and optional asset separately. Also decide whether the
  login-redirecting live demo is acceptable for the two demo-link drafts.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 14 by reviewing
  public responses and drafting—but not posting—any helpful replies. If this
  soft-launch approval has not been granted, record that no public responses
  are expected and do not create duplicate approval requests.

## 2026-08-09 — Day 14: Response and triage

**Work completed**

- Reviewed the public GitHub repository for responses, issues, pull-request
  comments, and Discussions activity without posting or changing any external
  state.
- Found no public user question, non-pull-request issue, or human comment to
  answer. The five open items are automated Dependabot pull requests; the two
  opened on 2026-08-08 have no comments, and the only comments since Day 13
  are automated supersession notices on closed pull requests.
- Added an evaluator and contributor FAQ, linked it from the Docker quick
  start, and prepared local-only helpful-reply drafts for future setup,
  contribution, and OAuth-callback questions.

**Files or external drafts produced**

- `docs/faq.md` — public-safe FAQ covering evaluation, configuration,
  processes, OAuth safety, contribution, reporting, and safe support details.
- `docs/marketing/day-14-response-triage.md` — public scan evidence,
  friction assessment, response drafts, and triage rules.
- `README.md` — quick-start link to the FAQ.
- `docs/marketing/30-day-contributor-growth-plan.md` — marked Day 14 complete.

**Verification performed**

- Queried the public GitHub API on 2026-08-09: 0 stars, forks, watchers, and
  subscribers; 15 topics; Discussions disabled; 5 open items, all pull
  requests; and 0 open non-pull-request issues.
- Confirmed open pull requests #2, #3, #4, #8, and #9 are Dependabot updates
  with zero comments. Confirmed the only issue comments since 2026-08-08 are
  Dependabot supersession notices on closed #5 and #7; #9 has no review
  comments.
- Cross-checked FAQ claims and reply drafts against `README.md`,
  `docs/development.md`, `CONTRIBUTING.md`, `docs/architecture.md`,
  `compose.yaml`, and `SECURITY.md`.
- Ran `npm test` and `git diff --check` successfully.

**Current metrics**

| Metric | Current state |
| --- | ---: |
| Stars | 0 |
| Forks | 0 |
| Watchers/subscribers | 0 / 0 |
| Topics | 15 |
| GitHub Discussions | Disabled |
| Open user issues | 0 |
| Open pull requests | 5 (all Dependabot) |

**Decisions made**

- Do not reply to automated dependency-bot notifications; they are maintenance
  work rather than contributor-funnel questions.
- Address reusable evaluation friction once in the FAQ rather than manufacture
  a reply where no human question exists.
- Keep every reply draft local and publication-gated; the unapproved soft
  launch creates no new external-response obligation.

**Blockers**

- The Day 13 soft launch remains unapproved and unpublished, so no launch
  responses can exist yet.
- GitHub Discussions remains disabled, preventing discussion-based questions
  until the owner approves the Day 10 recommendation.
- No human question exists to answer today.

**Exact owner input or permission required**

- Before any external response: approve the exact reply, destination, and
  current facts after reviewing the relevant question.
- To enable a community Q&A surface: approve enabling GitHub Discussions and
  creating the five proposed categories in
  `docs/marketing/community-home-recommendation.md`.
- To publish the soft launch: provide the destination-specific approval listed
  in `docs/marketing/soft-launch-approval-request.md`.

**Recommended next action**

- On the next eligible Africa/Accra calendar date, complete Day 15 by preparing
  the feedback-request and case-study templates, then request candidate users
  or permission to invite demo users. Do not advance again today.

## 2026-08-09 — Approval 1: Contributor issues and labels published

**Work completed**

- Received explicit owner approval to create the contributor label taxonomy
  and publish the five `good first issue` plus three `help wanted` drafts.
- Preserved existing GitHub labels, created the ten missing approved labels,
  and published issues #10 through #17 with their reviewed labels and bodies.
- Updated the README contributor path to link directly to the live starter and
  help-wanted issue searches.

**Verification performed**

- Read all eight issues back through GitHub CLI and confirmed their titles,
  authors, URLs, and label sets.
- Confirmed five issues carry `good first issue` and three carry `help wanted`.

**Current metrics**

- Open human-authored contributor issues: 8 (previously 0).
- Published `good first issue` tasks: 5.
- Published `help wanted` tasks: 3.

**Blockers**

- None for Approval 1. Contributor discovery still depends on the release,
  community home, launch publication, and approved outreach steps.

**Recommended next action**

- Review Approval 2: creating annotated tag `v0.1.0` and publishing the
  prepared GitHub release package.
