const Joi = require('joi');

const RECURRING_ONE_TIME = 0;
const RECURRING_DAILY = 1;
const RECURRING_WEEKLY = 2;
const VALID_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const contentSchema = Joi.object({
    body: Joi.string().allow('').max(5000).required(),
    media: Joi.array().items(Joi.string().uuid()).unique().default([])
}).unknown(false);

const versionSchema = Joi.object({
    accountUuid: Joi.when('original', {
        is: true,
        then: Joi.string().allow('', null).default(''),
        otherwise: Joi.string().uuid().required()
    }),
    original: Joi.boolean().required(),
    content: Joi.array().length(1).items(contentSchema).required()
}).unknown(false);

const scheduleFields = {
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, ''),
    time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow(null, ''),
    recurringType: Joi.number().integer().valid(0, 1, 2).default(0),
    recurringDays: Joi.alternatives().try(
        Joi.array().items(Joi.string().uppercase().valid(...VALID_DAYS)).unique(),
        Joi.string().allow(null, '')
    ).default(null),
    recurringTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/).allow(null, ''),
    recurringEndAt: Joi.date().iso().allow(null, '')
};

const createSchema = Joi.object({
    versions: Joi.array().min(1).items(versionSchema).required(),
    accountUuids: Joi.array().items(Joi.string().uuid()).unique().default([]),
    tags: Joi.array().items(Joi.string().uuid()).unique().default([]),
    ...scheduleFields
}).unknown(false);

const updateSchema = Joi.object({
    versions: Joi.array().min(1).items(versionSchema),
    accountUuids: Joi.array().items(Joi.string().uuid()).unique(),
    tags: Joi.array().items(Joi.string().uuid()).unique(),
    date: scheduleFields.date,
    time: scheduleFields.time,
    recurringType: Joi.number().integer().valid(0, 1, 2),
    recurringDays: scheduleFields.recurringDays,
    recurringTime: scheduleFields.recurringTime,
    recurringEndAt: scheduleFields.recurringEndAt
})
    .unknown(false)
    .min(1)
    .with('versions', 'accountUuids')
    .with('accountUuids', 'versions')
    .with('recurringDays', 'recurringType')
    .with('recurringTime', 'recurringType')
    .with('recurringEndAt', 'recurringType');

const scheduleSchema = Joi.object({
    scheduled_at: Joi.date().iso().required()
}).unknown(false);

function validationError(error) {
    const details = {};
    for (const item of error.details) {
        details[item.path.join('.')] = item.message;
    }
    return details;
}

function validate(schema, payload) {
    const result = schema.validate(payload, {
        abortEarly: false,
        convert: true,
        stripUnknown: false
    });
    return result.error
        ? { error: validationError(result.error) }
        : { value: result.value };
}

function normalizeDays(days) {
    if (Array.isArray(days)) return days.join(',');
    if (!days) return null;
    const normalized = String(days).split(',')
        .map((day) => day.trim().toUpperCase())
        .filter(Boolean);
    if (normalized.some((day) => !VALID_DAYS.includes(day)) || new Set(normalized).size !== normalized.length) {
        return null;
    }
    return normalized.join(',') || null;
}

function resolveSchedule(payload, now = new Date()) {
    const recurringType = Number(payload.recurringType || 0);
    if (recurringType === RECURRING_DAILY || recurringType === RECURRING_WEEKLY) {
        if (!payload.recurringTime) {
            return { error: 'recurringTime is required for recurring posts' };
        }
        const recurringDays = normalizeDays(payload.recurringDays);
        if (recurringType === RECURRING_WEEKLY && !recurringDays) {
            return { error: 'recurringDays must contain at least one valid weekday for weekly posts' };
        }
        const recurringEndAt = payload.recurringEndAt ? new Date(payload.recurringEndAt) : null;
        if (recurringEndAt && recurringEndAt <= now) {
            return { error: 'recurringEndAt must be in the future' };
        }
        return {
            scheduledAt: null,
            recurringType,
            recurringDays: recurringType === RECURRING_WEEKLY ? recurringDays : null,
            recurringTime: payload.recurringTime.length === 5 ? `${payload.recurringTime}:00` : payload.recurringTime,
            recurringEndAt,
            status: 1,
            scheduleStatus: 0
        };
    }

    const hasDate = Boolean(payload.date);
    const hasTime = Boolean(payload.time);
    if (hasDate !== hasTime) {
        return { error: 'date and time must be provided together' };
    }
    if (!hasDate) {
        return {
            scheduledAt: null,
            recurringType: RECURRING_ONE_TIME,
            recurringDays: null,
            recurringTime: null,
            recurringEndAt: null,
            status: 0,
            scheduleStatus: 0
        };
    }

    const scheduledAt = new Date(`${payload.date}T${payload.time}:00`);
    if (Number.isNaN(scheduledAt.getTime())) {
        return { error: 'date and time must form a valid timestamp' };
    }
    if (scheduledAt <= now) {
        return { error: 'Scheduled time must be in the future' };
    }
    return {
        scheduledAt,
        recurringType: RECURRING_ONE_TIME,
        recurringDays: null,
        recurringTime: null,
        recurringEndAt: null,
        status: 1,
        scheduleStatus: 0
    };
}

function validateScheduledAt(value, now = new Date()) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return { error: 'scheduled_at must be a valid ISO 8601 timestamp' };
    if (parsed <= now) return { error: 'scheduled_at must be in the future' };
    return { value: parsed };
}

module.exports = {
    createSchema,
    updateSchema,
    scheduleSchema,
    validate,
    resolveSchedule,
    validateScheduledAt,
    normalizeDays,
    RECURRING_ONE_TIME,
    RECURRING_DAILY,
    RECURRING_WEEKLY,
    VALID_DAYS
};
