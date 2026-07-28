const db = require('../../models');
const logger = require('../../utils/logger');
const PostSchedulingService = require('../../services/post-scheduling.service');
const {
    createSchema,
    updateSchema,
    scheduleSchema,
    validate,
    resolveSchedule,
    validateScheduledAt
} = require('../../services/api-v1/post-request.service');

const PostWritesApiController = {};

function badRequest(res, message, details) {
    return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message,
        ...(details ? { details } : {})
    });
}

async function projectForUser(projectUuid, userUuid, transaction) {
    return db.Project.findOne({
        where: { uuid: projectUuid, userUuid },
        transaction
    });
}

function unique(values) {
    return [...new Set(values.filter(Boolean))];
}

async function validateReferences(payload, projectUuid, userUuid, transaction) {
    const originalCount = payload.versions?.filter((version) => version.original).length;
    if (payload.versions && originalCount !== 1) {
        return { error: 'Exactly one original post version is required' };
    }

    const versionAccountUuids = payload.versions
        ? payload.versions.filter((version) => !version.original).map((version) => version.accountUuid)
        : [];
    const accountUuids = unique([...(payload.accountUuids || []), ...versionAccountUuids]);
    if (accountUuids.length) {
        const accounts = await db.Account.findAll({
            where: { uuid: accountUuids, projectUuid },
            transaction
        });
        if (accounts.length !== accountUuids.length) {
            return { error: 'One or more account UUIDs do not belong to this project' };
        }
        const unavailable = accounts.filter((account) => !account.authorized || !account.active);
        if (unavailable.length) {
            return {
                error: 'All selected accounts must be active and authorized',
                details: { accounts: unavailable.map((account) => account.uuid) }
            };
        }
        const selected = new Set(payload.accountUuids || []);
        const unselectedVersions = versionAccountUuids.filter((uuid) => !selected.has(uuid));
        if (unselectedVersions.length) {
            return {
                error: 'Account-specific versions must reference selected accountUuids',
                details: { accounts: unique(unselectedVersions) }
            };
        }
    }

    if (payload.tags?.length) {
        const tagCount = await db.Tag.count({
            where: { uuid: payload.tags, projectUuid },
            transaction
        });
        if (tagCount !== payload.tags.length) {
            return { error: 'One or more tag UUIDs do not belong to this project' };
        }
    }

    const mediaUuids = unique((payload.versions || []).flatMap((version) => version.content[0].media || []));
    if (mediaUuids.length) {
        const mediaCount = await db.Media.count({
            where: { uuid: mediaUuids, userUuid },
            transaction
        });
        if (mediaCount !== mediaUuids.length) {
            return { error: 'One or more media UUIDs do not belong to the authenticated user' };
        }
    }
    return {};
}

async function replaceVersions(postUuid, versions, transaction) {
    await db.PostVersion.destroy({ where: { postUuid }, transaction });
    await db.PostVersion.bulkCreate(versions.map((version) => ({
        postUuid,
        accountUuid: version.original ? '' : version.accountUuid,
        isOriginal: version.original,
        content: version.content[0].body,
        media: version.content[0].media
    })), { transaction });
}

async function replaceAccounts(postUuid, accountUuids, transaction) {
    await db.PostAccount.destroy({ where: { postUuid }, transaction });
    if (accountUuids.length) {
        await db.PostAccount.bulkCreate(accountUuids.map((accountUuid) => ({
            postUuid,
            accountUuid
        })), { transaction });
    }
}

async function replaceTags(postUuid, tags, transaction) {
    await db.TagPost.destroy({ where: { postUuid }, transaction });
    if (tags.length) {
        await db.TagPost.bulkCreate(tags.map((tagUuid) => ({
            postUuid,
            tagUuid
        })), { transaction });
    }
}

async function loadPost(postUuid, transaction) {
    return db.Post.findOne({
        where: { uuid: postUuid },
        include: [
            { model: db.Account, as: 'accounts', through: { attributes: [] } },
            { model: db.Tag, as: 'tags', through: { attributes: [] } },
            {
                model: db.PostVersion,
                as: 'versions',
                include: [{ model: db.Account, as: 'account' }]
            }
        ],
        transaction
    });
}

function formatPost(post) {
    return {
        uuid: post.uuid,
        status: post.status,
        schedule_status: post.scheduleStatus,
        scheduled_at: post.scheduledAt,
        published_at: post.publishedAt,
        recurring_type: post.recurringType,
        recurring_days: post.recurringDays ? post.recurringDays.split(',') : [],
        recurring_time: post.recurringTime,
        recurring_end_at: post.recurringEndAt,
        accounts: (post.accounts || []).map((account) => ({
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider
        })),
        tags: (post.tags || []).map((tag) => ({
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor
        })),
        versions: (post.versions || []).map((version) => ({
            account: version.account ? {
                uuid: version.account.uuid,
                name: version.account.name,
                username: version.account.username,
                provider: version.account.provider
            } : null,
            content: {
                body: version.content,
                media: version.media || []
            },
            is_original: version.isOriginal
        })),
        created_at: post.createdAt,
        updated_at: post.updatedAt
    };
}

PostWritesApiController.create = async (req, res) => {
    const validation = validate(createSchema, req.body);
    if (validation.error) return badRequest(res, 'Validation failed', validation.error);
    const schedule = resolveSchedule(validation.value);
    if (schedule.error) return badRequest(res, schedule.error);
    if (schedule.status === 1 && validation.value.accountUuids.length === 0) {
        return badRequest(res, 'At least one accountUuid is required for scheduled or recurring posts');
    }

    const transaction = await db.sequelize.transaction();
    try {
        const project = await projectForUser(req.params.projectUuid, req.user.uuid, transaction);
        if (!project) {
            await transaction.rollback();
            return res.status(404).json({ success: false, error: 'Not Found', message: 'Project not found' });
        }
        const references = await validateReferences(validation.value, project.uuid, req.user.uuid, transaction);
        if (references.error) {
            await transaction.rollback();
            return badRequest(res, references.error, references.details);
        }

        const post = await db.Post.create({
            projectUuid: project.uuid,
            userUuid: req.user.uuid,
            ...schedule
        }, { transaction });
        await replaceVersions(post.uuid, validation.value.versions, transaction);
        await replaceAccounts(post.uuid, validation.value.accountUuids, transaction);
        await replaceTags(post.uuid, validation.value.tags, transaction);
        const created = await loadPost(post.uuid, transaction);
        await transaction.commit();
        return res.status(201).json({ success: true, data: formatPost(created) });
    } catch (error) {
        await transaction.rollback();
        logger.error('API v1 - Create post error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to create post'
        });
    }
};

PostWritesApiController.update = async (req, res) => {
    const validation = validate(updateSchema, req.body);
    if (validation.error) return badRequest(res, 'Validation failed', validation.error);
    const transaction = await db.sequelize.transaction();
    try {
        const project = await projectForUser(req.params.projectUuid, req.user.uuid, transaction);
        if (!project) {
            await transaction.rollback();
            return res.status(404).json({ success: false, error: 'Not Found', message: 'Project not found' });
        }
        const post = await db.Post.findOne({
            where: { uuid: req.params.postUuid, projectUuid: project.uuid },
            transaction
        });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({ success: false, error: 'Not Found', message: 'Post not found' });
        }
        const effectivePayload = {
            ...validation.value,
            versions: validation.value.versions || undefined,
            accountUuids: validation.value.accountUuids || undefined,
            tags: validation.value.tags || undefined
        };
        const references = await validateReferences(effectivePayload, project.uuid, req.user.uuid, transaction);
        if (references.error) {
            await transaction.rollback();
            return badRequest(res, references.error, references.details);
        }

        const scheduleKeys = ['date', 'time', 'recurringType', 'recurringDays', 'recurringTime', 'recurringEndAt'];
        if (scheduleKeys.some((key) => Object.prototype.hasOwnProperty.call(req.body, key))) {
            const schedule = resolveSchedule(validation.value);
            if (schedule.error) {
                await transaction.rollback();
                return badRequest(res, schedule.error);
            }
            const accountCount = validation.value.accountUuids
                ? validation.value.accountUuids.length
                : await db.PostAccount.count({ where: { postUuid: post.uuid }, transaction });
            if (schedule.status === 1 && accountCount === 0) {
                await transaction.rollback();
                return badRequest(res, 'At least one accountUuid is required for scheduled or recurring posts');
            }
            Object.assign(post, schedule);
            await post.save({ transaction });
        }
        if (validation.value.versions) await replaceVersions(post.uuid, validation.value.versions, transaction);
        if (validation.value.accountUuids) await replaceAccounts(post.uuid, validation.value.accountUuids, transaction);
        if (validation.value.tags) await replaceTags(post.uuid, validation.value.tags, transaction);
        const updated = await loadPost(post.uuid, transaction);
        await transaction.commit();
        return res.json({ success: true, data: formatPost(updated) });
    } catch (error) {
        await transaction.rollback();
        logger.error('API v1 - Update post error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to update post'
        });
    }
};

PostWritesApiController.schedule = async (req, res) => {
    const validation = validate(scheduleSchema, req.body);
    if (validation.error) return badRequest(res, 'Validation failed', validation.error);
    const scheduled = validateScheduledAt(validation.value.scheduled_at);
    if (scheduled.error) return badRequest(res, scheduled.error);

    try {
        const project = await projectForUser(req.params.projectUuid, req.user.uuid);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Not Found', message: 'Project not found' });
        }
        const post = await db.Post.findOne({
            where: { uuid: req.params.postUuid, projectUuid: project.uuid },
            include: [{
                model: db.Account,
                as: 'accounts',
                through: { attributes: [] }
            }]
        });
        if (!post) {
            return res.status(404).json({ success: false, error: 'Not Found', message: 'Post not found' });
        }
        const accountCount = await db.PostAccount.count({ where: { postUuid: post.uuid } });
        if (accountCount === 0) {
            return badRequest(res, 'At least one account is required before scheduling a post');
        }
        const unavailable = post.accounts.filter((account) => !account.authorized || !account.active);
        if (unavailable.length) {
            return badRequest(res, 'All selected accounts must be active and authorized', {
                accounts: unavailable.map((account) => account.uuid)
            });
        }
        post.recurringType = 0;
        post.recurringDays = null;
        post.recurringTime = null;
        post.recurringEndAt = null;
        await post.save();
        await PostSchedulingService.schedulePost(post.uuid, scheduled.value);
        return res.json({
            success: true,
            message: 'Post scheduled successfully',
            data: {
                uuid: post.uuid,
                status: 1,
                scheduled_at: scheduled.value
            }
        });
    } catch (error) {
        logger.error('API v1 - Schedule post error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to schedule post'
        });
    }
};

module.exports = {
    PostWritesApiController,
    formatPost,
    validateReferences
};
