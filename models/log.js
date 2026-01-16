const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define("Log", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        level: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'Log level: error, warn, info, http, verbose, debug, silly'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Log message'
        },
        meta: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Additional metadata as JSON'
        },
        service: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Service name that generated the log'
        }
    }, {
        tableName: "logs",
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
                fields: ['level'],
                name: 'logs_level_idx'
            },
            {
                fields: ['createdAt'],
                name: 'logs_created_at_idx'
            },
            {
                fields: ['service'],
                name: 'logs_service_idx'
            }
        ]
    });

    Log.associate = function(models) {
        // No associations - logs are standalone
    };

    // Static methods for querying logs
    Log.findByLevel = function(level, options = {}) {
        const { Op } = require('sequelize');
        return this.findAll({
            where: {
                level: level
            },
            order: [['createdAt', 'DESC']],
            limit: options.limit || 100,
            ...options
        });
    };

    Log.findRecent = function(limit = 100) {
        return this.findAll({
            order: [['createdAt', 'DESC']],
            limit: limit
        });
    };

    Log.findByService = function(service, options = {}) {
        return this.findAll({
            where: {
                service: service
            },
            order: [['createdAt', 'DESC']],
            limit: options.limit || 100,
            ...options
        });
    };

    Log.findByDateRange = function(startDate, endDate, options = {}) {
        const { Op } = require('sequelize');
        return this.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['createdAt', 'DESC']],
            limit: options.limit || 100,
            ...options
        });
    };

    Log.findErrors = function(options = {}) {
        const { Op } = require('sequelize');
        return this.findAll({
            where: {
                level: {
                    [Op.in]: ['error', 'warn']
                }
            },
            order: [['createdAt', 'DESC']],
            limit: options.limit || 100,
            ...options
        });
    };

    Log.cleanup = async function(daysToKeep = 30) {
        const { Op } = require('sequelize');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        return this.destroy({
            where: {
                createdAt: {
                    [Op.lt]: cutoffDate
                }
            }
        });
    };

    return Log;
};
