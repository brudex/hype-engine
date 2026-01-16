const db = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

/**
 * Post Scheduling Service
 * Handles post scheduling and publishing
 */
class PostSchedulingService {
    /**
     * Schedule a post
     */
    static async schedulePost(postUuid, scheduledAt) {
        try {
            const post = await db.Post.findOne({ where: { uuid: postUuid } });
            
            if (!post) {
                throw new Error('Post not found');
            }

            post.scheduledAt = new Date(scheduledAt);
            post.status = 1; // SCHEDULED
            post.scheduleStatus = 0; // PENDING
            await post.save();

            // TODO: Add to job queue for processing at scheduled time
            
            return post;
        } catch (error) {
            logger.error('Schedule post error:', error);
            throw error;
        }
    }

    /**
     * Publish a post immediately
     */
    static async publishPost(postUuid) {
        try {
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
                    }
                ]
            });
            
            if (!post) {
                throw new Error('Post not found');
            }

            // TODO: Implement actual publishing logic
            // For each account, get the appropriate version
            // Call provider API to publish
            // Update post status and provider_post_id
            
            post.status = 2; // PUBLISHED
            post.publishedAt = new Date();
            post.scheduleStatus = 2; // PROCESSED
            await post.save();

            return post;
        } catch (error) {
            logger.error('Publish post error:', error);
            throw error;
        }
    }

    /**
     * Process scheduled posts
     * This should be called by a cron job
     */
    static async processScheduledPosts() {
        try {
            const now = new Date();
            
            // Find posts that are scheduled and ready to publish
            const posts = await db.Post.findAll({
                where: {
                    status: 1, // SCHEDULED
                    scheduleStatus: 0, // PENDING
                    scheduledAt: {
                        [Op.lte]: now
                    }
                },
                include: [
                    {
                        model: db.Account,
                        as: 'accounts',
                        through: { attributes: [] }
                    },
                    {
                        model: db.PostVersion,
                        as: 'versions'
                    }
                ]
            });

            for (const post of posts) {
                try {
                    // Mark as processing
                    post.scheduleStatus = 1; // PROCESSING
                    await post.save();

                    // Publish the post
                    await this.publishPost(post.uuid);
                } catch (error) {
                    logger.error(`Failed to publish post ${post.uuid}:`, error);
                    // Mark as failed
                    post.status = 3; // FAILED
                    post.scheduleStatus = 2; // PROCESSED
                    await post.save();
                }
            }

            return posts.length;
        } catch (error) {
            logger.error('Process scheduled posts error:', error);
            throw error;
        }
    }
}

module.exports = PostSchedulingService;

