# Contributor issue management standards

Prepared for Day 4 of the 30-day contributor-growth plan. This is a local,
owner-reviewable operating guide. It does not create or change any GitHub
label, issue, template setting, or permission.

## Proposed label taxonomy

Apply at most one label from each group when triaging an issue. Existing
`bug` and `enhancement` labels remain the form defaults; the rest are proposed
for owner approval before they are created in GitHub.

| Group | Proposed labels | Purpose |
| --- | --- | --- |
| Kind | `bug`, `enhancement`, `documentation`, `accessibility`, `testing` | What needs to change. |
| Area | `area:frontend`, `area:backend`, `area:providers`, `area:flows`, `area:docker` | Where a contributor is likely to work. |
| Contributor fit | `good first issue`, `help wanted` | Starter work or work needing community support. |
| Triage state | `status:needs-reproduction`, `status:needs-decision`, `status:blocked` | Why work cannot yet begin. |

Label names are intentionally plain and compatible with GitHub search. Do not
apply `good first issue` until the issue has a bounded scope, named starter
files, acceptance criteria, and a verification path. Do not use `help wanted`
as a substitute for maintainer decisions or unresolved security work.

## Issue-writing standard

A contributor-ready issue must be specific enough to estimate and verify
without private credentials or unstated product knowledge.

1. Start with the user or maintainer problem and link the evidence: a
   reproducible report, relevant source location, architecture document, or
   prior decision.
2. State the smallest in-scope outcome and explicit non-goals. Keep one
   independently reviewable change per issue.
3. Name likely files or modules as pointers, not mandatory implementation
   instructions. Call out compatibility, provider, data-migration, and
   security constraints early.
4. Write observable acceptance criteria, including error and accessibility
   behavior where relevant.
5. List verification commands and any required manual checks. They must not
   require production access, real provider tokens, or private data.
6. Explain whether a maintainer decision, design, or external account is
   needed before coding can begin. Use a triage-state label instead of marking
   such work contributor-ready.

Bug reports need minimal reproduction steps, expected versus actual behavior,
safe environment/version details, and sanitized evidence. Feature requests
need the problem, proposed smallest change, alternatives, scope trade-offs,
and acceptance criteria.

## Contributor issue checklist

Before publishing or applying a contributor-fit label, a maintainer checks:

- [ ] The issue title describes one outcome and does not expose secrets or
      customer information.
- [ ] Evidence and linked source locations establish why the work matters.
- [ ] Scope, non-goals, and safety/compatibility boundaries are explicit.
- [ ] Likely files or entry points are named, and the work can be completed
      without unavailable credentials or external-account changes.
- [ ] Acceptance criteria are testable and include failure behavior when it
      affects users, jobs, data, providers, or security.
- [ ] Verification steps are concrete (`npm test`, focused checks, and any
      manual route/job check) and do not contact real providers.
- [ ] The proposed kind, area, and triage labels are correct; only genuinely
      bounded starter work receives `good first issue`.
- [ ] A maintainer can answer first questions and review a pull request within
      the response expectation communicated to contributors.

## Owner action required before external application

Creating or changing GitHub labels, publishing issue templates, and opening
issues are external repository actions. Approve the proposed taxonomy and
authorize those GitHub changes before any label or issue is created. Day 5 can
use these standards to prepare drafts, but requires separate approval before
publication.
