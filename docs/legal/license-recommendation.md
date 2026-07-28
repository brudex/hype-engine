# License Recommendation

Status: accepted on 2026-07-27

This document is project-planning guidance, not legal advice.

## Recommendation

Use the **GNU Affero General Public License v3.0 or later**
(`AGPL-3.0-or-later`) for Hype Engine.

Hype Engine is primarily network server software. Its most likely competitive
reuse is not redistribution of a downloadable binary; it is a third party
running a modified hosted service. AGPL is designed for this case: users who
interact with a modified version over a network must be offered the
corresponding source for that version.

The `-or-later` form allows recipients to use AGPL version 3 or a future version
published by the Free Software Foundation. Use `AGPL-3.0-only` instead if the
project should never automatically accept a future license revision.

## Advantages for Hype Engine

### Protects the shared code from closed hosted forks

A company can host, modify, and monetize Hype Engine, but users of that
modified network service must be offered its corresponding source. This makes
it harder to build a proprietary hosted fork without returning improvements.

### Keeps derivatives open

Modified covered works must remain under the same license when distributed,
and the network-use provision also covers modified versions offered as a
service.

### Supports commercial use

AGPL does not prohibit charging for hosting, support, implementation, or
distribution. Hype Engine can still operate a paid hosted edition and sell
professional services.

### Creates a path to dual licensing

If the project controls the relevant copyrights, it can offer the same code
under AGPL for the community and under a separate commercial license to
customers that cannot meet AGPL obligations.

### Uses an established open-source license

AGPL-3.0 is OSI approved and has a standard SPDX identifier. It is a recognized
open-source license rather than a custom source-available agreement.

## Tradeoffs

### Some companies prohibit AGPL dependencies

Organizations with conservative legal policies may decline to deploy or
contribute to AGPL software. This can reduce adoption compared with MIT or
Apache-2.0.

### License boundaries require care

Contributors and commercial integrators may need legal guidance to determine
whether tightly integrated modules form one covered work. Clear extension and
integration boundaries reduce uncertainty.

### Dual licensing requires copyright discipline

To offer proprietary commercial licenses later, the project must have the
right to relicense contributions. Common approaches are:

- a Contributor License Agreement granting the project the required rights; or
- a copyright assignment agreement.

A Developer Certificate of Origin records contribution provenance but normally
does not grant relicensing rights by itself.

### The product must expose a source offer

A modified network deployment must provide users a prominent way to obtain its
corresponding source. Hype Engine should include a stable “Source Code” link in
its interface and document this obligation.

## Alternatives

### Apache License 2.0

Choose Apache-2.0 if maximum company adoption and integration are more
important than protecting against closed hosted forks.

Advantages:

- Permissive commercial reuse.
- Explicit patent license from contributors.
- Familiar to enterprise legal teams.
- Modifications can be combined into proprietary products.

Disadvantage for Hype Engine:

- A competitor may operate a modified proprietary hosted service without
  publishing its changes.

### MIT License

Choose MIT if the goal is the lowest possible adoption friction and broadest
reuse.

Advantages:

- Very short and easy to understand.
- Permits use, modification, sublicensing, and sale.
- Widely accepted across the JavaScript ecosystem.

Disadvantages for Hype Engine:

- Provides almost no protection against proprietary forks or hosted
  competitors.
- Does not contain Apache-2.0's explicit patent grant language.

Mixpost currently uses MIT, but matching a competitor's license is not required.
Hype Engine can choose a stronger reciprocal model if community reciprocity is
part of its strategy.

## Proposed licensing package

After maintainer approval:

1. Add the unmodified AGPL v3 license text as `LICENSE`.
2. Set the package license field to `AGPL-3.0-or-later`.
3. Add a short license section to the README.
4. Add copyright and license notices where appropriate.
5. Add a “Source Code” link to the interactive product interface.
6. Decide whether future contributions require a CLA for dual-licensing
   flexibility.
7. Review all bundled assets and dependencies for license compatibility and
   attribution requirements.

## Decision

The maintainer selected `AGPL-3.0-or-later` on 2026-07-27. The repository
includes the canonical license text in `LICENSE`, and package metadata uses the
same SPDX identifier.

Project notices use “Hype Engine contributors” until the maintainer names a
specific individual or legal entity as the copyright holder.

A Contributor License Agreement is deferred. Contributors retain copyright,
and contributions are accepted under `AGPL-3.0-or-later`. If commercial dual
licensing becomes a concrete plan, the project will review contributor terms
with qualified legal counsel before changing the contribution process.
