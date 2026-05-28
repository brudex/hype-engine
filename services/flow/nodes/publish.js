const { v4: uuidv4 } = require('uuid');
const db = require('../../../models');
const { Op } = require('sequelize');
const PlatformServiceFactory = require('../../platform');
const { resolveDeep, resolveString } = require('../flow-variable-resolver');

async function runPublish(nodeDef, context, dryRun, userUuid) {
    const config = resolveDeep(nodeDef.config || {}, context);
    const projectUuid = config.projectUuid;
    const accountUuids = Array.isArray(config.accountUuids) ? config.accountUuids : [];
    const contentTemplate = config.content != null ? config.content : '{{ }}';
    const content = resolveString(String(contentTemplate), context);

    if (dryRun) {
        return {
            output: {
                published: false,
                dryRun: true,
                previewUrl: null,
                results: []
            },
            meta: {}
        };
    }

    if (!projectUuid || accountUuids.length === 0) {
        return {
            output: {
                published: false,
                dryRun: false,
                previewUrl: null,
                results: [
                    {
                        ok: false,
                        error: 'publish node requires projectUuid and accountUuids'
                    }
                ]
            },
            meta: {}
        };
    }

    const project = await db.Project.findOne({
        where: { uuid: projectUuid, userUuid }
    });
    if (!project) {
        return {
            output: {
                published: false,
                dryRun: false,
                previewUrl: null,
                results: [{ ok: false, error: 'Project not found or access denied' }]
            },
            meta: {}
        };
    }

    const accounts = await db.Account.findAll({
        where: {
            uuid: { [Op.in]: accountUuids },
            projectUuid
        }
    });

    const results = [];
    const mockPost = {
        uuid: uuidv4(),
        userUuid,
        projectUuid,
        status: 0
    };
    const mockPostVersion = {
        content,
        media: Array.isArray(config.media) ? config.media : []
    };
    const tags = [];

    for (const acc of accounts) {
        const svc = PlatformServiceFactory.getService(acc.provider);
        if (!svc || typeof svc.publishPost !== 'function') {
            results.push({
                ok: false,
                accountUuid: acc.uuid,
                provider: acc.provider,
                error: `Publish not implemented for ${acc.provider}`
            });
            continue;
        }
        try {
            const pub = await svc.publishPost(mockPost, mockPostVersion, tags, acc);
            results.push({
                ok: !!pub.success,
                accountUuid: acc.uuid,
                provider: acc.provider,
                data: pub.data,
                error: pub.error
            });
        } catch (e) {
            results.push({
                ok: false,
                accountUuid: acc.uuid,
                provider: acc.provider,
                error: e.message || String(e)
            });
        }
    }

    const anyOk = results.some((r) => r.ok);

    return {
        output: {
            published: anyOk,
            dryRun: false,
            previewUrl: null,
            results
        },
        meta: {}
    };
}

module.exports = { runPublish };
