const axios = require('axios');
const { resolveDeep, resolveString } = require('../flow-variable-resolver');

async function runAiPrompt(nodeDef, context, dryRun) {
    const config = resolveDeep(nodeDef.config || {}, context);
    const model = config.model || 'gpt-4o-mini';
    const systemPrompt = resolveString(config.systemPrompt || '', context);
    const userPrompt = resolveString(config.userPrompt || '', context);
    const temperature = config.temperature != null ? Number(config.temperature) : 0.7;
    const maxTokens = config.maxTokens != null ? parseInt(config.maxTokens, 10) : 300;

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
                { role: 'user', content: userPrompt || ' ' }
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
