# Day 14 response and triage review

Reviewed on 2026-08-09 (Africa/Accra). This is a local triage record and draft
library; it does not authorize an external reply, comment, issue, or
discussion.

## Public review result

- GitHub Discussions remains disabled.
- There are no open non-pull-request issues, and no public user question or
  feature request to answer.
- The five open items are Dependabot pull requests (#2, #3, #4, #8, and #9).
  Each has zero issue comments; #8 and #9 were opened on 2026-08-08.
- The only issue comments since the Day 13 review are automated Dependabot
  supersession notices on closed items #5 and #7. They require no reply.
- The Day 13 soft launch remains owner-approval-gated, so no published launch
  response is expected from that material.

## Outcome and observed friction

There was no human response to reply to. The public-facing onboarding friction
that can be addressed safely from repository evidence is that a new evaluator
must know which environment values are required, that both web and jobs must
be healthy, how OAuth callback origins work, and what may safely be included
in a help request. [`docs/faq.md`](../faq.md) now answers those points and is
linked from the Docker quick start in the README.

## Reply drafts for a future human question

Do not post these without owner approval. Adapt only after confirming the
facts in the question and removing any request for secrets.

### Local setup question

> Thanks for trying Hype Engine. Please make sure `.env` was copied from
> `.env.example`, with private values for `DBPASS` and `JWT_SECRET`, then
> check both `/health` endpoints after `docker compose up --build`. The FAQ
> and development guide include the expected local URLs and safe
> troubleshooting steps. If it still fails, please share the command, service
> name, and a redacted error—never `.env` values, tokens, or cookies.

### Contribution question

> Thanks for the interest in contributing. Please start with
> `CONTRIBUTING.md` and the architecture guide, and keep the first change
> focused. The contributor-ready issue drafts are not published yet, so please
> do not assume one is reserved; a focused issue or pull request with the
> checks you ran is welcome.

### OAuth callback question

> An OAuth callback must use the absolute public origin configured in
> `SITEURL`, without a path. For local evaluation, use
> `http://localhost:3000`. Please redact client secrets, tokens, authorization
> codes, and full callback URLs before sharing any diagnostic detail.

## Triage rules

1. Respond only to human questions, not automated Dependabot status messages.
2. Confirm the answer against the current repository before replying; do not
   promise release dates, provider coverage, roadmap items, or support hours.
3. Route security reports to the private process in `SECURITY.md` and request
   redaction for any credentials or personal data.
4. Turn a repeated, answerable setup question into an FAQ or development-guide
   improvement before drafting a second response.
