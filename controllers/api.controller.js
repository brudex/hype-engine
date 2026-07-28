const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const MediaService = require('../services/media.service');
const PostSchedulingService = require('../services/post-scheduling.service');
const axios = require('axios');

const HypeEngineApiController = {};

/**
 * Fetch uploaded media
 * GET /api/media/uploaded
 */
HypeEngineApiController.fetchUploads = async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: media } = await db.Media.findAndCountAll({
            where: {
                disk: { [Op.ne]: 'external_media' }
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        const formattedMedia = media.map(m => ({
            id: m.id,
            uuid: m.uuid,
            name: m.name,
            mime_type: m.mimeType,
            url: MediaService.getMediaUrl(m),
            thumb_url: m.conversions ? JSON.parse(m.conversions).find(c => c.name === 'thumb')?.path : null,
            size: m.size,
            created_at: m.createdAt
        }));

        res.json({
            success: true,
            data: formattedMedia,
            meta: {
                total: count,
                page: parseInt(page),
                per_page: parseInt(limit),
                last_page: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        logger.error('Fetch uploads error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch uploaded media',
            error: error.message
        });
    }
};

/**
 * Fetch stock images (Unsplash)
 * GET /api/media/stock
 */
HypeEngineApiController.fetchStock = async (req, res) => {
    try {
        const { keyword = '', page = 1 } = req.query;

        // TODO: Implement Unsplash integration
        // For now, return empty array
        // This requires Unsplash API key configuration
        
        res.json({
            success: true,
            data: [],
            links: {
                next: `?page=${parseInt(page) + 1}`
            }
        });
    } catch (error) {
        logger.error('Fetch stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stock images',
            error: error.message
        });
    }
};

/**
 * Fetch GIFs (Tenor)
 * GET /api/media/gifs
 */
HypeEngineApiController.fetchGifs = async (req, res) => {
    try {
        const { keyword = '', page = 1 } = req.query;

        // TODO: Implement Tenor integration
        // This requires Tenor API key configuration
        
        res.json({
            success: true,
            data: [],
            links: {
                next: `?page=${parseInt(page) + 1}`
            }
        });
    } catch (error) {
        logger.error('Fetch GIFs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch GIFs',
            error: error.message
        });
    }
};

/**
 * Upload media file
 * POST /api/media/upload
 */
HypeEngineApiController.uploadMedia = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        // Handle single file or multiple files
        // Support both 'file' and 'files[]' naming
        let files = [];
        if (req.files.file) {
            files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
        } else if (req.files['files[]']) {
            files = Array.isArray(req.files['files[]']) ? req.files['files[]'] : [req.files['files[]']];
        }
        
        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        const uploadedMedia = [];
        
        for (const file of files) {
            try {
                const media = await MediaService.uploadFile(file);
                uploadedMedia.push({
                    id: media.id,
                    uuid: media.uuid,
                    name: media.name,
                    mime_type: media.mimeType,
                    url: MediaService.getMediaUrl(media),
                    size: media.size,
                    created_at: media.createdAt
                });
            } catch (fileError) {
                logger.error('Error uploading file:', fileError);
                // Continue with other files
            }
        }

        if (uploadedMedia.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload any files'
            });
        }

        res.json({
            success: true,
            data: uploadedMedia.length === 1 ? uploadedMedia[0] : uploadedMedia,
            count: uploadedMedia.length
        });
    } catch (error) {
        logger.error('Upload media error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload media',
            error: error.message
        });
    }
};

/**
 * Download external media
 * POST /api/media/download
 */
HypeEngineApiController.downloadExternal = async (req, res) => {
    try {
        const { url, name } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }

        // TODO: Implement external media download
        // Download from URL and save to media library
        
        res.json({
            success: false,
            message: 'External media download not yet implemented'
        });
    } catch (error) {
        logger.error('Download external media error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download external media',
            error: error.message
        });
    }
};

/**
 * Schedule a post
 * POST /api/posts/:uuid/schedule
 */
HypeEngineApiController.schedulePost = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { scheduled_at } = req.body;

        if (!scheduled_at) {
            return res.status(400).json({
                success: false,
                message: 'Scheduled date and time are required'
            });
        }

        const post = await PostSchedulingService.schedulePost(uuid, scheduled_at);

        // Format scheduled date for response
        const scheduledDate = new Date(scheduled_at);
        const formattedDate = scheduledDate.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });

        res.json({
            success: true,
            message: `The post has been scheduled.\n${formattedDate}`,
            data: {
                uuid: post.uuid,
                scheduled_at: post.scheduledAt
            }
        });
    } catch (error) {
        logger.error('Schedule post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule post',
            error: error.message
        });
    }
};

/**
 * Duplicate a post
 * POST /api/posts/:uuid/duplicate
 */
HypeEngineApiController.duplicatePost = async (req, res) => {
    try {
        const { uuid } = req.params;

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
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Create new post (use same project as original)
        const newPost = await db.Post.create({
            uuid: uuidv4(),
            status: 0, // DRAFT
            userUuid: req.user.uuid, // Link post to user
            projectUuid: originalPost.projectUuid // Link to same project as original
        });

        // Copy accounts
        if (originalPost.accounts && originalPost.accounts.length > 0) {
            await newPost.setAccounts(originalPost.accounts.map(a => a.id));
        }

        // Copy tags
        if (originalPost.tags && originalPost.tags.length > 0) {
            await newPost.setTags(originalPost.tags.map(t => t.id));
        }

        // Copy versions
        if (originalPost.versions && originalPost.versions.length > 0) {
            for (const version of originalPost.versions) {
                await db.PostVersion.create({
                    postId: newPost.id,
                    accountId: version.accountId,
                    isOriginal: version.isOriginal,
                    content: version.content
                });
            }
        }

        res.json({
            success: true,
            message: 'Post duplicated successfully',
            data: {
                uuid: newPost.uuid
            }
        });
    } catch (error) {
        logger.error('Duplicate post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to duplicate post',
            error: error.message
        });
    }
};

/**
 * Delete multiple posts
 * DELETE /api/posts
 */
HypeEngineApiController.deleteMultiple = async (req, res) => {
    try {
        const { posts } = req.body;

        if (!posts || !Array.isArray(posts) || posts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Post UUIDs are required'
            });
        }

        const deletedCount = await db.Post.destroy({
            where: {
                uuid: { [Op.in]: posts }
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
        logger.error('Delete multiple posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete posts',
            error: error.message
        });
    }
};

/**
 * Get accounts list (API)
 * GET /api/accounts
 */
HypeEngineApiController.getAccounts = async (req, res) => {
    try {
        const { projectUuid } = req.query;
        const userUuid = req.user?.uuid;

        // Build where clause
        const where = {};
        if (projectUuid) {
            where.projectUuid = projectUuid;
        }

        const accounts = await db.Account.findAll({
            where: where,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.Project,
                    as: 'project',
                    attributes: ['uuid', 'name']
                }
            ]
        });

        // Format accounts for frontend
        const formattedAccounts = accounts.map(account => ({
            id: account.id,
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            providerId: account.providerId,
            authorized: account.authorized,
            projectUuid: account.projectUuid,
            project: account.project ? {
                uuid: account.project.uuid,
                name: account.project.name
            } : null,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt,
            updated_at: account.updatedAt
        }));

        res.json({
            success: true,
            data: formattedAccounts
        });
    } catch (error) {
        logger.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts',
            error: error.message
        });
    }
};

HypeEngineApiController.getAccountsOld = async (req, res) => {
    try {
        const accounts = await db.Account.findAll({
            order: [['createdAt', 'ASC']]
        });

        const formattedAccounts = accounts.map(account => ({
            id: account.id,
            uuid: account.uuid,
            name: account.name,
            username: account.username,
            provider: account.provider,
            providerId: account.providerId,
            authorized: account.authorized,
            image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
            created_at: account.createdAt
        }));

        res.json({
            success: true,
            data: formattedAccounts
        });
    } catch (error) {
        logger.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts',
            error: error.message
        });
    }
};

/**
 * Get single account (API)
 * GET /api/accounts/:uuid
 */
HypeEngineApiController.getAccount = async (req, res) => {
    try {
        const { uuid } = req.params;
        const account = await db.Account.findOne({ where: { uuid } });
        
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: account.id,
                uuid: account.uuid,
                name: account.name,
                username: account.username,
                provider: account.provider,
                providerId: account.providerId,
                authorized: account.authorized,
                image: account.media ? (typeof account.media === 'string' ? JSON.parse(account.media).url : account.media.url) || null : null,
                created_at: account.createdAt,
                updated_at: account.updatedAt
            }
        });
    } catch (error) {
        logger.error('Get account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account',
            error: error.message
        });
    }
};

/**
 * Get posts list (API)
 * GET /api/posts
 */
HypeEngineApiController.getPosts = async (req, res) => {
    try {
        const { keyword, status, tags, accounts, projectUuid, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const userUuid = req.user?.uuid;

        const where = {};
        if (status) {
            where.status = parseInt(status);
        }
        if (projectUuid) {
            // Verify project belongs to user
            const project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });
            if (project) {
                where.projectUuid = projectUuid;
            }
        }

        const include = [
            {
                model: db.Account,
                as: 'accounts',
                through: { attributes: [] },
                required: accounts ? true : false,
                where: accounts ? { id: { [Op.in]: Array.isArray(accounts) ? accounts : [accounts] } } : undefined
            },
            {
                model: db.Tag,
                as: 'tags',
                through: { attributes: [] },
                required: tags ? true : false,
                where: tags ? { uuid: { [Op.in]: Array.isArray(tags) ? tags : [tags] } } : undefined
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
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC'], ['id', 'DESC']],
            distinct: true
        });

        const formattedPosts = posts.map(post => ({
            id: post.id,
            uuid: post.uuid,
            status: post.status,
            scheduleStatus: post.scheduleStatus,
            scheduledAt: post.scheduledAt,
            publishedAt: post.publishedAt,
            accounts: post.accounts || [],
            tags: post.tags || [],
            versions: post.versions || [],
            created_at: post.createdAt,
            updated_at: post.updatedAt
        }));

        // Check for failed posts
        const hasFailedPosts = await db.Post.count({
            where: { status: 3 } // FAILED
        }) > 0;

        res.json({
            success: true,
            data: formattedPosts,
            meta: {
                total: count,
                page: parseInt(page),
                per_page: parseInt(limit),
                last_page: Math.ceil(count / limit)
            },
            hasFailedPosts: hasFailedPosts
        });
    } catch (error) {
        logger.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message
        });
    }
};

/**
 * Get single post (API)
 * GET /api/posts/:uuid
 */
HypeEngineApiController.getPost = async (req, res) => {
    try {
        const { uuid } = req.params;
        const post = await db.Post.findOne({
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
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: post.id,
                uuid: post.uuid,
                status: post.status,
                scheduleStatus: post.scheduleStatus,
                scheduledAt: post.scheduledAt,
                publishedAt: post.publishedAt,
                accounts: post.accounts || [],
                tags: post.tags || [],
                versions: post.versions || [],
                created_at: post.createdAt,
                updated_at: post.updatedAt
            }
        });
    } catch (error) {
        logger.error('Get post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
};

/**
 * Get tags list (API)
 * GET /api/tags
 */
HypeEngineApiController.getTags = async (req, res) => {
    try {
        const tags = await db.Tag.findAll({
            order: [['createdAt', 'DESC']]
        });

        const formattedTags = tags.map(tag => ({
            id: tag.id,
            uuid: tag.uuid,
            name: tag.name,
            hex_color: tag.hexColor,
            created_at: tag.createdAt
        }));

        res.json({
            success: true,
            data: formattedTags
        });
    } catch (error) {
        logger.error('Get tags error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
};

module.exports = HypeEngineApiController;
