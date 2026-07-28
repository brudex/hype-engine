# Development setup

Hype Engine supports a containerized development environment with PostgreSQL,
the web application, and the background job server.

## Prerequisites

- Docker with Compose v2, or
- Node.js 24 and PostgreSQL 16 for a native setup.

The supported Node.js range is declared in `package.json`; `.nvmrc` pins the
version used by the container.

## Start with Docker

1. Create your private environment file:

   ```sh
   cp .env.example .env
   ```

2. Replace `DBPASS` and `JWT_SECRET` with strong random values. Keep
   `SITEURL=http://localhost:3000` for local development.

3. Build and start the stack:

   ```sh
   docker compose up --build
   ```

4. Open the services:

   - Web application: <http://localhost:3000>
   - Web health check: <http://localhost:3000/health>
   - Job health check: <http://localhost:3001/health>

The PostgreSQL data, application logs, and uploaded media live in named Docker
volumes. They survive container restarts and are not written into the source
tree.

To stop the stack:

```sh
docker compose down
```

`docker compose down -v` also deletes local database, log, and upload volumes.
Use that command only when you intentionally want a clean local environment.

## Native setup

1. Install the Node version from `.nvmrc`.
2. Install PostgreSQL 16 and create the database and user named in `.env`.
3. Copy `.env.example` to `.env` and replace all placeholder secrets.
4. Install dependencies with `npm ci`.
5. Start the web server with `npm run dev`.
6. In a second terminal, start background jobs with `npm run job`.

The web server defaults to port 3000 and the job server uses the `PORT` value
provided to its process. For example:

```sh
PORT=3001 npm run job
```

## Database migrations

Run migrations before starting a native installation:

```sh
npm run migrate
```

The web, job, and seed entry points also run pending migrations before doing
work. Applied files are recorded in `schema_migrations`, and a PostgreSQL
advisory lock prevents the web and job processes from racing during startup.
Add future schema changes as ordered files under `migrations/`; do not call
`sequelize.sync()` from application startup code.

Back up an existing database before the first upgrade to this migration system.
The runner adopts a non-empty legacy schema as the initial baseline, then
applies the explicit legacy upgrade migrations that follow it.

`SEQUELIZE_AUTO_SYNC` defaults to `false`. Setting it to `true` runs
`sequelize.sync()` after all versioned migrations. This is an opt-in
development or legacy compatibility tool; keep it disabled in production and
represent durable schema changes with migration files.

## Verification

```sh
npm test
npm audit --omit=dev
find bin config controllers middlewares models routes services utils job-runner seeder migrations \
  -name '*.js' -print0 | xargs -0 -n1 node --check
docker compose config --quiet
```

## Troubleshooting

### A required environment variable is missing

Startup fails with the variable name. Compare your `.env` with `.env.example`;
do not add fallback secrets to source code.

### Connect to PostgreSQL from the host

The default Compose stack intentionally keeps PostgreSQL on its private
container network. Use `docker compose exec database psql` for local database
inspection instead of publishing the database port.

### OAuth callbacks use the wrong host

Set `SITEURL` to the externally reachable origin for the environment. It must
be an absolute HTTP or HTTPS URL and should not end with a path.
