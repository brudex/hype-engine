const Joi = require('joi');
const db = require('../../models');
const logger = require('../../utils/logger');

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
}).unknown(false);

const SENSITIVE_KEYS = /token|secret|password|authorization|api[_-]?key/i;

function sanitize(value) {
    if (Array.isArray(value)) return value.map(sanitize);
    if (value && typeof value === 'object') {
        return Object.entries(value).reduce((result, [key, item]) => {
            result[key] = SENSITIVE_KEYS.test(key) ? '[REDACTED]' : sanitize(item);
            return result;
        }, {});
    }
    return value;
}

async function list(req, res) {
    const query = querySchema.validate(req.query, { abortEarly: false, convert: true });
    if (query.error) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid pagination parameters'
        });
    }

    try {
        const post = await db.Post.findOne({
            where: {
                uuid: req.params.postUuid,
                projectUuid: req.params.projectUuid
            },
            include: [{
                model: db.Project,
                as: 'project',
                where: { userUuid: req.user.uuid },
                attributes: []
            }]
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Post not found'
            });
        }

        const { page, limit } = query.value;
        const { count, rows } = await db.PostHistory.findAndCountAll({
            where: { postUuid: post.uuid },
            include: [{
                model: db.Account,
                as: 'account',
                attributes: ['uuid', 'name', 'username', 'provider']
            }],
            order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit
        });

        return res.json({
            success: true,
            data: rows.map((row) => ({
                uuid: row.uuid,
                post_uuid: row.postUuid,
                account_uuid: row.accountUuid,
                account: row.account ? {
                    uuid: row.account.uuid,
                    name: row.account.name,
                    username: row.account.username,
                    provider: row.account.provider
                } : null,
                published_at: row.publishedAt,
                status: row.status,
                provider_post_id: row.providerPostId,
                recurring_type: row.recurringType,
                content: row.content,
                media: row.media || [],
                data: sanitize(row.data)
            })),
            meta: {
                total: count,
                page,
                per_page: limit,
                last_page: Math.ceil(count / limit) || 1
            }
        });
    } catch (error) {
        logger.error('API v1 - Post history error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to load post history'
        });
    }
}

module.exports = {
    list,
    sanitize
};
