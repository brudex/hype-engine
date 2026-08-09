# Community home recommendation

Prepared for Day 10 of the 30-day contributor-growth plan. This is a local
recommendation only; it does not enable GitHub Discussions, create a Discord
server, or change any external setting.

## Recommendation: GitHub Discussions first

Use **GitHub Discussions** as Hype Engine's initial community home. Reconsider
a dedicated Discord only after there is sustained conversation that GitHub
cannot serve well (for example, recurring real-time support needs or an active
group of regular contributors).

Hype Engine is still establishing its public contributor funnel: the first
eight contributor-ready issues and the `v0.1.0` release package are prepared
locally but are not published. GitHub Discussions keeps questions, decisions,
and contribution context next to the repository, requires no new community
account or moderation surface, is searchable and linkable from issues and pull
requests, and lets prospective contributors participate with their existing
GitHub identities. A Discord server now would split a small early audience,
require channel and moderation operations before there is demonstrated demand,
and make useful project knowledge harder to discover from the repository.

## Proposed categories

Create only these five GitHub Discussion categories initially. Do not add
polls, private support, or real-time support channels at launch.

| Category | Purpose | Maintainer use |
| --- | --- | --- |
| Announcements | Maintainer-only project updates such as releases, roadmap milestones, and contribution calls. | Post only material, confirmed updates; link to the canonical release, issue, or documentation. |
| Q&A | Setup, Docker, configuration, API, provider, and workflow questions with answers that others can reuse. | Mark a clear answer when available; fold recurring answers into documentation. |
| Ideas | Early, bounded product and workflow proposals before they become scoped issues. | Ask for the problem and constraints; move accepted, actionable work into an issue. |
| General | Project feedback, introductions, and non-support conversation that does not fit another category. | Keep discussion welcoming and redirect support or security reports to the correct channel. |
| Show and tell | Optional user implementations, self-hosted setups, and workflow examples. | Invite only sanitized examples; never request credentials, private posts, or customer data. |

## Response and moderation standard

These are proposed operating standards, not a promise of 24/7 support:

1. A maintainer acknowledges new good-faith Q&A and Ideas discussions within
   two business days when capacity permits. If no answer is available, say so
   plainly and link the next useful investigation or tracking item.
2. Keep answers reproducible and public-safe: include versions, sanitized logs,
   expected behavior, and links to the relevant repository documentation. Never
   ask for access tokens, `.env` files, private customer content, or account
   credentials.
3. Redirect reproducible defects to the bug-report form and accepted,
   independently actionable work to a GitHub issue. Keep the original
   discussion linked for context; do not silently close it without explaining
   the handoff.
4. Treat security reports as private: direct reporters to `SECURITY.md` and do
   not investigate or disclose exploitable details in a public discussion.
5. Be welcoming to first-time contributors, state scope and next steps without
   pressure, and avoid making roadmap, support, or release commitments that
   have not been approved by the project owner.
6. Pin or periodically refresh a concise getting-started discussion only after
   the Docker quick-start, release state, and contributor entry points it links
   to are public and verified.

## Owner approval required

Before any external change, approve enabling GitHub Discussions for
`brudex/hype-engine` and creating exactly the five categories above. This
approval does **not** authorize Discord creation, publication of a welcome
post, external replies, or any other repository setting change.

If approval is granted, the first external action should be to enable
Discussions and create the categories. A welcome post should be drafted and
separately approved only after the public release and contributor-issue state
are rechecked.
