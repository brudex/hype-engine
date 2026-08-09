# Hype Engine FAQ

This page answers the questions a prospective evaluator or first-time
contributor is most likely to have before opening an issue. It reflects the
repository as of 2026-08-09; it does not replace security guidance or
provider-specific configuration requirements.

## Is Hype Engine ready to use?

Hype Engine is preparing its first public release. It is a self-hosted social
publishing and workflow-automation application with scheduling, analytics,
recurring content, background jobs, and visual workflows. Interfaces and
migrations may still evolve before 1.0, so evaluate it in a non-production
environment first.

## What is the quickest way to evaluate it locally?

Use Docker Compose v2:

```sh
cp .env.example .env
docker compose up --build
```

Before starting, replace the placeholder `DBPASS` and `JWT_SECRET` values in
`.env` with strong private values. Then open <http://localhost:3000>. The web
and background-job health checks are available at
<http://localhost:3000/health> and <http://localhost:3001/health>.

See [the development guide](development.md) for native setup, migrations, and
troubleshooting.

## Why does Docker Compose refuse to start?

Compose requires `DBNAME`, `DBUSER`, `DBPASS`, `SITEURL`, and `JWT_SECRET`.
Copy `.env.example` to `.env`, fill each value, and keep
`SITEURL=http://localhost:3000` for a local evaluation. Do not put real
passwords, API keys, OAuth tokens, or session values in an issue, pull
request, screenshot, or log excerpt.

## Which processes need to be running?

The web application runs on port 3000, and the separate job process runs on
port 3001. The job process handles scheduled publication, token refresh,
cleanup, and maintenance. A healthy web page alone is not evidence that
scheduled work is running; check both health endpoints when evaluating the
stack.

## How do I connect a social account?

Social integrations need their own provider configuration and credentials.
Start with a local project and use placeholder or test credentials while
learning the setup. Never paste provider secrets into public support threads.
If an OAuth callback targets the wrong host, set `SITEURL` to the absolute
HTTP or HTTPS origin for that environment, without a path.

## How can I contribute?

Read [CONTRIBUTING.md](../CONTRIBUTING.md), then the
[architecture guide](architecture.md). Run `npm test` and the focused checks
in the development guide before opening a pull request. Contributor-ready
issue drafts are being prepared; until they are published, open a focused
issue or pull request instead of assuming a draft is claimable work.

## Where should I report a bug, propose an improvement, or disclose security
issues?

Use the repository's issue forms for reproducible bugs and focused feature
proposals. Include a minimal, sanitized reproduction and expected versus actual
behavior. Report suspected vulnerabilities through the private process in
[SECURITY.md](../SECURITY.md), never in a public issue or discussion.

## What should I include when asking for setup help?

Include your operating system, Docker or Node version, the command you ran,
the relevant service (`web`, `jobs`, or `database`), and a redacted error.
Leave out `.env` contents, passwords, OAuth tokens, API keys, cookies, and
full production logs. This lets maintainers reproduce the problem safely.
