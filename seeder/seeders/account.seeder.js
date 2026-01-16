const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Get project UUIDs
        const projects = await queryInterface.sequelize.query(
            `SELECT "uuid" FROM "mixpost_projects";`
        );
        const projectUuids = projects[0].map(project => project.uuid);

        if (projectUuids.length === 0) {
            console.log('No projects found. Please seed projects first.');
            return;
        }

        const accounts = [
            // Twitter Accounts
            {
                uuid: uuidv4(),
                name: 'Twitter Account 1',
                username: 'twitter_user_1',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=Twitter1',
                    mime_type: 'image/png'
                }),
                provider: 'twitter',
                providerId: '1234567890',
                data: JSON.stringify({
                    followers_count: 1000,
                    following_count: 500,
                    tweet_count: 250
                }),
                authorized: true,
                accessToken: 'sample_twitter_access_token_1',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'Twitter Account 2',
                username: 'twitter_user_2',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=Twitter2',
                    mime_type: 'image/png'
                }),
                provider: 'twitter',
                providerId: '0987654321',
                data: JSON.stringify({
                    followers_count: 2000,
                    following_count: 800,
                    tweet_count: 500
                }),
                authorized: true,
                accessToken: 'sample_twitter_access_token_2',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Facebook Accounts
            {
                uuid: uuidv4(),
                name: 'Facebook Page 1',
                username: 'facebook_page_1',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=Facebook1',
                    mime_type: 'image/png'
                }),
                provider: 'facebook',
                providerId: '111222333444',
                data: JSON.stringify({
                    likes: 5000,
                    followers: 3000
                }),
                authorized: true,
                accessToken: 'sample_facebook_access_token_1',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'Facebook Page 2',
                username: 'facebook_page_2',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=Facebook2',
                    mime_type: 'image/png'
                }),
                provider: 'facebook',
                providerId: '555666777888',
                data: JSON.stringify({
                    likes: 8000,
                    followers: 5000
                }),
                authorized: true,
                accessToken: 'sample_facebook_access_token_2',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Instagram Accounts
            {
                uuid: uuidv4(),
                name: 'Instagram Account 1',
                username: 'instagram_user_1',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=Instagram1',
                    mime_type: 'image/png'
                }),
                provider: 'instagram',
                providerId: 'ig_123456789',
                data: JSON.stringify({
                    followers_count: 15000,
                    follows_count: 2000,
                    media_count: 500
                }),
                authorized: true,
                accessToken: 'sample_instagram_access_token_1',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'Instagram Account 2',
                username: 'instagram_user_2',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=Instagram2',
                    mime_type: 'image/png'
                }),
                provider: 'instagram',
                providerId: 'ig_987654321',
                data: JSON.stringify({
                    followers_count: 25000,
                    follows_count: 3000,
                    media_count: 800
                }),
                authorized: true,
                accessToken: 'sample_instagram_access_token_2',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // LinkedIn Accounts
            {
                uuid: uuidv4(),
                name: 'LinkedIn Company Page 1',
                username: 'linkedin_company_1',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=LinkedIn1',
                    mime_type: 'image/png'
                }),
                provider: 'linkedin',
                providerId: 'li_123456789',
                data: JSON.stringify({
                    followers_count: 5000,
                    employee_count: 100
                }),
                authorized: true,
                accessToken: 'sample_linkedin_access_token_1',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'LinkedIn Company Page 2',
                username: 'linkedin_company_2',
                media: JSON.stringify({
                    url: 'https://via.placeholder.com/150?text=LinkedIn2',
                    mime_type: 'image/png'
                }),
                provider: 'linkedin',
                providerId: 'li_987654321',
                data: JSON.stringify({
                    followers_count: 10000,
                    employee_count: 250
                }),
                authorized: true,
                accessToken: 'sample_linkedin_access_token_2',
                projectUuid: projectUuids[0],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // If there are multiple projects, add accounts to the second project as well
        if (projectUuids.length > 1) {
            accounts.push(
                {
                    uuid: uuidv4(),
                    name: 'Twitter Account 3',
                    username: 'twitter_user_3',
                    media: JSON.stringify({
                        url: 'https://via.placeholder.com/150?text=Twitter3',
                        mime_type: 'image/png'
                    }),
                    provider: 'twitter',
                    providerId: '1122334455',
                    data: JSON.stringify({
                        followers_count: 3000,
                        following_count: 1000,
                        tweet_count: 750
                    }),
                    authorized: true,
                    accessToken: 'sample_twitter_access_token_3',
                    projectUuid: projectUuids[1],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    uuid: uuidv4(),
                    name: 'Facebook Page 3',
                    username: 'facebook_page_3',
                    media: JSON.stringify({
                        url: 'https://via.placeholder.com/150?text=Facebook3',
                        mime_type: 'image/png'
                    }),
                    provider: 'facebook',
                    providerId: '999888777666',
                    data: JSON.stringify({
                        likes: 12000,
                        followers: 8000
                    }),
                    authorized: true,
                    accessToken: 'sample_facebook_access_token_3',
                    projectUuid: projectUuids[1],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            );
        }

        await queryInterface.bulkInsert('mixpost_accounts', accounts, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('mixpost_accounts', null, {});
    }
};

