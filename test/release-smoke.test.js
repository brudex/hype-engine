const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const validEnvironment = {
    ...process.env,
    NODE_ENV: "development",
    PORT: "3000",
    DBHOST: "localhost",
    DBNAME: "hype_engine_test",
    DBUSER: "hype_engine",
    DBPASS: "test-password",
    SITEURL: "http://localhost:3000",
    JWT_SECRET: "test-secret-that-is-long-enough-for-local-tests"
};

test("configuration rejects a missing required secret", () => {
    const environment = { ...validEnvironment };
    delete environment.JWT_SECRET;
    const result = spawnSync(process.execPath, ["-e", "require('./config/config')"], {
        cwd: process.cwd(),
        env: environment,
        encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Missing required environment variable: JWT_SECRET/);
});

test("configuration rejects a non-HTTP site URL", () => {
    const result = spawnSync(process.execPath, ["-e", "require('./config/config')"], {
        cwd: process.cwd(),
        env: { ...validEnvironment, SITEURL: "javascript:alert(1)" },
        encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SITEURL must use the http:\/\/ or https:\/\//);
});

test("automatic Sequelize synchronization is disabled by default", () => {
    const environment = { ...validEnvironment };
    delete environment.SEQUELIZE_AUTO_SYNC;
    const result = spawnSync(
        process.execPath,
        ["-e", "process.stdout.write(String(require('./config/config').sequelizeAutoSync))"],
        {
            cwd: process.cwd(),
            env: environment,
            encoding: "utf8"
        }
    );

    assert.equal(result.status, 0);
    assert.match(result.stdout, /false$/);
});

test("configuration rejects an ambiguous auto-sync flag", () => {
    const result = spawnSync(process.execPath, ["-e", "require('./config/config')"], {
        cwd: process.cwd(),
        env: { ...validEnvironment, SEQUELIZE_AUTO_SYNC: "yes" },
        encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SEQUELIZE_AUTO_SYNC must be either true or false/);
});

test("web health endpoint reports service readiness", async () => {
    Object.assign(process.env, validEnvironment);
    const app = require("../app");
    const healthLayer = app._router.stack.find(
        (layer) => layer.route && layer.route.path === "/health"
    );
    let statusCode = 200;
    let body;
    healthLayer.route.stack[0].handle(
        {},
        {
            status(code) {
                statusCode = code;
                return this;
            },
            json(value) {
                body = value;
            }
        }
    );

    assert.equal(statusCode, 200);
    assert.deepEqual(body, { status: "ok", service: "web" });
});

test("flow API rejects an untrusted X-User-Id header", () => {
    Object.assign(process.env, validEnvironment);
    const flowApiAuth = require("../middlewares/flow-api.auth.middleware");
    let statusCode;
    let body;
    let nextCalled = false;

    flowApiAuth(
        {
            headers: { "x-user-id": "victim-user-uuid" },
            isAuthenticated: () => false
        },
        {
            status(code) {
                statusCode = code;
                return this;
            },
            json(value) {
                body = value;
            }
        },
        () => {
            nextCalled = true;
        }
    );

    assert.equal(statusCode, 401);
    assert.equal(body.error, "Unauthorized");
    assert.equal(nextCalled, false);
});

test("flow API accepts a Passport-authenticated session", () => {
    const flowApiAuth = require("../middlewares/flow-api.auth.middleware");
    const req = {
        headers: {},
        user: { uuid: "authenticated-user-uuid" },
        isAuthenticated: () => true
    };
    let nextCalled = false;

    flowApiAuth(req, {}, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.flowUserUuid, "authenticated-user-uuid");
});

test("webhook trigger secrets are generated server-side and remain stable", () => {
    const {
        entryTriggerMeta,
        secureTriggerConfig
    } = require("../services/flow/flow-definition.service");
    const builderDefinition = {
        meta: { triggerType: "webhook" },
        nodes: [
            {
                id: "entry",
                type: "input",
                parameters: { inputType: "object", value: {} }
            }
        ]
    };
    const trigger = entryTriggerMeta(builderDefinition.nodes[0], builderDefinition);
    const first = secureTriggerConfig(trigger.triggerType, trigger.triggerConfig);
    const second = secureTriggerConfig(
        "webhook",
        { webhookId: "entry" },
        first
    );

    assert.equal(trigger.triggerType, "webhook");
    assert.match(first.webhookSecret, /^[a-f0-9]{64}$/);
    assert.equal(second.webhookSecret, first.webhookSecret);
});
