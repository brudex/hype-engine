const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const Joi = require('joi');
const MediaService = require('../services/mixpost/media.service');

const PostsController = {};

/**
 * Render posts index page with project selection
 * @route GET /dashboard/posts
 */
PostsController.index = async (req, res) => {
    try {
        const { projectUuid = null } = req.params;
        const userUuid = req.user?.uuid;

        // Get all projects for the user
        const allProjects = await db.Project.findAll({
            where: { userUuid: userUuid },
            order: [['createdAt', 'DESC']]
        });

        // Get current project if projectUuid is provided in query
        let currentProject = null;
        if (projectUuid) {
            currentProject = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });
        }

        res.render('dashboard/posts/index', {
            projects: allProjects.map(p => ({
                uuid: p.uuid,
                name: p.name,
                description: p.description,
                imageUrl: p.imageUrl
            })),
            currentProject: currentProject ? {
                uuid: currentProject.uuid,
                name: currentProject.name,
                description: currentProject.description,
                imageUrl: currentProject.imageUrl
            } : null,
            projectUuid: projectUuid || null,
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Posts index error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load posts page',
            error: error.message
        });
    }
};

/**
 * Get posts list for a specific project (API)
 * @route GET /dashboard/api/posts/list/:projectUuid
 */
PostsController.list = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const { keyword, status, tags, accounts, page = 1 } = req.query;
        const limit = 20;
        const offset = (page - 1) * limit;
        const userUuid = req.user?.uuid;

            // Verify project belongs to user
            const project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Build where clause
        const where = {
            projectUuid: projectUuid
        };
        
        if (status !== undefined && status !== null && status !== '') {
            where.status = parseInt(status);
        }

        // Build include options
        const include = [
            {
                model: db.Account,
                as: 'accounts',
                through: { attributes: [] },
                required: accounts ? true : false,
                where: accounts ? { 
                    uuid: { [Op.in]: Array.isArray(accounts) ? accounts : [accounts] } 
                } : undefined
            },
            {
                model: db.Tag,
                as: 'tags',
                through: { attributes: [] },
                required: tags ? true : false,
                where: tags ? { 
                    uuid: { [Op.in]: Array.isArray(tags) ? tags : [tags] } 
                } : undefined
            },
            {
                model: db.PostVersion,
                as: 'versions',
                include: [{
                    model: db.Account,
                    as: 'account',
                    required: false
                }]
            }
        ];

        // Keyword search (search in post versions content)
        if (keyword) {
            include[2].where = {
                content: {
                    [Op.like]: `%${keyword}%`
                }
            };
        }

        const { count, rows: posts } = await db.Post.findAndCountAll({
            where,
            include,
            limit,
            offset,
            order: [['createdAt', 'DESC'], ['id', 'DESC']],
            distinct: true
        });

        // Get all accounts and tags for filters (for the project)
        const allAccounts = await db.Account.findAll({
            where: { projectUuid: projectUuid },
            order: [['createdAt', 'ASC']]
        });

        const allTags = await db.Tag.findAll({
            where: { projectUuid: projectUuid },
            order: [['createdAt', 'DESC']]
        });

        // Check for failed posts in this project
        const hasFailedPosts = await db.Post.count({
                where: {
                projectUuid: projectUuid,
                status: 3 // FAILED
            }
        }) > 0;

        // Collect all media UUIDs from all posts
        const allMediaUuids = [];
        posts.forEach(post => {
            post.versions?.forEach(version => {
                if (version.media && Array.isArray(version.media)) {
                    version.media.forEach(mediaUuid => {
                        if (typeof mediaUuid === 'string' && mediaUuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                            if (!allMediaUuids.includes(mediaUuid)) {
                                allMediaUuids.push(mediaUuid);
                            }
                }
            });
        }
            });
        });

        // Fetch all media records in one query
        const mediaRecords = allMediaUuids.length > 0 ? await db.Media.findAll({
            where: { uuid: { [Op.in]: allMediaUuids } }
        }) : [];
        
        // Create a map of UUID to media URL
        const mediaMap = {};
        mediaRecords.forEach(media => {
            mediaMap[media.uuid] = {
                uuid: media.uuid,
                name: media.name,
                url: MediaService.getMediaUrl(media),
                mime_type: media.mimeType
            };
        });

        // Format posts for response
        const formattedPosts = posts.map(post => {
            // Get original version content
            const originalVersion = post.versions?.find(v => v.isOriginal) || post.versions?.[0];
            let contentExcerpt = '';
            let media = [];
            
            if (originalVersion) {
                // Extract content from TEXT field
                if (originalVersion.content) {
                    // Remove HTML tags and get excerpt
                    const plainText = originalVersion.content.replace(/<[^>]*>/g, '').trim();
                    contentExcerpt = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
                }
                
                // Get media from JSON field and map to URLs
                if (originalVersion.media && Array.isArray(originalVersion.media)) {
                    media = originalVersion.media
                        .filter(mediaUuid => typeof mediaUuid === 'string')
                        .map(mediaUuid => mediaMap[mediaUuid])
                        .filter(media => media !== undefined); // Remove any that weren't found
                }
            }

            return {
                uuid: post.uuid,
                status: post.status,
                scheduleStatus: post.scheduleStatus,
                scheduledAt: post.scheduledAt,
                publishedAt: post.publishedAt,
                recurringType: post.recurringType ?? 0,
                recurringDays: post.recurringDays,
                recurringTime: post.recurringTime,
                recurringEndAt: post.recurringEndAt,
                accounts: (post.accounts || []).map(acc => ({
                    uuid: acc.uuid,
                    name: acc.name,
                    username: acc.username,
                    provider: acc.provider,
                    image: acc.media ? (typeof acc.media === 'string' ? JSON.parse(acc.media).url : acc.media.url) : null
                })),
                tags: (post.tags || []).map(tag => ({
                    uuid: tag.uuid,
                    name: tag.name,
                    hex_color: tag.hexColor
                })),
                versions: post.versions || [],
                content: {
                    excerpt: contentExcerpt,
                    media: media,
                    media_count: media.length
                },
                created_at: post.createdAt,
                updated_at: post.updatedAt
            };
        });

        return res.json({
            success: true,
            data: formattedPosts,
            meta: {
                current_page: parseInt(page),
                last_page: Math.ceil(count / limit),
                per_page: limit,
                total: count
            },
            accounts: allAccounts.map(acc => ({
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider,
                image: acc.media ? (typeof acc.media === 'string' ? JSON.parse(acc.media).url : acc.media.url) : null
            })),
            tags: allTags.map(tag => ({
                uuid: tag.uuid,
                name: tag.name,
                hex_color: tag.hexColor
            })),
            has_failed_posts: hasFailedPosts
        });
    } catch (error) {
        logger.error('PostsController.list - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            projectUuid: req.params.projectUuid
        });

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message
        });
    }
};

/**
 * Format a post with versions/accounts for dashboard preview modals.
 */
function formatPostForDashboardPreview(post, mediaMap = {}) {
    const originalVersion = post.versions?.find((v) => v.isOriginal) || post.versions?.[0];
    let contentExcerpt = '';
    let media = [];

    if (originalVersion) {
        if (originalVersion.content) {
            const plainText = originalVersion.content.replace(/<[^>]*>/g, '').trim();
            contentExcerpt = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
        }
        if (originalVersion.media && Array.isArray(originalVersion.media)) {
            media = originalVersion.media
                .filter((mediaUuid) => typeof mediaUuid === 'string')
                .map((mediaUuid) => mediaMap[mediaUuid])
                .filter(Boolean);
        }
    }

    return {
        uuid: post.uuid,
        status: post.status,
        scheduleStatus: post.scheduleStatus,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt,
        recurringType: post.recurringType ?? 0,
        recurringDays: post.recurringDays,
        recurringTime: post.recurringTime,
        recurringEndAt: post.recurringEndAt,
        accounts: (post.accounts || []).map((acc) => ({
            uuid: acc.uuid,
            name: acc.name,
            username: acc.username,
            provider: acc.provider,
            image: acc.media
                ? (typeof acc.media === 'string' ? JSON.parse(acc.media).url : acc.media.url)
                : null
        })),
        tags: (post.tags || []).map((tag) => ({
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor
        })),
        versions: post.versions || [],
        content: {
            excerpt: contentExcerpt,
            media,
            media_count: media.length
        },
        created_at: post.createdAt,
        updated_at: post.updatedAt
    };
}

/**
 * Post publish history page
 * @route GET /dashboard/posts/history/:postUuid
 */
PostsController.history = async (req, res) => {
    try {
        const { postUuid } = req.params;
        const userUuid = req.user?.uuid;

        const post = await db.Post.findOne({
            where: { uuid: postUuid },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    through: { attributes: [] }
                },
                {
                    model: db.PostVersion,
                    as: 'versions'
                },
                {
                    model: db.Tag,
                    as: 'tags',
                    through: { attributes: [] }
                }
            ]
        });

        if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('/dashboard/posts');
        }

        const project = await db.Project.findOne({
            where: {
                uuid: post.projectUuid,
                userUuid
            }
        });

        if (!project) {
            req.flash('error', 'Access denied');
            return res.redirect('/dashboard/posts');
        }

        const previewPost = formatPostForDashboardPreview(post);

        res.render('dashboard/posts/history', {
            post: previewPost,
            currentProject: {
                uuid: project.uuid,
                name: project.name
            },
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('PostsController.history - Error:', error);
        req.flash('error', 'Failed to load post history');
        return res.redirect('/dashboard/posts');
    }
};

/**
 * Resolve post history media JSON (UUIDs or objects) to URLs for the dashboard.
 */
async function resolveHistoryMediaForRows(rows) {
    const mediaUuids = [];
    rows.forEach((row) => {
        let raw = row.media;
        if (!raw) {
            return;
        }
        if (typeof raw === 'string') {
            try {
                raw = JSON.parse(raw);
            } catch {
                return;
            }
        }
        if (!Array.isArray(raw)) {
            return;
        }
        raw.forEach((item) => {
            if (typeof item === 'string' && /^[0-9a-f-]{36}$/i.test(item) && !mediaUuids.includes(item)) {
                mediaUuids.push(item);
            }
        });
    });

    const mediaMap = {};
    if (mediaUuids.length > 0) {
        const mediaRecords = await db.Media.findAll({
            where: { uuid: { [Op.in]: mediaUuids } }
        });
        mediaRecords.forEach((media) => {
            mediaMap[media.uuid] = {
                uuid: media.uuid,
                name: media.name,
                url: MediaService.getMediaUrl(media),
                mime_type: media.mimeType
            };
        });
    }

    return rows.map((row) => {
        let raw = row.media;
        if (!raw) {
            return [];
        }
        if (typeof raw === 'string') {
            try {
                raw = JSON.parse(raw);
            } catch {
                return [];
            }
        }
        if (!Array.isArray(raw)) {
            return [];
        }
        return raw
            .map((item) => {
                if (typeof item === 'string' && mediaMap[item]) {
                    return mediaMap[item];
                }
                if (item && typeof item === 'object' && item.url) {
                    return item;
                }
                return null;
            })
            .filter(Boolean);
    });
}

/**
 * List publish history for a post (API)
 * @route GET /dashboard/api/posts/history/:postUuid
 */
PostsController.listHistory = async (req, res) => {
    try {
        const { postUuid } = req.params;
        const { page = 1 } = req.query;
        const limit = 20;
        const offset = (page - 1) * limit;
        const userUuid = req.user?.uuid;

        const post = await db.Post.findOne({
            where: { uuid: postUuid },
            attributes: ['uuid', 'projectUuid']
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const project = await db.Project.findOne({
            where: { uuid: post.projectUuid, userUuid }
        });

        if (!project) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { count, rows } = await db.PostHistory.findAndCountAll({
            where: { postUuid },
            include: [
                {
                    model: db.Account,
                    as: 'account',
                    attributes: ['uuid', 'name', 'username', 'provider']
                }
            ],
            order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
            limit,
            offset
        });

        const resolvedMediaByRow = await resolveHistoryMediaForRows(rows);

        const data = rows.map((row, index) => {
            let contentExcerpt = '';
            if (row.content) {
                const plainText = row.content.replace(/<[^>]*>/g, '').trim();
                contentExcerpt = plainText;
            }
            const media = resolvedMediaByRow[index] || [];
            return {
                uuid: row.uuid,
                postUuid: row.postUuid,
                accountUuid: row.accountUuid,
                account: row.account
                    ? {
                        uuid: row.account.uuid,
                        name: row.account.name,
                        username: row.account.username,
                        provider: row.account.provider
                    }
                    : null,
                publishedAt: row.publishedAt,
                status: row.status,
                providerPostId: row.providerPostId,
                recurringType: row.recurringType,
                content: contentExcerpt,
                media,
                media_count: media.length,
                data: row.data
            };
        });

        return res.json({
            success: true,
            data,
            meta: {
                current_page: parseInt(page, 10),
                last_page: Math.ceil(count / limit) || 1,
                per_page: limit,
                total: count
            }
        });
    } catch (error) {
        logger.error('PostsController.listHistory - Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load post history',
            error: error.message
        });
    }
};

/**
 * Show create post form
 * @route GET /dashboard/posts/create/:projectUuid/:schedule_at?
 * @route GET /dashboard/posts/create/:schedule_at? (fallback)
 */
PostsController.create = async (req, res) => {
    try {
        const { projectUuid, schedule_at } = req.params;
        const { body, schedule_at: scheduleAtQuery } = req.query;
        const userUuid = req.user?.uuid;

        logger.info('PostsController.create - Request received:', {
            projectUuid: projectUuid,
            schedule_at: schedule_at,
            userUuid: userUuid,
            params: req.params,
            query: req.query
        });

        // Ensure user is authenticated
        if (!userUuid) {
            logger.warn('PostsController.create - Unauthenticated request');
            req.flash('error', 'Authentication required');
            return res.redirect('/dashboard/posts');
        }

        // Redirect to posts list if no projectUuid is provided
        if (!projectUuid) {
            logger.warn('PostsController.create - No projectUuid provided');
            req.flash('error', 'Project UUID is required');
            return res.redirect('/dashboard/posts');
        }

        // Check if projectUuid is actually a UUID format (8-4-4-4-12 hex characters)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        let actualProjectUuid = null;
        let actualScheduleAt = schedule_at || scheduleAtQuery;

        // If projectUuid looks like a UUID, use it; otherwise treat it as schedule_at
        if (projectUuid && uuidRegex.test(projectUuid)) {
            actualProjectUuid = projectUuid;
            logger.info('PostsController.create - Valid UUID format detected:', { actualProjectUuid });
        } else if (projectUuid) {
            // projectUuid param is actually schedule_at
            logger.warn('PostsController.create - projectUuid is not a valid UUID, treating as schedule_at:', { projectUuid });
            actualScheduleAt = projectUuid;
        }

        // If after validation, we still don't have a valid projectUuid, redirect
        if (!actualProjectUuid) {
            logger.warn('PostsController.create - No valid projectUuid after validation');
            req.flash('error', 'Invalid project UUID format');
            return res.redirect('/dashboard/posts');
        }

        // Get project if projectUuid is provided
        let currentProject = null;
        currentProject = await db.Project.findOne({
            where: {
                uuid: actualProjectUuid,
                userUuid: userUuid
            }
        });

        if (!currentProject) {
            logger.warn('PostsController.create - Project not found:', {
                projectUuid: actualProjectUuid,
                userUuid: userUuid
            });
            req.flash('error', 'Project not found or access denied');
            return res.redirect('/dashboard/posts');
        }

        logger.info('PostsController.create - Project found:', {
            projectUuid: currentProject.uuid,
            projectName: currentProject.name
        });

        // Query accounts for this project - explicitly include id field
        const accounts = await db.Account.findAll({
            where: {
                projectUuid: actualProjectUuid
            },
            order: [['createdAt', 'ASC']],
            attributes: ['id', 'uuid', 'name', 'username', 'provider', 'providerId', 'media', 'data', 'authorized', 'accessToken', 'projectUuid'] // Explicitly include id
        });

        // Format accounts for view (extract image from media JSON)
        // Ensure id is always present for frontend internal mapping
        const formattedAccounts = accounts.map(acc => {
            if (!acc.id) {
                logger.warn('PostsController.create - Account missing id field:', {
                    accountUuid: acc.uuid,
                    accountName: acc.name
                });
            }
            return {
                id: acc.id, // Keep ID for internal frontend mapping (required)
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider,
                providerId: acc.providerId,
                media: acc.media,
                data: acc.data,
                authorized: acc.authorized,
                accessToken: acc.accessToken,
                projectUuid: acc.projectUuid,
                image: acc.media ? (typeof acc.media === 'string' ? JSON.parse(acc.media).url : acc.media.url) : null
            };
        });

        // Query tags for this project
        const tags = await db.Tag.findAll({
            where: {
                projectUuid: actualProjectUuid
            },
            order: [['createdAt', 'DESC']]
        });

        // Parse schedule_at if provided
        let scheduleDate = null;
        let scheduleTime = null;
        if (actualScheduleAt) {
            const [date, time] = actualScheduleAt.split(' ');
            scheduleDate = date;
            scheduleTime = time;
        }
        logger.info('PostsController.create - Render create post page:', {
            accounts: formattedAccounts,
            tags: tags,
            currentProject: currentProject ? {
                uuid: currentProject.uuid,
                name: currentProject.name,
                description: currentProject.description,
                imageUrl: currentProject.imageUrl
            } : null,
            projectUuid: actualProjectUuid || null,
            schedule_at: {
                date: scheduleDate,
                time: scheduleTime
            },
            prefill: {
                body: body || ''
            }
        });

        res.render('dashboard/posts/create', {
            accounts: formattedAccounts,
            tags: tags,
            currentProject: currentProject ? {
                uuid: currentProject.uuid,
                name: currentProject.name,
                description: currentProject.description,
                imageUrl: currentProject.imageUrl
            } : null,
            projectUuid: actualProjectUuid || null,
            schedule_at: {
                date: scheduleDate,
                time: scheduleTime
            },
            prefill: {
                body: body || ''
            },
            is_configured_service: true, // TODO: Check actual service status
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Posts create error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load create post page',
            error: error.message
        });
    }
};

const RECURRING_ONE_TIME = 0;
const RECURRING_DAILY = 1;
const RECURRING_WEEKLY = 2;
const VALID_RECURRING_DAY_CODES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function normalizeRecurringDays(recurringDays) {
    if (recurringDays == null || recurringDays === '') {
        return null;
    }
    if (Array.isArray(recurringDays)) {
        const joined = recurringDays
            .map((d) => String(d).trim().toUpperCase())
            .filter((d) => VALID_RECURRING_DAY_CODES.includes(d))
            .join(',');
        return joined || null;
    }
    const joined = String(recurringDays)
        .split(',')
        .map((d) => d.trim().toUpperCase())
        .filter((d) => VALID_RECURRING_DAY_CODES.includes(d))
        .join(',');
    return joined || null;
}

function normalizeRecurringTime(recurringTime) {
    if (!recurringTime) {
        return null;
    }
    const str = String(recurringTime).trim();
    const match = str.match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
        return null;
    }
    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    if (Number.isNaN(hour) || Number.isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return null;
    }
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

function normalizeRecurringEndAt(recurringEndAt) {
    if (!recurringEndAt) {
        return null;
    }
    const parsed = new Date(recurringEndAt);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return parsed;
}

/**
 * Map one-time date/time or recurring fields to DB columns.
 * @returns {{ scheduledAt, recurringType, recurringDays, recurringTime, recurringEndAt, error? }}
 */
function resolveScheduleFields({ date, time, recurringType, recurringDays, recurringTime, recurringEndAt }) {
    const type = recurringType !== undefined && recurringType !== null ? Number(recurringType) : RECURRING_ONE_TIME;

    if (type === RECURRING_DAILY || type === RECURRING_WEEKLY) {
        const timeNorm = normalizeRecurringTime(recurringTime);
        if (!timeNorm) {
            return { error: 'Recurring time is required for daily or weekly posts' };
        }
        const daysNorm = normalizeRecurringDays(recurringDays);
        if (type === RECURRING_WEEKLY && !daysNorm) {
            return { error: 'At least one day of the week is required for weekly recurrence' };
        }
        return {
            scheduledAt: null,
            recurringType: type,
            recurringDays: type === RECURRING_WEEKLY ? daysNorm : null,
            recurringTime: timeNorm,
            recurringEndAt: normalizeRecurringEndAt(recurringEndAt)
        };
    }

    let scheduledAt = null;
    if (date && time) {
        try {
            scheduledAt = new Date(`${date} ${time}:00`);
            if (Number.isNaN(scheduledAt.getTime())) {
                scheduledAt = null;
            }
        } catch (err) {
            scheduledAt = null;
        }
    }

    return {
        scheduledAt,
        recurringType: RECURRING_ONE_TIME,
        recurringDays: null,
        recurringTime: null,
        recurringEndAt: null
    };
}

// Joi validation schema for post save
const postSaveSchema = Joi.object({
    projectUuid: Joi.string().uuid().required().messages({
        'string.empty': 'Project UUID is required',
        'string.guid': 'Project UUID must be a valid UUID',
        'any.required': 'Project UUID is required'
    }),
    versions: Joi.array().min(1).required().items(
        Joi.object({
            accountUuid: Joi.string().allow('').optional().default('').messages({
                'string.base': 'Account UUID must be a string'
            }),
            original: Joi.boolean().required().messages({
                'boolean.base': 'Original must be a boolean',
                'any.required': 'Original is required for each version'
            }),
            content: Joi.array().items(
                Joi.object({
                    body: Joi.string().allow('').max(5000).optional().default('').messages({
                        'string.max': 'Post body cannot exceed 5000 characters'
                    }),
                    media: Joi.array().items(
                        Joi.alternatives().try(
                            Joi.string().uuid(),
                            Joi.number().integer().positive()
                        )
                    ).optional().default([])
                })
            ).optional().default([])
        })
    ).messages({
        'array.min': 'At least one version is required',
        'any.required': 'Versions are required'
    }),
    tags: Joi.array().items(Joi.string().uuid()).optional().default([]),
    accountUuids: Joi.array().items(Joi.string().uuid()).optional().default([]).messages({
        'array.base': 'Account UUIDs must be an array',
        'string.guid': 'Each account UUID must be a valid UUID'
    }),
    date: Joi.string().allow(null, '').optional().default(null),
    time: Joi.string().allow(null, '').optional().default(null),
    status: Joi.number().integer().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (draft) or 1 (scheduled)'
    }),
    scheduleStatus: Joi.number().integer().valid(0, 1, 2).optional().messages({
        'number.base': 'scheduleStatus must be a number',
        'any.only': 'scheduleStatus must be 0 (PENDING), 1 (PROCESSING), or 2 (PROCESSED)'
    }),
    recurringType: Joi.number().integer().valid(0, 1, 2).optional().default(0).messages({
        'any.only': 'recurringType must be 0 (one-time), 1 (daily), or 2 (weekly)'
    }),
    recurringDays: Joi.alternatives().try(
        Joi.string().allow(null, '').max(32),
        Joi.array().items(Joi.string().valid(...VALID_RECURRING_DAY_CODES))
    ).optional().default(null),
    recurringTime: Joi.string().allow(null, '').optional().default(null),
    recurringEndAt: Joi.alternatives().try(
        Joi.date(),
        Joi.string().allow(null, '')
    ).optional().default(null)
});

/**
 * Save new post (API only)
 * @route POST /api/posts
 */
PostsController.save = async (req, res) => {
    try {
        // Log request body only for troubleshooting
        console.log('PostsController.save - Request received:', req.body);
        console.log('PostsController.save - Request received:', JSON.stringify(req.body));
        logger.info('PostsController.save - Request received:', JSON.stringify(req.body));
        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            logger.warn('PostsController.save - Unauthenticated request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const userUuid = req.user.uuid;
        // Validate request body using Joi
        const { error, value } = postSaveSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = {};
            error.details.forEach((detail) => {
                const field = detail.path.join('.');
                errors[field] = detail.message;
            });
            logger.warn('PostsController.save - Validation failed:', {
                userUuid: userUuid,
                errors: errors,
                payload: {
                    projectUuid: req.body.projectUuid,
                    versionsCount: req.body.versions?.length || 0,
                    tagsCount: req.body.tags?.length || 0,
                    date: req.body.date,
                    time: req.body.time
                }
            });

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        // Use validated and sanitized values
        const {
            projectUuid,
            versions,
            tags,
            accountUuids,
            date,
            time,
            status: statusFromBody,
            recurringType,
            recurringDays,
            recurringTime,
            recurringEndAt
        } = value;

        const scheduleFields = resolveScheduleFields({
            date,
            time,
            recurringType,
            recurringDays,
            recurringTime,
            recurringEndAt
        });

        if (scheduleFields.error) {
            return res.status(400).json({
                success: false,
                message: scheduleFields.error
            });
        }

        const { scheduledAt, recurringType: resolvedRecurringType, recurringDays: resolvedRecurringDays, recurringTime: resolvedRecurringTime, recurringEndAt: resolvedRecurringEndAt } = scheduleFields;

        logger.info('PostsController.save - Validated data:', {
            userUuid: userUuid,
            projectUuid: projectUuid,
            versionsCount: versions?.length || 0,
            tagsCount: tags?.length || 0,
            accountUuidsCount: accountUuids?.length || 0,
            date: date || 'not provided',
            time: time || 'not provided',
            scheduledAt: scheduledAt || 'not scheduled',
            recurringType: resolvedRecurringType
        });

        // Verify project belongs to user
        const project = await db.Project.findOne({
            where: {
                uuid: projectUuid,
                userUuid: userUuid
            }
        });

        if (!project) {
            logger.warn('PostsController.save - Project not found:', {
                userUuid: userUuid,
                projectUuid: projectUuid
            });
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        logger.info('PostsController.save - Creating post:', {
            userUuid: userUuid,
            projectUuid: projectUuid,
            scheduledAt: scheduledAt || null
        });

        const initialStatus = statusFromBody !== undefined && statusFromBody !== null ? statusFromBody : 0;

        // Create post (0=DRAFT, 1=SCHEDULED per model)
        const post = await db.Post.create({
            uuid: uuidv4(),
            status: initialStatus,
            scheduleStatus: 0, // PENDING
            scheduledAt: scheduledAt,
            recurringType: resolvedRecurringType,
            recurringDays: resolvedRecurringDays,
            recurringTime: resolvedRecurringTime,
            recurringEndAt: resolvedRecurringEndAt,
            userUuid: userUuid,
            projectUuid: projectUuid
        });

        logger.info('PostsController.save - Post created:', {
            postUuid: post.uuid,
            postId: post.id
        });

        // Create post versions
        if (versions && versions.length > 0) {
            for (const version of versions) {
                let accountUuid = null; // null for original versions
                // If not original and accountUuid is provided, validate the account exists
                if (!version.original) {
                    const account = await db.Account.findOne({
                        where: {
                            uuid: version.accountUuid,
                            projectUuid: projectUuid // Ensure account belongs to the project
                        }
                    });
                    if (!account) {
                        logger.warn('PostsController.save - Account not found:', {
                            accountUuid: version.accountUuid,
                            projectUuid: projectUuid
                        });
                        continue; // Skip this version if account not found
                    }
                    accountUuid = account.uuid;
                }
                // Process content array - extract body and media
                let contentBody = '';
                let mediaArray = [];
                if (version.content && Array.isArray(version.content) && version.content.length > 0) {
                    // Get body from first content item
                    contentBody = version.content[0].body || '';
                    // Get media UUIDs directly - no need to query
                    if (version.content[0].media && Array.isArray(version.content[0].media)) {
                        mediaArray = version.content[0].media.filter(mediaItem => {
                            // Only include valid UUIDs
                            return typeof mediaItem === 'string' && mediaItem.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                        });
                    }
                }
                
                await db.PostVersion.create({
                    postUuid: post.uuid,
                    accountUuid: accountUuid || '', // Empty string for original
                    isOriginal: version.original || false,
                    content: contentBody, // Store body as TEXT
                    media: mediaArray // Store media UUIDs as JSON array
                });
            }
            
            logger.info('PostsController.save - Versions created:', {
                postUuid: post.uuid,
                versionsCount: versions.length
            });
        }

        // Associate accounts - Create PostAccount records from accountUuids in payload
        if (accountUuids && accountUuids.length > 0) {
            // Validate that all account UUIDs belong to the project
            const validAccounts = await db.Account.findAll({
                where: {
                    uuid: accountUuids,
                    projectUuid: projectUuid
                }
            });
            
            const validAccountUuids = validAccounts.map(acc => acc.uuid);
            
            if (validAccountUuids.length > 0) {
                const postAccountRecords = validAccountUuids.map(accountUuid => ({
                    uuid: uuidv4(),
                    postUuid: post.uuid,
                    accountUuid: accountUuid,
                    providerPostId: null,
                    data: null,
                    errors: null
                }));
                
                await db.PostAccount.bulkCreate(postAccountRecords, {
                    ignoreDuplicates: true
                });
                
                logger.info('PostsController.save - PostAccount records created:', {
                    postUuid: post.uuid,
                    accountsCount: postAccountRecords.length,
                    providedAccountUuids: accountUuids.length,
                    validAccountUuids: validAccountUuids.length
                });
            } else {
                logger.warn('PostsController.save - No valid accounts found for PostAccount creation:', {
                    postUuid: post.uuid,
                    providedAccountUuids: accountUuids,
                    projectUuid: projectUuid
                });
            }
        }

        // Associate tags (tags are UUIDs) - Create TagPost records explicitly
        if (tags && tags.length > 0) {
            // Find tags by UUID
            const tagRecords = await db.Tag.findAll({
                where: {
                    uuid: tags
                }
            });
            
            // Create TagPost records explicitly to ensure they are saved
            if (tagRecords.length > 0) {
                const tagPostRecords = tagRecords.map(tag => ({
                    tagUuid: tag.uuid,
                    postUuid: post.uuid
                }));
                
                await db.TagPost.bulkCreate(tagPostRecords, {
                    ignoreDuplicates: true
                });
                
                logger.info('PostsController.save - TagPost records created:', {
                postUuid: post.uuid,
                    tagsCount: tagPostRecords.length
            });
            }
        }

        logger.info('PostsController.save - Post saved successfully:', {
            postUuid: post.uuid,
            postId: post.id,
            status: post.status
        });

        return res.json({
            success: true,
            message: 'Post created successfully',
            data: {
                uuid: post.uuid,
                status: post.status,
                scheduledAt: post.scheduledAt
            }
        });
    } catch (error) {
        console.log('PostsController.save - Error:', error);
        logger.error('PostsController.save - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            userUuid: req.user?.uuid || 'not authenticated',
            body: {
                projectUuid: req.body?.projectUuid,
                versionsCount: req.body?.versions?.length || 0,
                date: req.body?.date,
                time: req.body?.time
            }
        });

        return res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error.message
        });
    }
};

/**
 * Show edit post form
 * @route GET /dashboard/posts/:uuid
 */
PostsController.edit = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userUuid = req.user?.uuid;

        // Ensure user is authenticated
        if (!userUuid) {
            logger.warn('PostsController.edit - Unauthenticated request');
            req.flash('error', 'Authentication required');
            return res.redirect('/dashboard/posts');
        }

        // Only verify post exists and belongs to user - don't load full data
        const post = await db.Post.findOne({
            where: { uuid, userUuid },
            include: [
                {
                    model: db.Project,
                    as: 'project',
                    attributes: ['uuid', 'name', 'description', 'imageUrl']
                }
            ],
            attributes: ['uuid', 'status'] // Only need UUID for verification
        });

        if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('/dashboard/posts');
        }

        // Get project from post
        const currentProject = post.project;

        if (!currentProject) {
            req.flash('error', 'Project not found for this post');
            return res.redirect('/dashboard/posts');
        }

        // Query accounts for this project (same as create method)
        const accounts = await db.Account.findAll({
            where: {
                projectUuid: currentProject.uuid
            },
            order: [['createdAt', 'ASC']]
        });

        // Format accounts for view (same as create method)
        const formattedAccounts = accounts.map(acc => ({
            id: acc.id, // Keep ID for internal frontend mapping
            uuid: acc.uuid,
            name: acc.name,
            username: acc.username,
            provider: acc.provider,
            providerId: acc.providerId,
            media: acc.media,
            data: acc.data,
            authorized: acc.authorized,
            accessToken: acc.accessToken,
            projectUuid: acc.projectUuid,
            image: acc.media ? (typeof acc.media === 'string' ? JSON.parse(acc.media).url : acc.media.url) : null
        }));

        // Query tags for this project (same as create method)
        const tags = await db.Tag.findAll({
            where: {
                projectUuid: currentProject.uuid
            },
            order: [['createdAt', 'DESC']]
        });
        logger.info('PostsController.edit - Post status:>>>>>>>>>>>>>>>>>>>>>>>>>', {
            status: post.status,
            statusString: (post.status < 1) ? 'draft' : (post.status == 1) ? 'scheduled' : (post.status == 2) ? 'published' : 'failed'
        });

        // Render page with minimal data - full post data will be fetched via API
        res.render('dashboard/posts/edit', {
            post: {
                uuid: post.uuid, // Only pass UUID - frontend will fetch full data via API
                status: post.status,
                statusString: (post.status < 1) ? 'draft' : (post.status == 1) ? 'scheduled' : (post.status == 2) ? 'published' : 'failed'
            },
            accounts: formattedAccounts,
            tags: tags,
            currentProject: currentProject ? {
                uuid: currentProject.uuid,
                name: currentProject.name,
                description: currentProject.description,
                imageUrl: currentProject.imageUrl
            } : null,
            projectUuid: currentProject.uuid || null,
            schedule_at: { date: null, time: null }, // Will be loaded from API
            prefill: { body: '' }, // Will be loaded from API
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Posts edit error:', error);
        req.flash('error', 'Failed to load post');
        res.redirect('/dashboard/posts');
    }
};

/**
 * Get post details for editing (API only - returns JSON)
 * @route GET /api/posts/:uuid
 */
PostsController.getPost = async (req, res) => {
    try {
        const { uuid } = req.params;
        const userUuid = req.user?.uuid;

        // Ensure user is authenticated
        if (!userUuid) {
            logger.warn('PostsController.getPost - Unauthenticated request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const post = await db.Post.findOne({
            where: { uuid, userUuid },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    through: { attributes: [] }
                },
                {
                    model: db.PostVersion,
                    as: 'versions',
                    include: [{
                        model: db.Account,
                        as: 'account'
                    }]
                },
                {
                    model: db.Tag,
                    as: 'tags',
                    through: { attributes: [] }
                },
                {
                    model: db.Project,
                    as: 'project'
                }
            ]
        });

        if (!post) {
            logger.warn('PostsController.getPost - Post not found or access denied:', {
                userUuid: userUuid,
                postUuid: uuid
            });
            return res.status(404).json({
                success: false,
                message: 'Post not found or access denied'
            });
        }

        // Collect all media UUIDs from versions
        const allMediaUuids = [];
        (post.versions || []).forEach(version => {
            if (version.media) {
                let mediaArray = [];
                if (Array.isArray(version.media)) {
                    mediaArray = version.media;
                } else if (typeof version.media === 'string') {
                    try {
                        mediaArray = JSON.parse(version.media);
                    } catch (e) {
                        mediaArray = [];
                    }
                }
                mediaArray.forEach(mediaUuid => {
                    if (typeof mediaUuid === 'string' && allMediaUuids.indexOf(mediaUuid) === -1) {
                        allMediaUuids.push(mediaUuid);
                    }
                });
            }
        });

        // Fetch media records
        const mediaRecords = allMediaUuids.length > 0 ? await db.Media.findAll({
            where: { uuid: { [Op.in]: allMediaUuids } }
        }) : [];
        
        // Create a map of UUID to media object
        const mediaMap = {};
        mediaRecords.forEach(media => {
            mediaMap[media.uuid] = {
                uuid: media.uuid,
                name: media.name,
                url: MediaService.getMediaUrl(media),
                mime_type: media.mimeType || media.mime_type,
                size: media.size
            };
        });

        // Format versions with content and media
        // Format: { accountUuid: "", original: true, content: [{ body: "", media: [uuid1, uuid2] }] }
        const formattedVersions = (post.versions || []).map(version => {
            let contentBody = '';
            let mediaUuids = [];

            // Content is stored as TEXT in database
            if (version.content) {
                contentBody = typeof version.content === 'string' ? version.content : '';
            }

            // Media is stored as JSON array - extract UUIDs only (not full objects)
            if (version.media) {
                if (Array.isArray(version.media)) {
                    // If it's already an array, extract UUIDs
                    mediaUuids = version.media
                        .map(item => {
                            // If item is an object, get uuid; if it's a string, use it directly
                            return typeof item === 'object' && item !== null ? (item.uuid || item) : item;
                        })
                        .filter(uuid => typeof uuid === 'string' && uuid.length > 0);
                } else if (typeof version.media === 'string') {
                    try {
                        const parsed = JSON.parse(version.media);
                        if (Array.isArray(parsed)) {
                            mediaUuids = parsed
                                .map(item => {
                                    return typeof item === 'object' && item !== null ? (item.uuid || item) : item;
                                })
                                .filter(uuid => typeof uuid === 'string' && uuid.length > 0);
                        }
                    } catch (e) {
                        mediaUuids = [];
                    }
                }
            }

            // Determine accountUuid: empty string for original, UUID for account-specific versions
            const isOriginal = version.isOriginal || (version.accountUuid === null || version.accountUuid === '');
            const accountUuid = isOriginal ? '' : (version.accountUuid || '');

            // Convert media UUIDs to media objects with URLs for display
            const mediaObjects = mediaUuids
                .map(uuid => mediaMap[uuid])
                .filter(media => media !== undefined); // Remove any that weren't found

            return {
                accountUuid: accountUuid,
                original: isOriginal,
                content: [{
                    body: contentBody,
                    media: mediaObjects // Array of media objects with url, uuid, name, etc.
                }]
            };
        });

        // Format accounts - include ID for internal frontend mapping
        const formattedAccounts = (post.accounts || []).map(account => ({
            id: account.id, // Keep ID for internal frontend mapping
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) : null
        }));

        // Format tags
        const formattedTags = (post.tags || []).map(tag => ({
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor || tag.hex_color
        }));

        return res.json({
            success: true,
            data: {
                uuid: post.uuid,
                status: post.status,
                scheduleStatus: post.scheduleStatus,
                scheduledAt: post.scheduledAt,
                publishedAt: post.publishedAt,
                recurringType: post.recurringType ?? 0,
                recurringDays: post.recurringDays,
                recurringTime: post.recurringTime,
                recurringEndAt: post.recurringEndAt,
                accounts: formattedAccounts,
                tags: formattedTags,
                versions: formattedVersions,
                project: post.project ? {
                    uuid: post.project.uuid,
                    name: post.project.name
                } : null,
                created_at: post.createdAt,
                updated_at: post.updatedAt
            }
        });
    } catch (error) {
        logger.error('PostsController.getPost - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            postUuid: req.params.uuid,
            userUuid: req.user?.uuid || 'not authenticated'
        });

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
};

/**
 * Update post (API only - returns JSON)
 * References PostsController.save for payload format and handling
 * @route POST /api/posts/update
 */
PostsController.update = async (req, res) => {
    try {
        const { uuid } = req.body;
        const userUuid = req.user?.uuid;

        // Log received payload for troubleshooting
        logger.info('PostsController.update - Received update request:', {
            userUuid: userUuid,
            postUuid: uuid,
            payload: JSON.stringify(req.body, null, 2),
            payloadKeys: Object.keys(req.body),
            versionsCount: req.body.versions ? req.body.versions.length : 0,
            accountUuidsCount: req.body.accountUuids ? req.body.accountUuids.length : 0,
            tagsCount: req.body.tags ? req.body.tags.length : 0,
            timestamp: new Date().toISOString()
        });
        console.log('PostsController.update - Full payload received:', JSON.stringify(req.body, null, 2));

        // Ensure user is authenticated
        if (!userUuid) {
            logger.warn('PostsController.update - Unauthenticated request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Validate request body - use schema but make projectUuid optional for updates
        // Also add uuid to schema for update
        const updateSchema = postSaveSchema.keys({
            uuid: Joi.string().uuid().required().messages({
                'string.empty': 'Post UUID is required',
                'string.guid': 'Post UUID must be a valid UUID',
                'any.required': 'Post UUID is required'
            })
        }).fork(['projectUuid'], (schema) => schema.optional());
        
        const { error, value } = updateSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = {};
            error.details.forEach((detail) => {
                const field = detail.path.join('.');
                errors[field] = detail.message;
            });
            logger.warn('PostsController.update - Validation failed:', {
                userUuid: userUuid,
                postUuid: uuid,
                errors: errors
            });

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Use validated and sanitized values
        const {
            versions,
            tags,
            accountUuids,
            date,
            time,
            status: statusFromBody,
            scheduleStatus: scheduleStatusFromBody,
            recurringType,
            recurringDays,
            recurringTime,
            recurringEndAt
        } = value;

        const scheduleFields = resolveScheduleFields({
            date,
            time,
            recurringType,
            recurringDays,
            recurringTime,
            recurringEndAt
        });

        if (scheduleFields.error) {
            return res.status(400).json({
                success: false,
                message: scheduleFields.error
            });
        }

        const { scheduledAt, recurringType: resolvedRecurringType, recurringDays: resolvedRecurringDays, recurringTime: resolvedRecurringTime, recurringEndAt: resolvedRecurringEndAt } = scheduleFields;
        
        logger.info('PostsController.update - Validated payload:', {
            postUuid: uuid,
            status: statusFromBody,
            scheduleStatus: scheduleStatusFromBody,
            versionsCount: versions ? versions.length : 0,
            accountUuidsCount: accountUuids ? accountUuids.length : 0,
            tagsCount: tags ? tags.length : 0,
            date: date || null,
            time: time || null,
            recurringType: resolvedRecurringType,
            versions: versions ? versions.map(v => ({
                accountUuid: v.accountUuid,
                original: v.original,
                contentBodyLength: v.content && v.content[0] ? v.content[0].body?.length || 0 : 0,
                mediaCount: v.content && v.content[0] ? (v.content[0].media?.length || 0) : 0
            })) : []
        });

        const post = await db.Post.findOne({ 
            where: { uuid, userUuid } 
        });

        if (!post) {
            logger.warn('PostsController.update - Post not found or access denied:', {
                userUuid: userUuid,
                postUuid: uuid
            });
            return res.status(404).json({
                success: false,
                message: 'Post not found or access denied'
            });
        }

        if (statusFromBody === 1 && resolvedRecurringType === RECURRING_ONE_TIME && scheduledAt && scheduledAt.getTime() <= Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Scheduled time must be in the future'
            });
        }

        // Update post fields
        post.scheduledAt = scheduledAt;
        post.recurringType = resolvedRecurringType;
        post.recurringDays = resolvedRecurringDays;
        post.recurringTime = resolvedRecurringTime;
        post.recurringEndAt = resolvedRecurringEndAt;
        if (statusFromBody !== undefined && statusFromBody !== null) {
            post.status = statusFromBody;
        }
        if (scheduleStatusFromBody !== undefined && scheduleStatusFromBody !== null) {
            post.scheduleStatus = scheduleStatusFromBody;
        }
        await post.save();

        logger.info('PostsController.update - Post updated:', {
            postUuid: post.uuid,
            scheduledAt: scheduledAt || null,
            recurringType: resolvedRecurringType
        });

        // Update versions
        if (versions && versions.length > 0) {
            // Delete existing versions
            await db.PostVersion.destroy({ where: { postUuid: post.uuid } });
            
            // Create new versions
            for (const version of versions) {
                let accountUuid = null; // null for original versions
                
                // If not original and accountUuid is provided, validate the account exists
                if (!version.original && version.accountUuid) {
                    const account = await db.Account.findOne({
                        where: {
                            uuid: version.accountUuid,
                            projectUuid: post.projectUuid // Ensure account belongs to the post's project
                        }
                    });
                    
                    if (!account) {
                        logger.warn('PostsController.update - Account not found:', {
                            accountUuid: version.accountUuid,
                            projectUuid: post.projectUuid
                        });
                        continue; // Skip this version if account not found
                    }
                    
                    accountUuid = account.uuid;
                }
                
                // Process content array - extract body and media
                let contentBody = '';
                let mediaArray = [];
                
                if (version.content && Array.isArray(version.content) && version.content.length > 0) {
                    // Get body from first content item
                    contentBody = version.content[0].body || '';
                    
                    // Get media UUIDs directly - no need to query
                    if (version.content[0].media && Array.isArray(version.content[0].media)) {
                        mediaArray = version.content[0].media.filter(mediaItem => {
                            // Only include valid UUIDs
                            return typeof mediaItem === 'string' && mediaItem.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                        });
                    }
                }
                
                await db.PostVersion.create({
                    postUuid: post.uuid,
                    accountUuid: accountUuid || '', // Empty string for original
                    isOriginal: version.original || false,
                    content: contentBody, // Store body as TEXT
                    media: mediaArray // Store media UUIDs as JSON array
                });
            }
            
            logger.info('PostsController.update - Versions updated:', {
                postUuid: post.uuid,
                versionsCount: versions.length
            });
        }

        // Associate accounts - Create PostAccount records from accountUuids in payload (same as save)
        if (accountUuids && accountUuids.length > 0) {
            // Delete existing PostAccount records
            await db.PostAccount.destroy({ where: { postUuid: post.uuid } });
            
            // Validate that all account UUIDs belong to the project
            const validAccounts = await db.Account.findAll({
                where: {
                    uuid: accountUuids,
                    projectUuid: post.projectUuid
                }
            });
            
            const validAccountUuids = validAccounts.map(acc => acc.uuid);
            
            if (validAccountUuids.length > 0) {
                const postAccountRecords = validAccountUuids.map(accountUuid => ({
                    uuid: uuidv4(),
                    postUuid: post.uuid,
                    accountUuid: accountUuid,
                    providerPostId: null,
                    data: null,
                    errors: null
                }));
                
                await db.PostAccount.bulkCreate(postAccountRecords, {
                    ignoreDuplicates: true
                });
                
                logger.info('PostsController.update - PostAccount records created:', {
                    postUuid: post.uuid,
                    accountsCount: postAccountRecords.length,
                    providedAccountUuids: accountUuids.length,
                    validAccountUuids: validAccountUuids.length
                });
            } else {
                logger.warn('PostsController.update - No valid accounts found for PostAccount creation:', {
                    postUuid: post.uuid,
                    providedAccountUuids: accountUuids,
                    projectUuid: post.projectUuid
                });
            }
        } else {
            // Remove all account associations if no accounts provided
            await db.PostAccount.destroy({ where: { postUuid: post.uuid } });
        }

        // Associate tags (tags are UUIDs) - Create TagPost records explicitly (same as save)
        if (tags && tags.length > 0) {
            // Delete existing TagPost records for this post
            await db.TagPost.destroy({
                where: { postUuid: post.uuid }
            });
            
                // Find tags by UUID
                const tagRecords = await db.Tag.findAll({
                    where: {
                        uuid: tags
                    }
                });
            
            // Create TagPost records explicitly
            if (tagRecords.length > 0) {
                const tagPostRecords = tagRecords.map(tag => ({
                    tagUuid: tag.uuid,
                    postUuid: post.uuid
                }));
                
                await db.TagPost.bulkCreate(tagPostRecords, {
                    ignoreDuplicates: true
                });
                
                logger.info('PostsController.update - TagPost records created:', {
                    postUuid: post.uuid,
                    tagsCount: tagPostRecords.length
                });
            }
            } else {
            // Remove all tag associations if no tags provided
            await db.TagPost.destroy({ where: { postUuid: post.uuid } });
        }

        // Get final counts for summary
        const finalVersionCount = await db.PostVersion.count({ where: { postUuid: post.uuid } });
        const finalPostAccountCount = await db.PostAccount.count({ where: { postUuid: post.uuid } });
        const finalTagPostCount = await db.TagPost.count({ where: { postUuid: post.uuid } });

        logger.info('PostsController.update - Post updated successfully:', {
            postUuid: post.uuid,
            postId: post.id,
            status: post.status,
            scheduledAt: post.scheduledAt,
            finalCounts: {
                versions: finalVersionCount,
                postAccounts: finalPostAccountCount,
                tagPosts: finalTagPostCount
            }
        });
        console.log('PostsController.update - Update completed successfully:', {
            postUuid: post.uuid,
            versionsCreated: finalVersionCount,
            accountsLinked: finalPostAccountCount,
            tagsLinked: finalTagPostCount
        });

            return res.json({
                success: true,
                message: 'Post updated successfully',
                data: {
                    uuid: post.uuid,
                    status: post.status,
                    scheduleStatus: post.scheduleStatus,
                    scheduledAt: post.scheduledAt
                }
            });
    } catch (error) {
        logger.error('PostsController.update - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            postUuid: req.params.uuid,
            userUuid: req.user?.uuid || 'not authenticated'
        });
        
        return res.status(500).json({
            success: false,
            message: 'Failed to update post',
            error: error.message
        });
    }
};

/**
 * Delete post
 * @route DELETE /dashboard/posts/:uuid
 * @route DELETE /api/posts/:uuid
 */
/**
 * Delete a post (API only - returns JSON)
 * Deletes all related records: PostVersion, PostAccount, TagPost, then Post
 * @route GET /api/posts/delete/:uuid
 */
PostsController.delete = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            logger.warn('PostsController.delete - Unauthenticated request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userUuid = req.user.uuid;

        logger.info('PostsController.delete - Request received:', {
            userUuid: userUuid,
            postUuid: uuid,
            timestamp: new Date().toISOString()
        });

        // Find post and verify it belongs to user's project
        const post = await db.Post.findOne({
            where: { uuid },
            include: [
                {
                    model: db.Project,
                    as: 'project',
                    attributes: ['uuid', 'userUuid']
                }
            ]
        });

        if (!post) {
            logger.warn('PostsController.delete - Post not found:', {
                userUuid: userUuid,
                postUuid: uuid
            });
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

        // Verify post belongs to user's project
        if (post.project && post.project.userUuid !== userUuid) {
            logger.warn('PostsController.delete - Access denied:', {
                userUuid: userUuid,
                postUuid: uuid,
                postProjectUserUuid: post.project.userUuid
            });
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        logger.info('PostsController.delete - Deleting post and related records:', {
            postUuid: uuid,
            postId: post.id
        });

        // Delete all related records in the correct order
        // 1. Delete PostVersion records
        const deletedVersions = await db.PostVersion.destroy({
            where: { postUuid: uuid }
        });
        logger.info('PostsController.delete - PostVersion records deleted:', {
            postUuid: uuid,
            count: deletedVersions
        });

        // 2. Delete PostAccount records
        const deletedPostAccounts = await db.PostAccount.destroy({
            where: { postUuid: uuid }
        });
        logger.info('PostsController.delete - PostAccount records deleted:', {
            postUuid: uuid,
            count: deletedPostAccounts
        });

        // 3. Delete TagPost records
        const deletedTagPosts = await db.TagPost.destroy({
            where: { postUuid: uuid }
        });
        logger.info('PostsController.delete - TagPost records deleted:', {
            postUuid: uuid,
            count: deletedTagPosts
        });

        // 4. Finally, delete the Post record
        await post.destroy();
        logger.info('PostsController.delete - Post deleted successfully:', {
            postUuid: uuid,
            postId: post.id
        });

            return res.json({
                success: true,
            message: 'Post deleted successfully',
            data: {
                postUuid: uuid,
                deletedRecords: {
                    versions: deletedVersions,
                    postAccounts: deletedPostAccounts,
                    tagPosts: deletedTagPosts
                }
            }
        });
    } catch (error) {
        logger.error('PostsController.delete - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            postUuid: req.params.uuid,
            userUuid: req.user?.uuid || 'not authenticated'
        });
            return res.status(500).json({
                success: false,
                message: 'Failed to delete post',
                error: error.message
            });
    }
};

/**
 * Duplicate a post
 * @route GET /api/posts/duplicate/:uuid
 */
PostsController.duplicatePost = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userUuid = req.user.uuid;

        logger.info('PostsController.duplicatePost - Request received:', {
            userUuid: userUuid,
            postUuid: uuid,
            timestamp: new Date().toISOString()
        });

        const originalPost = await db.Post.findOne({
            where: { uuid },
            include: [
                {
                    model: db.Account,
                    as: 'accounts',
                    through: { attributes: [] }
                },
                {
                    model: db.Tag,
                    as: 'tags',
                    through: { attributes: [] }
                },
                {
                    model: db.PostVersion,
                    as: 'versions'
                },
                {
                    model: db.Project,
                    as: 'project',
                    attributes: ['uuid']
                }
            ]
        });

        if (!originalPost) {
            logger.warn('PostsController.duplicatePost - Post not found:', {
                userUuid: userUuid,
                postUuid: uuid
            });
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Verify post belongs to user's project
        const project = await db.Project.findOne({
            where: {
                uuid: originalPost.projectUuid,
                userUuid: userUuid
            }
        });

        if (!project) {
            logger.warn('PostsController.duplicatePost - Project not found or access denied:', {
                userUuid: userUuid,
                projectUuid: originalPost.projectUuid
            });
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        logger.info('PostsController.duplicatePost - Creating duplicate post:', {
            userUuid: userUuid,
            originalPostUuid: uuid,
            projectUuid: originalPost.projectUuid
        });

        // Create new post (use same project as original)
        const newPostUuid = uuidv4();
        const newPost = await db.Post.create({
            uuid: newPostUuid,
            status: 0, // DRAFT
            scheduleStatus: 0, // PENDING
            userUuid: userUuid,
            projectUuid: originalPost.projectUuid
        });

        // Copy PostAccount records (using UUIDs)
        if (originalPost.accounts && originalPost.accounts.length > 0) {
            const accountUuids = originalPost.accounts.map(a => a.uuid);
            await db.PostAccount.bulkCreate(
                accountUuids.map(accountUuid => ({
                    uuid: uuidv4(),
                    postUuid: newPostUuid,
                    accountUuid: accountUuid
                }))
            );
            logger.info('PostsController.duplicatePost - PostAccount records created:', {
                newPostUuid: newPostUuid,
                accountsCount: accountUuids.length
            });
        }

        // Copy TagPost records (using UUIDs)
        if (originalPost.tags && originalPost.tags.length > 0) {
            const tagUuids = originalPost.tags.map(t => t.uuid);
            await db.TagPost.bulkCreate(
                tagUuids.map(tagUuid => ({
                    tagUuid: tagUuid,
                    postUuid: newPostUuid
                }))
            );
            logger.info('PostsController.duplicatePost - TagPost records created:', {
                newPostUuid: newPostUuid,
                tagsCount: tagUuids.length
            });
        }

        // Copy PostVersion records (using UUIDs)
        if (originalPost.versions && originalPost.versions.length > 0) {
            await db.PostVersion.bulkCreate(
                originalPost.versions.map(version => ({
                    uuid: uuidv4(),
                    postUuid: newPostUuid,
                    accountUuid: version.accountUuid || '', // Empty string for original
                    isOriginal: version.isOriginal || false,
                    content: version.content || '',
                    media: version.media || null
                }))
            );
            logger.info('PostsController.duplicatePost - PostVersion records created:', {
                newPostUuid: newPostUuid,
                versionsCount: originalPost.versions.length
            });
        }

        logger.info('PostsController.duplicatePost - Post duplicated successfully:', {
            originalPostUuid: uuid,
            newPostUuid: newPostUuid
        });

        // Redirect to edit page for the duplicated post
        return res.redirect(`/dashboard/posts/edit/${newPostUuid}`);
    } catch (error) {
        logger.error('PostsController.duplicatePost - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            postUuid: req.params.uuid,
            userUuid: req.user?.uuid || 'not authenticated'
        });
        return res.status(500).json({
            success: false,
            message: 'Failed to duplicate post',
            error: error.message
        });
    }
};

/**
 * Delete multiple posts
 * @route POST /api/posts/delete-multiple
 */
PostsController.deleteMultiple = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userUuid = req.user.uuid;
        const { uuids } = req.body; // Get from request body

        logger.info('PostsController.deleteMultiple - Request received:', {
            userUuid: userUuid,
            uuids: uuids,
            timestamp: new Date().toISOString()
        });

        // Validate uuids from request body (should be an array)
        let postUuids = [];
        if (uuids) {
            if (Array.isArray(uuids)) {
                postUuids = uuids.filter(uuid => uuid && typeof uuid === 'string' && uuid.trim() !== '');
            } else if (typeof uuids === 'string') {
                // Support comma-separated string as fallback
                postUuids = uuids.split(',').map(id => id.trim()).filter(id => id);
            }
        }

        if (!postUuids || postUuids.length === 0) {
            logger.warn('PostsController.deleteMultiple - No post UUIDs provided');
            return res.status(400).json({
                success: false,
                message: 'Post UUIDs are required in request body'
            });
        }

        // Verify posts belong to user's projects
        const posts = await db.Post.findAll({
            where: {
                uuid: { [Op.in]: postUuids }
            },
            include: [{
                model: db.Project,
                as: 'project',
                attributes: ['uuid', 'userUuid']
            }]
        });

        // Filter posts that belong to the user
        const userPosts = posts.filter(post => post.project && post.project.userUuid === userUuid);

        if (userPosts.length === 0) {
            logger.warn('PostsController.deleteMultiple - No posts found or access denied:', {
                userUuid: userUuid,
                requestedUuids: postUuids
            });
            return res.status(404).json({
                success: false,
                message: 'No posts found or you do not have permission to delete these posts'
            });
        }

        const postIdsToDelete = userPosts.map(p => p.uuid);

        logger.info('PostsController.deleteMultiple - Deleting posts:', {
            userUuid: userUuid,
            postUuids: postIdsToDelete,
            count: postIdsToDelete.length
        });

        const deletedCount = await db.Post.destroy({
            where: {
                uuid: { [Op.in]: postIdsToDelete }
            }
        });

        logger.info('PostsController.deleteMultiple - Posts deleted successfully:', {
            userUuid: userUuid,
            deletedCount: deletedCount
        });

        return res.json({
            success: true,
            message: `${deletedCount} post(s) deleted successfully`,
            data: {
                deleted_count: deletedCount
            }
        });
    } catch (error) {
        logger.error('PostsController.deleteMultiple - Error:', {
            error: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : 'No stack trace',
            userUuid: req.user?.uuid || 'not authenticated',
            uuids: req.body.uuids
        });
        return res.status(500).json({
            success: false,
            message: 'Failed to delete posts',
            error: error.message
        });
    }
};

module.exports = PostsController;

