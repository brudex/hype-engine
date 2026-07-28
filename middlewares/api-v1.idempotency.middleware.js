const crypto = require('crypto');
const db = require('../models');
const logger = require('../utils/logger');

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

function stableValue(value) {
    if (Array.isArray(value)) {
        return value.map(stableValue);
    }
    if (value && typeof value === 'object' && !Buffer.isBuffer(value)) {
        return Object.keys(value).sort().reduce((result, key) => {
            result[key] = stableValue(value[key]);
            return result;
        }, {});
    }
    return value;
}

function fileDescriptors(files) {
    if (!files) return [];
    return Object.keys(files).sort().flatMap((field) => {
        const values = Array.isArray(files[field]) ? files[field] : [files[field]];
        return values.map((file) => ({
            field,
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            checksum: file.md5 || (file.data ? crypto.createHash('sha256').update(file.data).digest('hex') : null)
        }));
    });
}

function requestFingerprint(req) {
    const payload = {
        body: stableValue(req.body || {}),
        files: fileDescriptors(req.files)
    };
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

async function findExisting(identity) {
    return db.ApiIdempotencyKey.findOne({ where: identity });
}

async function idempotency(req, res, next) {
    const key = req.get('Idempotency-Key');
    if (!key) return next();
    if (key.length > 255 || !/^[\x21-\x7E]+$/.test(key)) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Idempotency-Key must contain 1-255 visible ASCII characters'
        });
    }

    const identity = {
        userUuid: req.user.uuid,
        apiKeyUuid: req.apiKey.uuid,
        method: req.method,
        path: req.baseUrl + req.path,
        key
    };
    const fingerprint = requestFingerprint(req);

    try {
        let record = await findExisting(identity);
        if (record && record.expiresAt <= new Date()) {
            await record.destroy();
            record = null;
        }
        if (record) {
            if (record.fingerprint !== fingerprint) {
                return res.status(409).json({
                    success: false,
                    error: 'Conflict',
                    message: 'Idempotency-Key was already used with a different request'
                });
            }
            if (record.state === 'completed') {
                res.set('Idempotency-Replayed', 'true');
                return res.status(record.statusCode).json(record.responseBody);
            }
            return res.status(409).json({
                success: false,
                error: 'Conflict',
                message: 'A request with this Idempotency-Key is still processing'
            });
        }

        try {
            record = await db.ApiIdempotencyKey.create({
                ...identity,
                fingerprint,
                state: 'processing',
                expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS)
            });
        } catch (error) {
            if (error.name !== 'SequelizeUniqueConstraintError') throw error;
            record = await findExisting(identity);
            if (record?.fingerprint === fingerprint && record.state === 'completed') {
                res.set('Idempotency-Replayed', 'true');
                return res.status(record.statusCode).json(record.responseBody);
            }
            return res.status(409).json({
                success: false,
                error: 'Conflict',
                message: 'A request with this Idempotency-Key is already processing'
            });
        }

        const originalJson = res.json.bind(res);
        res.json = (body) => {
            const statusCode = res.statusCode;
            record.update({
                state: 'completed',
                statusCode,
                responseBody: body
            }).then(() => {
                originalJson(body);
            }).catch((error) => {
                logger.error('Failed to persist idempotent response:', error);
                record.destroy()
                    .catch((destroyError) => logger.error('Failed to clear idempotency record:', destroyError))
                    .finally(() => originalJson(body));
            });
            return res;
        };
        next();
    } catch (error) {
        logger.error('API v1 idempotency error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Idempotency handling failed'
        });
    }
}

module.exports = {
    idempotency,
    requestFingerprint,
    stableValue
};
