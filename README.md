# Hype Engine

[![CI](https://github.com/brudex/hype-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/brudex/hype-engine/actions/workflows/ci.yml)
![Version](https://img.shields.io/badge/version-0.1.0-1f6feb?style=flat-square)
![License](https://img.shields.io/badge/license-AGPL--3.0--or--later-2ea44f?style=flat-square)

Hype Engine is a self-hosted social publishing and workflow-automation
platform for teams that want to plan, schedule, and run social content without
giving up control of their data and infrastructure.

It combines publishing, scheduling, analytics, recurring content, and visual
automation workflows in a practical web interface with background-job
automation.

**Explore it now:** [try the live demo](https://hypeengine.cachetechs.com) or
[run it locally with Docker](#quick-start).

## See Hype Engine in action

The [live demo](https://hypeengine.cachetechs.com) is the quickest way to see
the product. The 78-second silent tour below walks through the project
dashboard, post management, and content calendar.

![Hype Engine product tour](docs/marketing/video/hype-engine-product-tour.gif)

[Watch the higher-quality WebM tour](docs/marketing/video/hype-engine-product-tour.webm),
view the [dashboard screenshot](docs/marketing/screenshots/dashboard.png), or
browse the [marketing media gallery](docs/marketing/README.md).

## What you can do

| Area | What Hype Engine provides |
| --- | --- |
| Plan and publish | Multi-project social-account management, drafting, scheduling, recurring posts, and publication history. |
| Organize content | A media library, tags, and calendar views for planning a content schedule. |
| Review results | Reports and API access for working with publishing data. |
| Automate workflows | A visual builder with trigger, logic, AI, HTTP, and publish nodes. |
| Connect channels | Facebook, Instagram, LinkedIn, Mastodon, and X/Twitter integrations. |
| Keep control | Separate web and background-job processes designed for self-hosting. |

## Quick start

You need Docker Desktop (or another Docker Engine with Compose v2).

```sh
cp .env.example .env
docker compose up --build
```

Replace the placeholder `DBPASS` and `JWT_SECRET` values before startup, then
open <http://localhost:3000>. Health endpoints are available at
<http://localhost:3000/health> and <http://localhost:3001/health>.

For native Node.js setup, database migrations, and troubleshooting, see
[the development guide](docs/development.md) and the [FAQ](docs/faq.md).

## Project status

Hype Engine is preparing its first public release. Interfaces and migrations
may evolve before 1.0. Please report security issues privately as described in
[SECURITY.md](SECURITY.md), and use GitHub issues for reproducible bugs and
focused feature proposals.

## Contributing

Contributions are welcome, whether you improve the interface, documentation,
test coverage, Docker experience, provider integrations, or workflows. Start
with [CONTRIBUTING.md](CONTRIBUTING.md), then use the
[architecture guide](docs/architecture.md) and shared vocabulary in
[CONTEXT.md](CONTEXT.md) to orient yourself.

For a small, scoped first pull request, browse the
[`good first issue`](https://github.com/brudex/hype-engine/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22)
tasks. Larger contributions are listed under
[`help wanted`](https://github.com/brudex/hype-engine/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22help%20wanted%22).

## License

Hype Engine is licensed under
[GNU AGPL-3.0-or-later](LICENSE). If you modify it and offer the modified
program over a network, users must be offered the corresponding source code
under the same license.
