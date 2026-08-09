# Why I open-sourced Hype Engine

**Status:** founder-review draft. This is local campaign material, not a public
post. Before publication, the founder must confirm the first-person details
and any examples that are personal rather than repository-verifiable.

## Draft

Social publishing should not require a team to hand over its content calendar,
workflow logic, and operating choices to a black box.

That is why I open-sourced Hype Engine: to give teams a practical way to plan,
schedule, and automate social content while retaining control of the software,
data, and infrastructure behind it.

The problem is broader than scheduling a post. Small marketing and product
teams need a dependable place to organize projects, connected accounts,
content, recurring work, reporting, and the decisions around publication. When
that work is scattered across hosted tools, custom scripts, and manual handoffs,
the automation is hard to inspect, adapt, and improve.

Existing tools can be useful, but they did not offer the combination I wanted:
a self-hosted application for publishing and scheduling, plus visual workflows
that can model the surrounding work. Hype Engine brings those concerns into one
application, with a web interface, a separate background-job process, PostgreSQL
storage, provider adapters, and an API for project-scoped automation. It can be
run locally with Docker, so a team can evaluate it in its own environment.

Open source is essential to that direction. It makes the operational tradeoffs
visible, gives contributors a real path to improve the product, and lets teams
adapt the system to their own workflows instead of waiting for a vendor
roadmap. Hype Engine uses the AGPL-3.0-or-later so improvements to modified
network versions remain available to the people who use them.

This is an early release, not a claim that every integration or workflow is
finished. The goal is to build the project in the open: improve the interface,
documentation, tests, Docker experience, provider integrations, and workflow
system with people who care about controllable, self-hosted publishing tools.

If that is a problem you recognize, try the live demo or run Hype Engine with
Docker. Then tell us what is unclear, what is missing, or where you would like
to contribute. The first contributor-ready tasks are being prepared for
publication, and focused issues and pull requests are welcome now.

## Repository-backed claims used in this draft

- The product supports social publishing, scheduling, analytics, recurring
  posts, visual workflow automation, and project-scoped API v1 endpoints.
- Its deployable shape is a Node.js web application and a separate job server
  backed by PostgreSQL; Docker Compose starts the local stack.
- The repository documents provider adapters, a workflow builder, health
  endpoints, a live demo, contribution guidance, and AGPL-3.0-or-later
  licensing.
- The project is preparing its first public release; the draft deliberately
  avoids claims of production maturity or complete provider coverage.

## Founder review before external use

- Confirm that control of data, infrastructure, and workflow logic is the
  founder's actual reason for open-sourcing the project; replace the opening
  with the founder's own origin story if a more specific event or user need
  prompted it.
- Confirm whether it is appropriate to describe the product as serving small
  marketing and product teams, or substitute the intended audience.
- Confirm the desired public call to action once the prepared starter issues
  are approved for publication. Until then, do not imply that `good first
  issue` tickets already exist on GitHub.

## Publication guardrail

This draft is intended for the Day 9 launch kit and Day 13 soft-launch package.
Do not publish it, send it, or claim personal founder experience until the
owner approves the final wording and each publication destination.
