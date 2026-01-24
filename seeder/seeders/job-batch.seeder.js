const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const jobBatches = [
            {
                uuid: uuidv4(),
                name: 'Schedule Due Posts',
                totalJobs: 15,
                pendingJobs: 0,
                failedJobs: 0,
                failedJobIds: null,
                cancelledAt: null,
                finishedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                options: JSON.stringify({
                    description: 'Scheduled posts that are due to be published'
                }),
                createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
                updatedAt: new Date(Date.now() - 5 * 60 * 1000)
            },
            {
                uuid: uuidv4(),
                name: 'Publish Scheduled Posts',
                totalJobs: 8,
                pendingJobs: 0,
                failedJobs: 1,
                failedJobIds: JSON.stringify(['post-123', 'post-456']),
                cancelledAt: null,
                finishedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
                options: JSON.stringify({
                    description: 'Publishing scheduled posts to social media platforms'
                }),
                createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
                updatedAt: new Date(Date.now() - 2 * 60 * 1000)
            },
            {
                uuid: uuidv4(),
                name: 'Schedule Due Posts',
                totalJobs: 25,
                pendingJobs: 5,
                failedJobs: 0,
                failedJobIds: null,
                cancelledAt: null,
                finishedAt: null, // Still processing
                options: JSON.stringify({
                    description: 'Scheduled posts that are due to be published'
                }),
                createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'Publish Scheduled Posts',
                totalJobs: 12,
                pendingJobs: 0,
                failedJobs: 0,
                failedJobIds: null,
                cancelledAt: null,
                finishedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                options: JSON.stringify({
                    description: 'Publishing scheduled posts to social media platforms'
                }),
                createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
                updatedAt: new Date(Date.now() - 30 * 60 * 1000)
            },
            {
                uuid: uuidv4(),
                name: 'Cleanup Logs',
                totalJobs: 1,
                pendingJobs: 0,
                failedJobs: 0,
                failedJobIds: null,
                cancelledAt: null,
                finishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                options: JSON.stringify({
                    description: 'Cleaning up old log entries',
                    daysToKeep: 30
                }),
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 - 5 * 60 * 1000),
                updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                uuid: uuidv4(),
                name: 'Schedule Due Posts',
                totalJobs: 20,
                pendingJobs: 0,
                failedJobs: 3,
                failedJobIds: JSON.stringify(['post-789', 'post-101', 'post-202']),
                cancelledAt: null,
                finishedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
                options: JSON.stringify({
                    description: 'Scheduled posts that are due to be published'
                }),
                createdAt: new Date(Date.now() - 65 * 60 * 1000),
                updatedAt: new Date(Date.now() - 60 * 60 * 1000)
            },
            {
                uuid: uuidv4(),
                name: 'Publish Scheduled Posts',
                totalJobs: 6,
                pendingJobs: 2,
                failedJobs: 0,
                failedJobIds: null,
                cancelledAt: null,
                finishedAt: null, // Still processing
                options: JSON.stringify({
                    description: 'Publishing scheduled posts to social media platforms'
                }),
                createdAt: new Date(Date.now() - 30 * 1000), // 30 seconds ago
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'Schedule Due Posts',
                totalJobs: 10,
                pendingJobs: 0,
                failedJobs: 0,
                failedJobIds: null,
                cancelledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Cancelled 2 hours ago
                finishedAt: null,
                options: JSON.stringify({
                    description: 'Scheduled posts that are due to be published'
                }),
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 - 5 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
        ];

        await queryInterface.bulkInsert('job_batches', jobBatches, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('job_batches', null, {});
    }
};
