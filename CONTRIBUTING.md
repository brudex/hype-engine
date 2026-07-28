# Contributing to Hype Engine

Thank you for helping improve Hype Engine.

## Before opening a change

Use an issue for significant features, data-model changes, or behavior that
affects social-provider integrations. Security vulnerabilities belong in the
private process described in `SECURITY.md`.

## Development workflow

1. Fork and clone the repository.
2. Copy `.env.example` to `.env` and replace placeholder secrets.
3. Run `npm ci`.
4. Start PostgreSQL and run `npm run migrate`, or use `docker compose up`.
5. Make a focused change using the existing CommonJS style.
6. Run `npm test`, the syntax check documented in `docs/development.md`, and
   relevant manual route or job checks.

Pull requests should explain the user-visible result, affected routes or jobs,
environment or database changes, and verification performed. Add screenshots
for UI changes. By contributing, you agree that your contribution is licensed
under AGPL-3.0-or-later.
