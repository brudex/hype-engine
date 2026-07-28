const db = require('../../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const PostSchedulingService = require('../../services/post-scheduling.service');

const PostsApiController = {};

/**
 * List posts
 * GET /api/v1/{projectUuid}/posts
 */
PostsApiController.list = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const { status, page = 1, limit = 20 } = req.query;
        const userUuid = req.user.uuid;
        const offset = (page - 1) * limit;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const where = {
            projectUuid: projectUuid
        };

        if (status !== undefined && status !== null && status !== '') {
            where.status = parseInt(status);
        }

        const include = [
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
                as: 'versions',
                include: [{
                    model: db.Account,
                    as: 'account'
                }]
            }
        ];

        const { count, rows: posts } = await db.Post.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC'], ['id', 'DESC']],
            distinct: true
        });

        const formattedPosts = posts.map(post => {
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
                accounts: (post.accounts || []).map(acc => ({
                    uuid: acc.uuid,
                    name: acc.name,
                    username: acc.username,
                    provider: acc.provider
                })),
                tags: (post.tags || []).map(tag => ({
                    uuid: tag.uuid,
                    name: tag.name,
                    hex_color: tag.hexColor
                })),
                versions: (post.versions || []).map(version => ({
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
                    is_original: version.isOriginal,
                    created_at: version.createdAt
                })),
                created_at: post.createdAt,
                updated_at: post.updatedAt
            };
        });

        res.json({
            success: true,
            data: formattedPosts,
            meta: {
                total: count,
                page: parseInt(page),
                per_page: parseInt(limit),
                last_page: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        logger.error('API v1 - List posts error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch posts'
        });
    }
};

/**
 * Get a post
 * GET /api/v1/{projectUuid}/posts/{postUuid}
 */
PostsApiController.get = async (req, res) => {
    try {
        const { postUuid, projectUuid } = req.params;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const post = await db.Post.findOne({
            where: {
                uuid: postUuid,
                projectUuid: projectUuid
            },
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
                    as: 'versions',
                    include: [{
                        model: db.Account,
                        as: 'account'
                    }]
                }
            ]
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Post not found'
            });
        }

        const formattedPost = {
            uuid: post.uuid,
            status: post.status,
            schedule_status: post.scheduleStatus,
            scheduled_at: post.scheduledAt,
            published_at: post.publishedAt,
            recurring_type: post.recurringType,
            recurring_days: post.recurringDays ? post.recurringDays.split(',') : [],
            recurring_time: post.recurringTime,
            recurring_end_at: post.recurringEndAt,
            accounts: (post.accounts || []).map(acc => ({
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider
            })),
            tags: (post.tags || []).map(tag => ({
                uuid: tag.uuid,
                name: tag.name,
                hex_color: tag.hexColor
            })),
            versions: (post.versions || []).map(version => ({
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
                is_original: version.isOriginal,
                created_at: version.createdAt
            })),
            created_at: post.createdAt,
            updated_at: post.updatedAt
        };

        res.json({
            success: true,
            data: formattedPost
        });
    } catch (error) {
        logger.error('API v1 - Get post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch post'
        });
    }
};

/**
 * Create a post
 * POST /api/v1/{projectUuid}/posts
 * Payload structure matches PostsController.save:
 * - versions: Array of version objects with accountUuid, original, content
 * - accountUuids: Array of account UUIDs for PostAccount records
 * - tags: Array of tag UUIDs
 * - date: Date string (optional, for scheduling)
 * - time: Time string (optional, for scheduling)
 */
PostsApiController.create = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const { versions, accountUuids, tags, date, time } = req.body;
        const userUuid = req.user.uuid;

        // Validate required fields
        if (!versions || !Array.isArray(versions) || versions.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'At least one version is required'
            });
        }

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        // Build scheduledAt from date and time
        let scheduledAt = null;
        if (date && time) {
            try {
                scheduledAt = new Date(`${date} ${time}:00`);
                if (isNaN(scheduledAt.getTime())) {
                    scheduledAt = null;
                }
            } catch (error) {
                logger.warn('API v1 - Create post - Invalid date/time format:', { date, time, error: error.message });
                scheduledAt = null;
            }
        }

        // Create post
        const post = await db.Post.create({
            uuid: uuidv4(),
            status: scheduledAt ? 1 : 0, // 1 = scheduled, 0 = draft
            scheduleStatus: 0, // PENDING
            projectUuid: projectUuid,
            userUuid: userUuid,
            scheduledAt: scheduledAt
        });

        // Create post versions
        if (versions && versions.length > 0) {
            for (const version of versions) {
                let accountUuid = null; // null for original versions
                // If not original and accountUuid is provided, validate the account exists
                if (!version.original && version.accountUuid) {
                    const account = await db.Account.findOne({
                        where: {
                            uuid: version.accountUuid,
                            projectUuid: projectUuid // Ensure account belongs to the project
                        }
                    });
                    if (!account) {
                        logger.warn('API v1 - Create post - Account not found:', {
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
            }
        }

        // Associate tags (tags are UUIDs) - Create TagPost records explicitly
        if (tags && tags.length > 0) {
            // Find tags by UUID
            const tagRecords = await db.Tag.findAll({
                where: {
                    uuid: tags,
                    projectUuid: projectUuid
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
            }
        }

        // If scheduled, schedule the post
        if (scheduledAt) {
            try {
                await PostSchedulingService.schedulePost(post.uuid, scheduledAt);
            } catch (scheduleError) {
                logger.error('API v1 - Schedule post error:', scheduleError);
                // Continue even if scheduling fails
            }
        }

        const createdPost = await db.Post.findOne({
            where: { uuid: post.uuid },
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
                    as: 'versions',
                    include: [{
                        model: db.Account,
                        as: 'account'
                    }]
                }
            ]
        });

        const formattedPost = {
            uuid: createdPost.uuid,
            status: createdPost.status,
            scheduled_at: createdPost.scheduledAt,
            published_at: createdPost.publishedAt,
            accounts: (createdPost.accounts || []).map(acc => ({
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider
            })),
            tags: (createdPost.tags || []).map(tag => ({
                uuid: tag.uuid,
                name: tag.name,
                hex_color: tag.hexColor
            })),
            versions: (createdPost.versions || []).map(version => ({
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
                is_original: version.isOriginal,
                created_at: version.createdAt
            })),
            created_at: createdPost.createdAt,
            updated_at: createdPost.updatedAt
        };

        res.status(201).json({
            success: true,
            data: formattedPost
        });
    } catch (error) {
        logger.error('API v1 - Create post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to create post'
        });
    }
};

/**
 * Update a post
 * PUT /api/v1/{projectUuid}/posts/{postUuid}
 * Payload structure matches PostsController.update:
 * - versions: Array of version objects with accountUuid, original, content
 * - accountUuids: Array of account UUIDs for PostAccount records
 * - tags: Array of tag UUIDs
 * - date: Date string (optional, for scheduling)
 * - time: Time string (optional, for scheduling)
 */
PostsApiController.update = async (req, res) => {
    try {
        const { postUuid, projectUuid } = req.params;
        const { versions, accountUuids, tags, date, time } = req.body;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const post = await db.Post.findOne({
            where: {
                uuid: postUuid,
                projectUuid: projectUuid
            }
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Post not found'
            });
        }

        // Update versions if provided
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
                            projectUuid: projectUuid // Ensure account belongs to the project
                        }
                    });
                    
                    if (!account) {
                        logger.warn('API v1 - Update post - Account not found:', {
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
        }

        // Associate accounts - Create PostAccount records from accountUuids in payload
        if (accountUuids !== undefined) {
            // Delete existing PostAccount records
            await db.PostAccount.destroy({ where: { postUuid: post.uuid } });
            
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
                }
            }
        }

        // Associate tags (tags are UUIDs) - Create TagPost records explicitly
        if (tags !== undefined) {
            // Delete existing TagPost records for this post
            await db.TagPost.destroy({
                where: { postUuid: post.uuid }
            });
            
            if (tags && tags.length > 0) {
                // Find tags by UUID
                const tagRecords = await db.Tag.findAll({
                    where: {
                        uuid: tags,
                        projectUuid: projectUuid
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
                }
            }
        }

        // Update scheduled_at if provided
        if (date !== undefined && time !== undefined) {
            let scheduledAt = null;
            if (date && time) {
                try {
                    scheduledAt = new Date(`${date} ${time}:00`);
                    if (isNaN(scheduledAt.getTime())) {
                        scheduledAt = null;
                    }
                } catch (error) {
                    logger.warn('API v1 - Update post - Invalid date/time format:', { date, time, error: error.message });
                    scheduledAt = null;
                }
            }
            
            if (scheduledAt) {
                post.scheduledAt = scheduledAt;
                post.status = 1; // Scheduled
                try {
                    await PostSchedulingService.schedulePost(post.uuid, scheduledAt);
                } catch (scheduleError) {
                    logger.error('API v1 - Schedule post error:', scheduleError);
                }
            } else {
                post.scheduledAt = null;
                post.status = 0; // Draft
            }
            await post.save();
        }

        const updatedPost = await db.Post.findOne({
            where: { uuid: post.uuid },
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
                    as: 'versions',
                    include: [{
                        model: db.Account,
                        as: 'account'
                    }]
                }
            ]
        });

        const formattedPost = {
            uuid: updatedPost.uuid,
            status: updatedPost.status,
            scheduled_at: updatedPost.scheduledAt,
            published_at: updatedPost.publishedAt,
            accounts: (updatedPost.accounts || []).map(acc => ({
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider
            })),
            tags: (updatedPost.tags || []).map(tag => ({
                uuid: tag.uuid,
                name: tag.name,
                hex_color: tag.hexColor
            })),
            versions: (updatedPost.versions || []).map(version => ({
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
                is_original: version.isOriginal,
                created_at: version.createdAt
            })),
            created_at: updatedPost.createdAt,
            updated_at: updatedPost.updatedAt
        };

        res.json({
            success: true,
            data: formattedPost
        });
    } catch (error) {
        logger.error('API v1 - Update post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to update post'
        });
    }
};

/**
 * Delete a post
 * DELETE /api/v1/{projectUuid}/posts/{postUuid}
 */
PostsApiController.delete = async (req, res) => {
    try {
        const { postUuid, projectUuid } = req.params;
        const userUuid = req.user.uuid;

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const post = await db.Post.findOne({
            where: {
                uuid: postUuid,
                projectUuid: projectUuid
            }
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Post not found'
            });
        }

        // Delete related records
        await db.PostVersion.destroy({ where: { postUuid: post.uuid } });
        await post.setAccounts([]);
        await post.setTags([]);
        await post.destroy();

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        logger.error('API v1 - Delete post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to delete post'
        });
    }
};

/**
 * Delete multiple posts
 * DELETE /api/v1/{projectUuid}/posts
 */
PostsApiController.deleteMultiple = async (req, res) => {
    try {
        const { projectUuid } = req.params;
        const { posts } = req.body;
        const userUuid = req.user.uuid;

        if (!posts || !Array.isArray(posts) || posts.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Post UUIDs are required'
            });
        }

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        // Find posts that belong to this project
        const postsToDelete = await db.Post.findAll({
            where: {
                uuid: { [Op.in]: posts },
                projectUuid: projectUuid
            }
        });

        // Delete related records for each post
        for (const post of postsToDelete) {
            await db.PostVersion.destroy({ where: { postUuid: post.uuid } });
            await post.setAccounts([]);
            await post.setTags([]);
        }

        const deletedCount = await db.Post.destroy({
            where: {
                uuid: { [Op.in]: posts },
                projectUuid: projectUuid
            }
        });

        res.json({
            success: true,
            message: `${deletedCount} post(s) deleted successfully`,
            data: {
                deleted_count: deletedCount
            }
        });
    } catch (error) {
        logger.error('API v1 - Delete multiple posts error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to delete posts'
        });
    }
};

/**
 * Schedule a post
 * POST /api/v1/{projectUuid}/posts/{postUuid}/schedule
 */
PostsApiController.schedule = async (req, res) => {
    try {
        const { postUuid, projectUuid } = req.params;
        const { scheduled_at } = req.body;
        const userUuid = req.user.uuid;

        if (!scheduled_at) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Scheduled date and time are required'
            });
        }

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
                error: 'Not Found',
                message: 'Project not found'
            });
        }

        const post = await db.Post.findOne({
            where: {
                uuid: postUuid,
                projectUuid: projectUuid
            }
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Post not found'
            });
        }

        await PostSchedulingService.schedulePost(post.uuid, scheduled_at);

        const updatedPost = await db.Post.findOne({
            where: { uuid: post.uuid }
        });

        res.json({
            success: true,
            message: 'Post scheduled successfully',
            data: {
                uuid: updatedPost.uuid,
                status: updatedPost.status,
                scheduled_at: updatedPost.scheduledAt
            }
        });
    } catch (error) {
        logger.error('API v1 - Schedule post error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to schedule post'
        });
    }
};

module.exports = PostsApiController;
