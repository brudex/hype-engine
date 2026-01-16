const db = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const CalendarController = {};

/**
 * Get calendar view with project filtering
 * Matches Laravel implementation but with project-based filtering
 * @route GET /dashboard/calendar/:projectUuid?/:date?/:type?
 * @route GET /dashboard/calendar/:date?/:type? (with projectUuid in query)
 */
CalendarController.index = async (req, res) => {
    try {
        // Handle route parameters
        // Routes: 
        // - /calendar/project/:projectUuid/:date?/:type?
        // - /calendar/:date?/:type?
        // - /calendar (with query params)
        const projectUuid = req.params.projectUuid || req.query.projectUuid;
        const date = req.params.date || req.query.date;
        const type = req.params.type || req.query.type || 'month';
        const userUuid = req.user?.uuid;

        // Get filter parameters (matching Laravel implementation)
        const keyword = req.query.keyword || '';
        const status = req.query.status;
        const tags = req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [];
        const accounts = req.query.accounts ? (Array.isArray(req.query.accounts) ? req.query.accounts : [req.query.accounts]) : [];

        // Validate projectUuid if provided
        if (projectUuid) {
            const project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found or unauthorized'
                });
            }
        }

        // Parse date or use current date
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const currentDate = new Date(selectedDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        // Build where clause for posts
        const postWhere = {};

        // Add project filter if provided
        if (projectUuid) {
            postWhere.projectUuid = projectUuid;
        }

        // Filter by status if provided, otherwise exclude draft posts (status 0)
        // Matching Laravel exclude_status = 'draft' when status is not specified
        if (status !== undefined && status !== null && status !== '') {
            postWhere.status = parseInt(status);
        } else {
            // Exclude draft posts (status 0) - matching Laravel exclude_status = 'draft'
            postWhere.status = { [Op.ne]: 0 }; // Not draft
        }

        // Filter by scheduled_at date based on calendar type
        // Matching Laravel PostScheduledAt filter logic
        if (date && /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
            const dateObj = new Date(date + 'T00:00:00'); // Ensure timezone handling
            
            if (type === 'month') {
                // Month view: extend range by 10 days before and after
                // Matching Laravel: whereDate('scheduled_at', '>=', $date->clone()->startOfMonth()->subDays(10)->toDateString())
                const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
                const endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
                
                startOfMonth.setDate(startOfMonth.getDate() - 10);
                endOfMonth.setDate(endOfMonth.getDate() + 10);
                
                // Use date-only comparison (matching Laravel whereDate)
                postWhere.scheduledAt = {
                    [Op.gte]: startOfMonth.toISOString().split('T')[0],
                    [Op.lte]: endOfMonth.toISOString().split('T')[0]
                };
            } else if (type === 'week') {
                // Week view: get start and end of week
                // Matching Laravel: whereDate('scheduled_at', '>=', $date->startOfWeek()->toDateString())
                const dayOfWeek = dateObj.getDay();
                const diff = dateObj.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                const startOfWeek = new Date(dateObj);
                startOfWeek.setDate(diff);
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                
                // Use date-only comparison
                postWhere.scheduledAt = {
                    [Op.gte]: startOfWeek.toISOString().split('T')[0],
                    [Op.lte]: endOfWeek.toISOString().split('T')[0]
                };
            } else if (type === 'day') {
                // Day view: single day
                // Matching Laravel: whereDate('scheduled_at', $date->toDateString())
                const dayDate = dateObj.toISOString().split('T')[0];
                postWhere.scheduledAt = {
                    [Op.gte]: dayDate + ' 00:00:00',
                    [Op.lte]: dayDate + ' 23:59:59'
                };
            }
        }

        // Build include options
        const include = [
            {
                model: db.Account,
                as: 'accounts',
                through: { attributes: [] },
                required: accounts.length > 0,
                where: accounts.length > 0 ? { id: { [Op.in]: accounts.map(a => parseInt(a)) } } : undefined
            },
            {
                model: db.Tag,
                as: 'tags',
                through: { attributes: [] },
                required: tags.length > 0,
                where: tags.length > 0 ? { uuid: { [Op.in]: tags } } : undefined
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
                model: db.Project,
                as: 'project',
                attributes: ['uuid', 'name']
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

        // Fetch posts matching the filters
        const posts = await db.Post.findAll({
            where: postWhere,
            include: include,
            order: [['scheduledAt', 'ASC']],
            distinct: true
        });

        // Get all accounts and tags for filters
        const allAccounts = await db.Account.findAll({
            where: projectUuid ? { projectUuid: projectUuid } : undefined,
            order: [['createdAt', 'ASC']]
        });

        const allTags = await db.Tag.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Format posts for calendar (matching Laravel PostResource format)
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
            project: post.project || null
        }));

        // Get projects list for filter dropdown
        const projects = projectUuid ? [] : await db.Project.findAll({
            where: { userUuid: userUuid },
            attributes: ['uuid', 'name', 'description', 'imageUrl'],
            order: [['name', 'ASC']]
        });

        res.render('dashboard/calendar/index', {
            posts: formattedPosts,
            accounts: allAccounts.map(acc => ({
                id: acc.id,
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider,
                media: acc.media
            })),
            tags: allTags.map(tag => ({
                uuid: tag.uuid,
                name: tag.name
            })),
            projects: projects,
            currentProject: projectUuid ? await db.Project.findOne({
                where: { uuid: projectUuid },
                attributes: ['uuid', 'name', 'description', 'imageUrl']
            }) : null,
            selectedDate: selectedDate,
            type: type,
            filter: {
                keyword: keyword,
                status: status,
                tags: tags,
                accounts: accounts.map(a => parseInt(a))
            },
            projectUuid: projectUuid,
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Calendar index error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load calendar',
            error: error.message
        });
    }
};

/**
 * Get calendar data via API (for AJAX requests)
 * @route POST /dashboard/api/calendar
 */
CalendarController.getCalendarData = async (req, res) => {
    const startTime = Date.now();
    logger.info('Calendar API Request Started', {
        body: req.body,
        userUuid: req.user?.uuid
    });

    try {
        // ============================================
        // STEP 1: Extract and validate request parameters
        // ============================================
        const {
            projectUuid,
            date = new Date().toISOString().split('T')[0],
            type = 'month',
            keyword = '',
            status,
            tags = [],
            accounts = []
        } = req.body;

        const userUuid = req.user?.uuid;

        logger.debug('Request Parameters Extracted', {
            projectUuid,
            date,
            type,
            keyword: keyword ? '***' : '',
            status,
            tagsCount: Array.isArray(tags) ? tags.length : 0,
            accountsCount: Array.isArray(accounts) ? accounts.length : 0
        });

        // Normalize arrays
        const normalizedTags = Array.isArray(tags) ? tags : (tags ? [tags] : []);
        const normalizedAccounts = Array.isArray(accounts) ? accounts : (accounts ? [accounts] : []);

        // ============================================
        // STEP 2: Validate project if provided
        // ============================================
        if (projectUuid) {
            logger.debug('Validating project', { projectUuid });
            const project = await db.Project.findOne({
                where: {
                    uuid: projectUuid,
                    userUuid: userUuid
                }
            });

            if (!project) {
                logger.warn('Project not found or unauthorized', { projectUuid, userUuid });
                return res.status(404).json({
                    success: false,
                    message: 'Project not found or unauthorized'
                });
            }
            logger.debug('Project validated successfully', { projectUuid, projectName: project.name });
        }

        // ============================================
        // STEP 3: Build date range filter based on calendar type
        // ============================================
        const dateObj = new Date(date + 'T00:00:00');
        let dateRange = null;

        if (date && /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
            if (type === 'month') {
                const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
                const endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
                startOfMonth.setDate(startOfMonth.getDate() - 10);
                endOfMonth.setDate(endOfMonth.getDate() + 10);
                
                dateRange = {
                    start: startOfMonth.toISOString().split('T')[0],
                    end: endOfMonth.toISOString().split('T')[0]
                };
                logger.debug('Month view date range calculated', dateRange);
            } else if (type === 'week') {
                const dayOfWeek = dateObj.getDay();
                const diff = dateObj.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                const startOfWeek = new Date(dateObj);
                startOfWeek.setDate(diff);
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                
                dateRange = {
                    start: startOfWeek.toISOString().split('T')[0],
                    end: endOfWeek.toISOString().split('T')[0]
                };
                logger.debug('Week view date range calculated', dateRange);
            } else if (type === 'day') {
                const dayDate = dateObj.toISOString().split('T')[0];
                dateRange = {
                    start: dayDate + ' 00:00:00',
                    end: dayDate + ' 23:59:59'
                };
                logger.debug('Day view date range calculated', dateRange);
            }
        }

        // ============================================
        // STEP 4: Build post where clause
        // ============================================
        const postWhere = {};

        if (projectUuid) {
            postWhere.projectUuid = projectUuid;
        }

        if (status !== undefined && status !== null && status !== '') {
            postWhere.status = parseInt(status);
            logger.debug('Status filter applied', { status: postWhere.status });
        } else {
            postWhere.status = { [Op.gte]: 0 }; // Exclude drafts
            logger.debug('Default status filter: excluding drafts');
        }

        if (dateRange) {
            postWhere.scheduledAt = {
                [Op.gte]: dateRange.start,
                [Op.lte]: dateRange.end
            };
        }

        logger.debug('Post where clause built', {
            projectUuid: postWhere.projectUuid,
            status: postWhere.status,
            hasDateRange: !!dateRange
        });

        // ============================================
        // STEP 5: Build include options for associations
        // ============================================
        const include = [
            {
                model: db.Account,
                as: 'accounts',
                through: { attributes: [] },
                required: normalizedAccounts.length > 0,
                attributes: ['uuid', 'name', 'username', 'provider'],
                where: normalizedAccounts.length > 0 
                    ? { id: { [Op.in]: normalizedAccounts.map(a => parseInt(a)) } } 
                    : undefined
            },
            {
                model: db.Tag,
                as: 'tags',
                through: { attributes: [] },
                required: normalizedTags.length > 0,
                where: normalizedTags.length > 0 
                    ? { uuid: { [Op.in]: normalizedTags } } 
                    : undefined
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

        // Apply keyword search to post versions if provided
        if (keyword) {
            include[2].where = {
                content: {
                    [Op.like]: `%${keyword}%`
                }
            };
            logger.debug('Keyword filter applied to post versions', { keyword: '***' });
        }

        logger.debug('Include options built', {
            accountsFilter: normalizedAccounts.length > 0,
            tagsFilter: normalizedTags.length > 0,
            keywordFilter: !!keyword
        });

        // ============================================
        // STEP 6: Fetch posts from database
        // ============================================
        logger.debug('Fetching posts from database');
        const posts = await db.Post.findAll({
            attributes: ['uuid', 'status', 'scheduleStatus', 'scheduledAt', 'publishedAt'],
            where: postWhere,
            include: include,
            order: [['scheduledAt', 'ASC']],
            distinct: true
        });

        logger.info('Posts fetched successfully', { 
            count: posts.length,
            projectUuid,
            type 
        });

        // ============================================
        // STEP 7: Format posts for response (exclude project, exclude scheduled_at duplicate)
        // ============================================
        const formattedPosts = posts.map(post => ({
            id: post.id,
            uuid: post.uuid,
            status: post.status,
            scheduleStatus: post.scheduleStatus,
            scheduledAt: post.scheduledAt, // Client will split this into date and time
            publishedAt: post.publishedAt,
            accounts: (post.accounts || []).map(acc => ({
                id: acc.id,
                uuid: acc.uuid,
                name: acc.name,
                username: acc.username,
                provider: acc.provider,
                media: acc.media
            })),
            tags: (post.tags || []).map(tag => ({
                uuid: tag.uuid,
                name: tag.name
            })),
            versions: post.versions || []
        }));

        // ============================================
        // STEP 8: Build response
        // ============================================
        const response = {
            success: true,
            data: {
                posts: formattedPosts,
                selectedDate: date,
                type: type,
                filter: {
                    keyword: keyword,
                    status: status,
                    tags: normalizedTags,
                    accounts: normalizedAccounts.map(a => parseInt(a))
                }
            }
        };

        const duration = Date.now() - startTime;
        logger.info('Calendar API Request Completed Successfully', {
            duration: `${duration}ms`,
            postsCount: formattedPosts.length,
            projectUuid,
            type
        });

        res.json(response);

    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('Calendar API Error', {
            error: error.message,
            stack: error.stack,
            duration: `${duration}ms`,
            body: req.body
        });

        res.status(500).json({
            success: false,
            message: 'Failed to load calendar data',
            error: error.message
        });
    }
};

module.exports = CalendarController;

