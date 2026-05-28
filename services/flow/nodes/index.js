const { runInput } = require('./input');
const { runHttpRequest } = require('./http-request');
const { runAiPrompt } = require('./ai-prompt');
const { runJavascript } = require('./javascript');
const { runLogic } = require('./logic');
const { runPublish } = require('./publish');

const runners = {
    input: runInput,
    http_request: runHttpRequest,
    rest: runHttpRequest,
    ai_prompt: runAiPrompt,
    javascript: runJavascript,
    logic: runLogic,
    publish: runPublish
};

function getRunner(type) {
    return runners[type] || null;
}

module.exports = {
    getRunner,
    runners
};
