# Secret and Private-Artifact Audit

Audit date: 2026-07-27

## Scope

This audit covered all 60 revisions reachable from the repository's local
branches and remotes at the time of the audit.

The checks included:

- Git history for `.env` files, logs, uploads, IDE metadata, private keys,
  credential files, and other commonly sensitive paths.
- Tracked content for recognizable private-key blocks and common token formats
  used by AWS, Google, OpenAI, and GitHub.
- The current working tree for tracked sensitive paths.
- The names, but not the values, of variables in the local `.env`.
- Credential-handling modules that were surfaced by the scans.

No secret values were printed or copied into this report.

## Results

No `.env` file, log directory, upload directory, IDE state, private-key file,
or recognizable provider token was found in the scanned Git history.

The local `.env` is ignored and was not found in Git history. It currently
defines development values for:

- `NODE_ENV`
- `PORT`
- `DBHOST`
- `DBNAME`
- `DBUSER`
- `DBPASS`
- `SITEURL`
- `JWT_SECRET`

`services/platform/facebook/lib/credentials.js` is a credential resolver. Its
name triggered the path scan, but the file does not contain embedded
credentials.

## Remediated findings

### Resolved: database password was written to application output

`models/index.js` previously logged the complete database configuration,
including `config.dbpass`, during startup. The log now contains only the
database name and host.

Treat application logs created before 2026-07-27 as sensitive because they may
contain the database password.

### Resolved: encryption had an unsafe fallback key

`utils/encryption.js` no longer falls back to
`default-key-change-in-production`. Configuration now requires `JWT_SECRET`,
and startup fails when it is missing.

### Resolved: hosted-site defaults were embedded in integration code

The Meta integration and callback modules no longer fall back to
`https://hypeengine.cachetechs.com`. They use the validated `SITEURL`
configuration, and startup fails when it is missing or is not an absolute HTTP
or HTTPS URL.

## Limitations

The initial review was pattern- and path-based. It was followed on 2026-07-28
by Gitleaks v8.30.1 scanning a temporary bare mirror of the complete committed
history. The downloaded release archive matched its published SHA-256 checksum.

Gitleaks initially reported one candidate in historical
`services/platform/linkedin/service.js`. Manual review confirmed that the
LinkedIn rule matched the word `initializeUpload` in a source-code comment; the
line contained no credential. Its exact fingerprint is documented in
`.gitleaksignore`. With that false positive excluded, Gitleaks scanned 58
commits and approximately 20.22 MB with no leaks found.

The remaining limitations are:

1. Gitleaks detects known patterns and high-entropy values but cannot prove
   that every arbitrary string is harmless.
2. `trufflehog` provider-verification checks were not run.
3. Any credential that may have been used in development or production should
   be rotated according to the operator's normal rotation policy,
   even if it was never committed.
4. GitHub secret scanning and push protection should be enabled when available.

## Release gate

The three code findings identified by this audit were fixed on 2026-07-27. The
dedicated full-history Gitleaks scan passed on 2026-07-28. No unresolved
repository secret finding currently blocks the first public release.
