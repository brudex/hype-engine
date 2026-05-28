const db = require('../../models');
const logger = require('../../utils/logger');
const PlatformServiceFactory = require('../../services/platform');

/** @see models/post-history.js */
const POST_HISTORY_SUCCESS = 0;
const POST_HISTORY_FAILED = 1;

function snapshotMedia(media) {
    if (media == null) {
        return null;
    }
    try {
        return JSON.parse(JSON.stringify(media));
    } catch {
        return media;
    }
}

function buildHistoryData(success, publishData, errorMessage) {
    if (success) {
        return publishData || null;
    }
    const payload = { error: errorMessage || 'Unknown error' };
    if (publishData && typeof publishData === 'object') {
        payload.response = publishData;
    }
    return payload;
}

/**
 * @param {object} params
 * @param {import('../../models').Post} params.post
 * @param {string} params.accountUuid
 * @param {import('../../models').PostVersion|null} params.postVersion
 * @param {boolean} params.success
 * @param {string|null} [params.providerPostId]
 * @param {object|null} [params.publishData]
 * @param {string|null} [params.errorMessage]
 */
async function recordPostHistory({
    post,
    accountUuid,
    postVersion,
    success,
    providerPostId,
    publishData,
    errorMessage
}) {
    try {
        await db.PostHistory.create({
            postUuid: post.uuid,
            accountUuid,
            publishedAt: new Date(),
            status: success ? POST_HISTORY_SUCCESS : POST_HISTORY_FAILED,
            providerPostId: success ? (providerPostId || null) : null,
            recurringType: post.recurringType ?? 0,
            content: postVersion?.content ?? null,
            media: snapshotMedia(postVersion?.media),
            data: buildHistoryData(success, publishData, errorMessage)
        });
    } catch (historyError) {
        logger.error('Failed to record post history', {
            postUuid: post.uuid,
            accountUuid,
            message: historyError?.message
        });
    }
}

/**
 * Publish a post to all linked accounts (shared by one-time and recurring jobs).
 * Writes a {@link PostHistory} row per account (success and failure).
 * @param {import('../../models').Post} post - Sequelize instance with accounts, versions, tags loaded
 * @returns {Promise<Array<{ accountUuid: string, success: boolean, error?: string, providerPostId?: string }>>}
 */
async function publishPostToAccounts(post) {
    let postVersions = post.versions || [];

    if (postVersions.length === 0) {
        postVersions = await db.PostVersion.findAll({
            where: {
                postUuid: post.uuid,
                isOriginal: true
            }
        });
    }

    if (postVersions.length === 0) {
        throw new Error('No post versions found');
    }

    const accountResults = [];

    for (const account of post.accounts) {
        let postVersion = null;

        try {
            postVersion = postVersions.find((v) => v.accountUuid === account.uuid);
            if (!postVersion) {
                postVersion = postVersions.find((v) => v.isOriginal === true) || postVersions[0];
            }

            if (!postVersion) {
                throw new Error(`No version found for account ${account.uuid}`);
            }

            const platformService = PlatformServiceFactory.getService(account.provider);

            if (!platformService || !platformService.publishPost) {
                throw new Error(`Publish not implemented for platform: ${account.provider}`);
            }

            const publishResult = await platformService.publishPost(
                post,
                postVersion,
                post.tags || [],
                account
            );

            const success = !!publishResult.success;

            accountResults.push({
                accountUuid: account.uuid,
                success,
                error: publishResult.error,
                providerPostId: publishResult.providerPostId
            });

            await recordPostHistory({
                post,
                accountUuid: account.uuid,
                postVersion,
                success,
                providerPostId: publishResult.providerPostId,
                publishData: publishResult.data,
                errorMessage: publishResult.error
            });

            const postAccount = await db.PostAccount.findOne({
                where: {
                    postUuid: post.uuid,
                    accountUuid: account.uuid
                }
            });

            if (postAccount) {
                if (success && publishResult.providerPostId) {
                    postAccount.providerPostId = publishResult.providerPostId;
                    postAccount.errors = null;
                    postAccount.data = publishResult.data || null;
                } else if (!success) {
                    postAccount.errors = publishResult.error || 'Unknown error';
                }
                await postAccount.save();
            }
        } catch (accountError) {
            logger.error(`Error publishing to account ${account.uuid}:`, accountError);

            accountResults.push({
                accountUuid: account.uuid,
                success: false,
                error: accountError.message
            });

            await recordPostHistory({
                post,
                accountUuid: account.uuid,
                postVersion,
                success: false,
                errorMessage: accountError.message
            });

            const postAccount = await db.PostAccount.findOne({
                where: {
                    postUuid: post.uuid,
                    accountUuid: account.uuid
                }
            });
            if (postAccount) {
                postAccount.errors = accountError.message;
                await postAccount.save();
            }
        }
    }

    return accountResults;
}

module.exports = {
    publishPostToAccounts,
    recordPostHistory,
    POST_HISTORY_SUCCESS,
    POST_HISTORY_FAILED
};
