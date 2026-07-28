const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

/**
 * Media Service
 * Handles media file uploads, storage, and management
 */
class MediaService {
    /**
     * Upload a media file
     * @param {Object} file - The file object from express-fileupload
     * @param {String} userUuid - The UUID of the user uploading the file
     * @param {String} disk - The disk name (default: 'public')
     */
    static async uploadFile(file, userUuid, disk = 'public', customName = null) {
        try {
            if (!file) {
                throw new Error('No file provided');
            }

            if (!userUuid) {
                throw new Error('User UUID is required');
            }

            // Generate unique filename
            const ext = path.extname(file.name);
            const filename = `${uuidv4()}${ext}`;
            
            // Use user-specific directory: public/uploads/{userUuid}/
            const userUploadDir = path.join(__dirname, '../public/uploads', userUuid);
            const uploadPath = path.join(userUploadDir, filename);

            // Ensure directory exists
            await fs.mkdir(userUploadDir, { recursive: true });

            // Move file to upload directory
            await file.mv(uploadPath);

            // Get file stats
            const stats = await fs.stat(uploadPath);
            const mimeType = file.mimetype || 'application/octet-stream';

            // Create media record with user-specific path and userUuid
            const media = await db.Media.create({
                uuid: uuidv4(),
                name: customName || file.name,
                mimeType: mimeType,
                disk: disk,
                path: `uploads/${userUuid}/${filename}`,
                userUuid: userUuid, // Link media to user
                size: stats.size,
                sizeTotal: stats.size,
                conversions: null
            });

            return media;
        } catch (error) {
            logger.error('Upload file error:', error);
            throw error;
        }
    }

    /**
     * Delete media file
     */
    static async deleteMedia(mediaUuid) {
        try {
            const media = await db.Media.findOne({ where: { uuid: mediaUuid } });
            
            if (!media) {
                throw new Error('Media not found');
            }

            // Delete file from disk
            const filePath = path.join(__dirname, '../public', media.path);
            try {
                await fs.unlink(filePath);
            } catch (error) {
                logger.warn(`Failed to delete file ${filePath}:`, error);
            }

            // Delete conversions if any
            if (media.conversions) {
                const conversions = JSON.parse(media.conversions);
                for (const conversion of conversions) {
                    try {
                        const convPath = path.join(__dirname, '../public', conversion.path);
                        await fs.unlink(convPath);
                    } catch (error) {
                        logger.warn(`Failed to delete conversion file:`, error);
                    }
                }
            }

            // Delete from database
            await media.destroy();

            return true;
        } catch (error) {
            logger.error('Delete media error:', error);
            throw error;
        }
    }

    /**
     * Get media URL
     */
    static getMediaUrl(media) {
        if (!media) return null;
        
        if (media.disk === 'external_media') {
            return media.path;
        }

        // Return the full path from the media record
        return `/${media.path}`;
    }

    /**
     * Fetch uploaded media
     */
    static async fetchUploaded(limit = 50, offset = 0) {
        try {
            const { count, rows: media } = await db.Media.findAndCountAll({
                where: {
                    disk: { [db.Sequelize.Op.ne]: 'external_media' }
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                data: media.map(m => ({
                    id: m.id,
                    uuid: m.uuid,
                    name: m.name,
                    mime_type: m.mimeType,
                    url: this.getMediaUrl(m),
                    size: m.size,
                    created_at: m.createdAt
                })),
                total: count
            };
        } catch (error) {
            logger.error('Fetch uploaded media error:', error);
            throw error;
        }
    }
}

module.exports = MediaService;
