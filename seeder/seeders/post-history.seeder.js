const { v4: uuidv4 } = require('uuid');

const STATUS_SUCCESS = 0;
const STATUS_FAILED = 1;

const SAMPLE_CONTENT = [
    'QuizFactorA+ — Daily certification practice questions.',
    'New AWS Solutions Architect quiz pack is live. Try it today!',
    'CISA study tip: review domain 4 before your exam.',
    'LinkedIn post: we just shipped recurring schedules in HypeEngine.'
];

/**
 * @param {Array} versions
 * @param {string} postUuid
 * @param {string} accountUuid
 */
function pickVersion(versions, postUuid, accountUuid) {
    const forPost = versions.filter((v) => v.postUuid === postUuid);
    if (forPost.length === 0) {
        return null;
    }
    const accountVersion = forPost.find((v) => v.accountUuid === accountUuid);
    return accountVersion || forPost.find((v) => v.isOriginal) || forPost[0];
}

function parseJsonField(value) {
    if (value == null) {
        return null;
    }
    if (typeof value === 'object') {
        return value;
    }
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function buildHistoryRow({
    postUuid,
    accountUuid,
    publishedAt,
    status,
    providerPostId,
    recurringType,
    content,
    media,
    data
}) {
    const now = new Date();
    return {
        uuid: uuidv4(),
        postUuid,
        accountUuid,
        publishedAt,
        status,
        providerPostId: providerPostId || null,
        recurringType: recurringType ?? 0,
        content: content || null,
        media: media != null ? JSON.stringify(media) : null,
        data: data != null ? JSON.stringify(data) : null,
        createdAt: publishedAt || now,
        updatedAt: publishedAt || now
    };
}

module.exports = {
    up: async (queryInterface) => {
        const [posts] = await queryInterface.sequelize.query(
            `SELECT "uuid", "status", "publishedAt", "recurringType", "scheduledAt"
             FROM "posts";`
        );

        const [postAccounts] = await queryInterface.sequelize.query(
            `SELECT "postUuid", "accountUuid", "providerPostId", "data", "errors"
             FROM "post_accounts";`
        );

        const [versions] = await queryInterface.sequelize.query(
            `SELECT "postUuid", "accountUuid", "content", "media", "isOriginal"
             FROM "post_versions";`
        );

        if (posts.length === 0) {
            console.log('No posts found. Seed posts and post_accounts before post history.');
            return;
        }

        if (postAccounts.length === 0) {
            console.log('No post_accounts found. Run post-account.seeder.js first (or create links manually).');
            return;
        }

        const postByUuid = {};
        posts.forEach((p) => {
            postByUuid[p.uuid] = p;
        });

        const histories = [];
        const dayMs = 24 * 60 * 60 * 1000;

        postAccounts.forEach((link, index) => {
            const post = postByUuid[link.postUuid];
            if (!post) {
                return;
            }

            const version = pickVersion(versions, link.postUuid, link.accountUuid);
            const content = version?.content || SAMPLE_CONTENT[index % SAMPLE_CONTENT.length];
            let media = parseJsonField(version?.media);
            if (media == null) {
                media = [];
            }

            const recurringType = post.recurringType ?? 0;
            const linkErrors = parseJsonField(link.errors);
            const isFailed = !!linkErrors;

            const basePublishedAt = post.publishedAt
                ? new Date(post.publishedAt)
                : new Date(Date.now() - (index + 1) * dayMs);

            const occurrenceCount = recurringType === 1 || recurringType === 2
                ? Math.floor(Math.random() * 3) + 2
                : 1;

            for (let i = 0; i < occurrenceCount; i++) {
                const publishedAt = new Date(basePublishedAt.getTime() - i * dayMs);
                const isLast = i === 0;
                const failed = isLast && isFailed;

                histories.push(buildHistoryRow({
                    postUuid: link.postUuid,
                    accountUuid: link.accountUuid,
                    publishedAt,
                    status: failed ? STATUS_FAILED : STATUS_SUCCESS,
                    providerPostId: failed ? null : (link.providerPostId || `seed_${link.accountUuid}_${i}`),
                    recurringType,
                    content,
                    media,
                    data: failed
                        ? { error: linkErrors?.message || String(linkErrors) || 'Publish failed' }
                        : parseJsonField(link.data) || {
                            engagement: {
                                likes: Math.floor(Math.random() * 500),
                                comments: Math.floor(Math.random() * 50)
                            }
                        }
                }));
            }
        });

        // Extra failed row for history UI testing (first post + first account)
        if (posts.length > 0 && postAccounts.length > 0) {
            const post = posts[0];
            const link = postAccounts[0];
            const version = pickVersion(versions, link.postUuid, link.accountUuid);

            histories.push(buildHistoryRow({
                postUuid: link.postUuid,
                accountUuid: link.accountUuid,
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                status: STATUS_FAILED,
                providerPostId: null,
                recurringType: post.recurringType ?? 0,
                content: version?.content || SAMPLE_CONTENT[0],
                media: parseJsonField(version?.media) || [],
                data: {
                    error: 'Rate limit exceeded. Please try again later.',
                    response: { code: 'RATE_LIMIT_EXCEEDED' }
                }
            }));
        }

        if (histories.length === 0) {
            console.log('No post history rows generated.');
            return;
        }

        await queryInterface.bulkInsert('post_histories', histories, {});
        console.log(`Seeded ${histories.length} post_histories row(s).`);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('post_histories', null, {});
    }
};
