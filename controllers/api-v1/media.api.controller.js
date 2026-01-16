const db = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');
const MediaService = require('../../services/mixpost/media.service');

const MediaApiController = {};

/**
 * List media files
 * GET /api/v1/media
 * Based on: https://docs.mixpost.app/api/media/list/
 */
MediaApiController.list = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {
            disk: { [Op.ne]: 'external_media' },
            userUuid: userUuid
        };

        const { count, rows: media } = await db.Media.findAndCountAll({
            where: where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        const formattedMedia = media.map(m => ({
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
        logger.error('API v1 - List media error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch media files'
        });
    }
};

/**
 * Get a media file
 * GET /api/v1/media/{mediaUuid}
 * Based on: https://docs.mixpost.app/api/media/get/
 */
MediaApiController.get = async (req, res) => {
    try {
        const { mediaUuid } = req.params;
        const userUuid = req.user.uuid;

        const media = await db.Media.findOne({
            where: {
                uuid: mediaUuid,
                userUuid: userUuid
            }
        });

        if (!media) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Media file not found'
            });
        }

        const formattedMedia = {
            uuid: media.uuid,
            name: media.name,
            mime_type: media.mimeType,
            url: MediaService.getMediaUrl(media),
            thumb_url: media.conversions ? JSON.parse(media.conversions).find(c => c.name === 'thumb')?.path : null,
            size: media.size,
            created_at: media.createdAt
        };

        res.json({
            success: true,
            data: formattedMedia
        });
    } catch (error) {
        logger.error('API v1 - Get media error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch media file'
        });
    }
};

/**
 * Upload a media file
 * POST /api/v1/media
 * Based on: https://docs.mixpost.app/api/media/upload/
 */
MediaApiController.upload = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'No file provided'
            });
        }

        // Handle single file or multiple files
        let files = [];
        if (req.files.file) {
            files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
        } else if (req.files['files[]']) {
            files = Array.isArray(req.files['files[]']) ? req.files['files[]'] : [req.files['files[]']];
        }

        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'No file provided'
            });
        }

        const userUuid = req.user.uuid;
        const uploadedMedia = [];

        for (const file of files) {
            try {
                const media = await MediaService.uploadFile(file, userUuid);
                uploadedMedia.push({
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
                error: 'Internal Server Error',
                message: 'Failed to upload any files'
            });
        }

        res.json({
            success: true,
            data: uploadedMedia.length === 1 ? uploadedMedia[0] : uploadedMedia,
            count: uploadedMedia.length
        });
    } catch (error) {
        logger.error('API v1 - Upload media error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to upload media'
        });
    }
};

/**
 * Update a media file
 * PUT /api/v1/media/{mediaUuid}
 * Based on: https://docs.mixpost.app/api/media/update/
 */
MediaApiController.update = async (req, res) => {
    try {
        const { mediaUuid } = req.params;
        const { name } = req.body;
        const userUuid = req.user.uuid;

        const media = await db.Media.findOne({
            where: {
                uuid: mediaUuid,
                userUuid: userUuid
            }
        });

        if (!media) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Media file not found'
            });
        }

        if (name) {
            await media.update({ name });
        }

        const formattedMedia = {
            uuid: media.uuid,
            name: media.name,
            mime_type: media.mimeType,
            url: MediaService.getMediaUrl(media),
            thumb_url: media.conversions ? JSON.parse(media.conversions).find(c => c.name === 'thumb')?.path : null,
            size: media.size,
            created_at: media.createdAt,
            updated_at: media.updatedAt
        };

        res.json({
            success: true,
            data: formattedMedia
        });
    } catch (error) {
        logger.error('API v1 - Update media error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to update media file'
        });
    }
};

/**
 * Delete a media file
 * DELETE /api/v1/media/{mediaUuid}
 * Based on: https://docs.mixpost.app/api/media/delete/
 */
MediaApiController.delete = async (req, res) => {
    try {
        const { mediaUuid } = req.params;
        const userUuid = req.user.uuid;

        const media = await db.Media.findOne({
            where: {
                uuid: mediaUuid,
                userUuid: userUuid
            }
        });

        if (!media) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Media file not found'
            });
        }

        await MediaService.deleteMedia(mediaUuid);

        res.json({
            success: true,
            message: 'Media file deleted successfully'
        });
    } catch (error) {
        logger.error('API v1 - Delete media error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to delete media file'
        });
    }
};

module.exports = MediaApiController;

