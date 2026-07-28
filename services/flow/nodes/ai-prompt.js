const axios = require('axios');
const { resolveDeep, resolveString } = require('../flow-variable-resolver');

function extractModel(params) {
    const m = params.model;
    if (m == null) return 'gpt-4o-mini';
    if (typeof m === 'string') return m;
    if (typeof m === 'object' && m.value) return String(m.value);
    return 'gpt-4o-mini';
}

async function runAiPrompt(nodeDef, context, dryRun) {
    const resolveOpts = nodeDef._resolveOptions || {};
    const params = resolveDeep(nodeDef.config || {}, context, resolveOpts);
    const model = extractModel(params);
    const systemPrompt = resolveString(
        params.options?.systemMessage || params.systemPrompt || '',
        context,
        resolveOpts
    );
    const userPrompt = resolveString(params.userPrompt || params.prompt || '', context, resolveOpts);
    const temperature = params.temperature != null ? Number(params.temperature) : 0.7;
    const maxTokens = params.maxTokens != null ? parseInt(params.maxTokens, 10) : 300;

    if (dryRun) {
        return {
            output: { text: '', variants: [] },
            meta: { model, tokensUsed: 0, dryRun: true }
        };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return {
            output: {
                text: '[OpenAI not configured: set OPENAI_API_KEY]',
                variants: []
            },
            meta: { model, tokensUsed: 0, stub: true }
        };
    }

    const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model,
            temperature,
            max_tokens: maxTokens,
            messages: [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                { role: 'user', content: userPrompt || systemPrompt || ' ' }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 120000
        }
    );

    const choice = res.data?.choices?.[0];
    const text = choice?.message?.content || '';
    const tokensUsed = res.data?.usage?.total_tokens || 0;

    return {
        output: { text, variants: text ? [text] : [] },
        meta: { model, tokensUsed }
    };
}

module.exports = { runAiPrompt };
