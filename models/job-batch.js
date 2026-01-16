const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const JobBatch = sequelize.define("JobBatch", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the job batch'
        },
        totalJobs: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Total number of jobs in the batch'
        },
        pendingJobs: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Number of pending jobs'
        },
        failedJobs: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Number of failed jobs'
        },
        failedJobIds: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Array of failed job IDs'
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp when batch was cancelled'
        },
        finishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp when batch finished processing'
        },
        options: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Additional batch options and metadata'
        }
    }, {
        tableName: "job_batches"
    });

    JobBatch.associate = function(models) {
        // Job batches can be associated with posts if needed
        // Example: JobBatch.hasMany(models.Post, { foreignKey: 'batchUuid', as: 'posts' });
    };

    // Instance methods
    JobBatch.prototype.isFinished = function() {
        return this.finishedAt !== null;
    };

    JobBatch.prototype.isCancelled = function() {
        return this.cancelledAt !== null;
    };

    JobBatch.prototype.isProcessing = function() {
        return !this.isFinished() && !this.isCancelled() && this.pendingJobs > 0;
    };

    JobBatch.prototype.hasFailures = function() {
        return this.failedJobs > 0;
    };

    JobBatch.prototype.getProgress = function() {
        if (this.totalJobs === 0) return 0;
        const completed = this.totalJobs - this.pendingJobs;
        return Math.round((completed / this.totalJobs) * 100);
    };

    // Static methods
    JobBatch.findByUuid = function(uuid) {
        return this.findOne({ where: { uuid } });
    };

    JobBatch.findActive = function() {
        return this.findAll({
            where: {
                finishedAt: null,
                cancelledAt: null
            }
        });
    };

    JobBatch.findCompleted = function() {
        const { Op } = require('sequelize');
        return this.findAll({
            where: {
                finishedAt: { [Op.ne]: null }
            },
            order: [['finishedAt', 'DESC']]
        });
    };

    JobBatch.findFailed = function() {
        const { Op } = require('sequelize');
        return this.findAll({
            where: {
                failedJobs: { [Op.gt]: 0 }
            },
            order: [['createdAt', 'DESC']]
        });
    };

    return JobBatch;
};
