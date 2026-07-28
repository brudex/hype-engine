# Hype Engine

Hype Engine is a self-hosted social media management platform for publishing,
scheduling, analytics, recurring content, and visual automation workflows.

It is built for teams that want control of their social publishing stack
without giving up a practical web interface or background-job automation.

## Live demo

Try Hype Engine at [hypeengine.cachetechs.com](https://hypeengine.cachetechs.com).

## What it includes

- Multi-project social account management
- Drafting, scheduling, recurring posts, and publication history
- Media library, tags, calendar views, reports, and API access
- Facebook, Instagram, LinkedIn, Mastodon, and X/Twitter integrations
- A visual workflow builder for trigger, logic, AI, HTTP, and publish nodes
- Separate web and background-job processes for self-hosting

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
[the development guide](docs/development.md).

## Project status

Hype Engine is preparing its first public release. Interfaces and migrations
may evolve before 1.0. Please report security issues privately as described in
[SECURITY.md](SECURITY.md), and use GitHub issues for reproducible bugs and
focused feature proposals.

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), the
[architecture guide](docs/architecture.md), and the shared vocabulary in
[CONTEXT.md](CONTEXT.md).

## License

Hype Engine is licensed under
[GNU AGPL-3.0-or-later](LICENSE). If you modify it and offer the modified
program over a network, users must be offered the corresponding source code
under the same license.
