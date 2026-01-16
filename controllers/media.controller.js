const db = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');
const MediaService = require('../services/mixpost/media.service');

const MediaController = {};

/**
 * Get media library page
 * @route GET /dashboard/media
 */
MediaController.index = async (req, res) => {
    try {
        // Check if media services are configured
        const services = await db.Service.findAll({
            where: {
                name: { [Op.in]: ['unsplash', 'tenor'] }
            }
        });

        const isConfiguredService = {};
        services.forEach(service => {
            isConfiguredService[service.name] = service.active;
        });

        res.render('dashboard/media/index', {
            currentPage: 'media',
            is_configured_service: isConfiguredService,
            layout: 'layouts/dashboard/index'
        });
    } catch (error) {
        logger.error('Media index error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load media library',
            error: error.message
        });
    }
};

/**
 * Fetch uploaded media
 * @route GET /api/media/uploaded
 */
MediaController.fetchUploads = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { page = 1, limit = 30 } = req.query;
        const offset = (page - 1) * limit;
        const userUuid = req.user.uuid;

        // Fetch media for the current user
        const { count, rows: media } = await db.Media.findAndCountAll({
            where: {
                disk: { [Op.ne]: 'external_media' },
                userUuid: userUuid // Filter by userUuid (more efficient than path pattern)
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
 * Upload media file(s)
 * @route POST /api/media/upload
 */
MediaController.uploadMedia = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        const userUuid = req.user.uuid;

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
                // Upload file with user-specific path
                const media = await MediaService.uploadFile(file, userUuid);
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
 * Delete media
 * @route DELETE /api/media
 */
MediaController.delete = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { ids } = req.body;
        const userUuid = req.user.uuid;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Media IDs are required'
            });
        }

        // Find media items belonging to the user
        const mediaItems = await db.Media.findAll({
            where: {
                uuid: { [Op.in]: ids },
                userUuid: userUuid // Filter by userUuid (more efficient than path pattern)
            }
        });

        if (mediaItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No media found or you do not have permission to delete these items'
            });
        }

        // Delete files from storage
        for (const media of mediaItems) {
            try {
                await MediaService.deleteMedia(media.uuid);
            } catch (deleteError) {
                logger.error(`Error deleting media ${media.uuid}:`, deleteError);
                // Continue with other deletions
            }
        }

        res.status(204).send();
    } catch (error) {
        logger.error('Media delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete media',
            error: error.message
        });
    }
};

/**
 * Fetch stock images (Unsplash)
 * @route GET /api/media/stock
 */
MediaController.fetchStock = async (req, res) => {
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
 * @route GET /api/media/gifs
 */
MediaController.fetchGifs = async (req, res) => {
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
 * Download external media
 * @route POST /api/media/download
 */
MediaController.downloadExternal = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.uuid) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { url, name } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }

        // TODO: Implement external media download
        // Download from URL and save to media library
        
        res.status(501).json({
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

module.exports = MediaController;

