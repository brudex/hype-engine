const assert = require('node:assert/strict');
const test = require('node:test');

Object.assign(process.env, {
    NODE_ENV: 'development',
    PORT: '3000',
    DBHOST: 'localhost',
    DBNAME: 'hype_engine_test',
    DBUSER: 'hype_engine',
    DBPASS: 'test-password',
    SITEURL: 'http://localhost:3000',
    JWT_SECRET: 'test-secret-that-is-long-enough-for-local-tests'
});

const {
    resolveSchedule,
    validateScheduledAt,
    normalizeDays,
    validate,
    createSchema,
    RECURRING_DAILY,
    RECURRING_WEEKLY
} = require('../services/api-v1/post-request.service');
const {
    canAccessProject,
    getAllowedProjectUuids
} = require('../middlewares/api-v1.project-scope.middleware');
const { sanitize } = require('../controllers/api-v1/post-history.api.controller');
const { requestFingerprint } = require('../middlewares/api-v1.idempotency.middleware');

test('all-project API keys can access every project', () => {
    const req = { apiKey: { scopes: { allProjects: true, projects: [] } } };
    assert.equal(getAllowedProjectUuids(req), null);
    assert.equal(canAccessProject(req, 'project-a'), true);
});

test('project-scoped API keys only access their allow-list', () => {
    const req = { apiKey: { scopes: { allProjects: false, projects: ['project-a'] } } };
    assert.equal(canAccessProject(req, 'project-a'), true);
    assert.equal(canAccessProject(req, 'project-b'), false);
});

test('daily recurrence resolves to an active UTC schedule', () => {
    const result = resolveSchedule({
        recurringType: RECURRING_DAILY,
        recurringTime: '14:30',
        recurringEndAt: '2030-12-31T23:59:59Z'
    }, new Date('2030-01-01T00:00:00Z'));

    assert.equal(result.status, 1);
    assert.equal(result.scheduledAt, null);
    assert.equal(result.recurringTime, '14:30:00');
    assert.equal(result.recurringDays, null);
});

test('weekly recurrence normalizes and validates weekdays', () => {
    assert.equal(normalizeDays(['MON', 'FRI']), 'MON,FRI');
    const result = resolveSchedule({
        recurringType: RECURRING_WEEKLY,
        recurringTime: '09:15',
        recurringDays: ['MON', 'FRI']
    });
    assert.equal(result.recurringDays, 'MON,FRI');
});

test('one-time schedules must be in the future', () => {
    const now = new Date('2030-01-01T12:00:00Z');
    assert.match(validateScheduledAt('2030-01-01T11:59:00Z', now).error, /future/);
    assert.equal(
        validateScheduledAt('2030-01-01T12:01:00Z', now).value.toISOString(),
        '2030-01-01T12:01:00.000Z'
    );
});

test('history metadata redacts nested secrets', () => {
    assert.deepEqual(sanitize({
        providerPostId: 'safe',
        accessToken: 'secret',
        nested: { api_key: 'secret', message: 'failed' }
    }), {
        providerPostId: 'safe',
        accessToken: '[REDACTED]',
        nested: { api_key: '[REDACTED]', message: 'failed' }
    });
});

test('idempotency fingerprints are stable across object key order', () => {
    const first = requestFingerprint({ body: { b: 2, a: 1 } });
    const second = requestFingerprint({ body: { a: 1, b: 2 } });
    const changed = requestFingerprint({ body: { a: 1, b: 3 } });

    assert.equal(first, second);
    assert.notEqual(first, changed);
});

test('post validation rejects unknown fields', () => {
    const result = validate(createSchema, {
        versions: [{
            original: true,
            accountUuid: '',
            content: [{ body: 'hello', media: [] }]
        }],
        accountUuids: [],
        tags: [],
        unexpected: true
    });

    assert.ok(result.error.unexpected);
});
