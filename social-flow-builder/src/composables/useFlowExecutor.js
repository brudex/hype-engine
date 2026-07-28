import { topologicalSort } from '../utils/dagUtils';
import { deepClone } from '../utils/contextUtils';
import { resolveVariables } from './useVariableResolver';
import { useFlowStore } from '../stores/flow.store';
import { useRunStore } from '../stores/run.store';
import { useAccountsStore } from '../stores/accounts.store';

export function useFlowExecutor() {
  const flow = useFlowStore();
  const run = useRunStore();
  const accounts = useAccountsStore();

  async function execute(mode = 'test') {
    run.start(mode);
    flow.nodes.forEach((node) => flow.setNodeStatus(node.id, 'idle'));

    let finalStatus = 'success';

    try {
      const orderedNodes = topologicalSort(flow.nodes, flow.edges);
      for (const node of orderedNodes) {
        const nodeKey = node.name || node.id;
        const startedAt = new Date().toISOString();
        const started = performance.now();
        if (node.disabled) {
          const finishedAt = new Date().toISOString();
          const contextEntry = {
            status: 'skipped',
            output: null,
            meta: { startedAt, finishedAt, durationMs: 0 },
            error: null,
          };
          flow.setNodeStatus(node.id, 'skipped');
          run.setNodeOutput(nodeKey, contextEntry);
          run.addLog({
            nodeId: nodeKey,
            status: 'skipped',
            durationMs: 0,
            output: contextEntry,
          });
          continue;
        }
        flow.setNodeStatus(node.id, 'running');

        try {
          const inputContext = deepClone(run.context);
          const nodeResult = await executeNode(node, inputContext, mode, accounts.accounts);
          const finishedAt = new Date().toISOString();
          const durationMs = Math.round(performance.now() - started);
          const contextEntry = {
            status: 'success',
            output: nodeResult.output,
            ...(nodeResult.selectedOutput ? { selectedOutput: nodeResult.selectedOutput } : {}),
            meta: {
              startedAt,
              finishedAt,
              durationMs,
              ...(nodeResult.meta || {}),
            },
            error: null,
          };
          run.setNodeOutput(nodeKey, contextEntry);
          flow.setNodeStatus(node.id, 'success');
          run.addLog({
            nodeId: nodeKey,
            status: 'success',
            durationMs,
            inputContext,
            output: contextEntry,
          });
        } catch (error) {
          const finishedAt = new Date().toISOString();
          const durationMs = Math.round(performance.now() - started);
          const contextEntry = {
            status: 'error',
            output: null,
            meta: { startedAt, finishedAt, durationMs },
            error: {
              message: error.message,
            },
          };
          finalStatus = 'failed';
          run.setNodeOutput(nodeKey, contextEntry);
          flow.setNodeStatus(node.id, 'error', error.message);
          run.addLog({
            nodeId: nodeKey,
            status: 'error',
            durationMs,
            output: contextEntry,
            errorMessage: error.message,
          });
          break;
        }
      }
    } catch (error) {
      finalStatus = 'failed';
      run.addLog({ nodeId: 'flow', status: 'error', durationMs: 0, errorMessage: error.message });
    }

    run.finish(finalStatus);
  }

  return { execute };
}

async function executeNode(node, context, mode, accounts) {
  const cfg = node.config;

  if (node.type === 'input') {
    const result = parseInputValue(cfg.value, cfg.format);
    return {
      output: {
        value: result,
        format: cfg.format,
      },
    };
  }

  if (node.type === 'http_request') {
    const parsedBody = cfg.responseFormat === 'json'
      ? {
          ok: true,
          body: context.trigger?.output?.body || {},
          headers: context.trigger?.output?.headers || {},
          query: context.trigger?.output?.query || {},
        }
      : JSON.stringify(context.trigger?.output?.body || {});

    return {
      output: parsedBody,
      meta: {
        statusCode: 200,
        headers: { 'content-type': cfg.responseFormat === 'json' ? 'application/json' : 'text/plain' },
      },
    };
  }

  if (node.type === 'http_response') {
    const statusTemplate = resolveVariables(String(cfg.statusCode || '200'), context);
    const statusCode = Number.parseInt(statusTemplate, 10) || 200;
    const body = resolveVariables(cfg.body || '', context);

    return {
      output: {
        statusCode,
        body: parseJsonIfPossible(body),
      },
      meta: {
        statusCode,
        responseType: 'webhook',
      },
    };
  }

  if (node.type === 'rest_api') {
    const topic = 'Summer Drops';
    return {
      output: {
        source: resolveVariables(cfg.url, context),
        topics: [{ name: topic, score: 97 }],
        items: [{ title: `${topic} trend report`, engagement: 'high' }],
      },
      meta: {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
      },
    };
  }

  if (node.type === 'prompt') {
    const prompt = resolveVariables(cfg.userPrompt, context);
    const result = `Fresh angle: ${prompt.replace(/\s+/g, ' ').trim()} Keep it crisp, visual, and ready for every channel. #Launch #SocialOps`;
    const variants = Array.from({ length: Number(cfg.variants || 1) }, (_, index) => `${result} Variant ${index + 1}`);
    return {
      output: {
        text: result,
        variants,
      },
      meta: {
        tokensUsed: Math.max(60, Math.round(result.length / 4)),
        model: cfg.model,
      },
    };
  }

  if (node.type === 'javascript') {
    const started = performance.now();
    const writeCaption = context.write_caption?.output?.text || '';
    return {
      output: {
        caption: writeCaption.split('#')[0].trim() || 'Draft caption ready.',
        hashtags: `#Launch #SocialOps`,
        charCount: writeCaption.length,
      },
      meta: {
        executionMs: Math.round(performance.now() - started),
      },
    };
  }

  if (node.type === 'condition') {
    const matchedConditions = Array.isArray(cfg.conditions)
      ? cfg.conditions.map((condition) => evaluateCondition(condition, context))
      : [];

    const selected = matchedConditions.find((condition) => condition.matched);
    return {
      selectedOutput: selected?.id || null,
      output: selected
        ? { matched: true, conditionId: selected.id }
        : { matched: false, conditionId: null },
      meta: { matchedConditions },
    };
  }

  if (node.type === 'post') {
    const caption = resolveVariables(cfg.caption, context);
    const selectedAccounts = accounts.filter((account) => cfg.accounts?.includes(account.id));
    const targets = selectedAccounts.length ? selectedAccounts : accounts.slice(0, 2);
    return {
      output: {
        published: mode !== 'test',
        dryRun: mode === 'test',
        previewUrl: null,
        results: targets.map((account, index) => ({
          platform: account.platform,
          accountId: account.id,
          status: mode === 'test' ? 'dry_run' : 'published',
          url: mode === 'test' ? null : `https://social.example/${account.platform}/posts/${Date.now()}-${index}`,
          caption,
        })),
        failedPlatforms: [],
      },
    };
  }

  throw new Error(`Unsupported node type: ${node.type}`);
}

function evaluateLegacyExpression(expression, context) {
  const resolvedExpression = resolveVariables(expression, context);
  return Boolean(Function(`"use strict"; return (${resolvedExpression || 'false'});`)());
}

function parseInputValue(value, format) {
  if (format !== 'json') return value || '';
  return parseJsonIfPossible(value || '{}');
}

function parseJsonIfPossible(value) {
  if (typeof value !== 'string') return value;
  if (!value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function evaluateCondition(condition, context) {
  const left = resolveConditionValue(condition.left, context, condition.dataType);
  const right = resolveConditionValue(condition.right, context, condition.dataType);
  const matched = compareValues(left, right, condition);

  return {
    id: condition.id,
    dataType: condition.dataType,
    operation: condition.operation,
    left,
    right,
    matched,
  };
}

function resolveConditionValue(value, context, dataType) {
  const resolved = resolveVariables(value ?? '', context);
  if (dataType === 'number') return resolved === '' ? null : Number(resolved);
  if (dataType === 'boolean') return resolved === true || resolved === 'true' || resolved === '1';
  if (dataType === 'array' || dataType === 'object') {
    try {
      return typeof resolved === 'string' ? JSON.parse(resolved) : resolved;
    } catch {
      return resolved;
    }
  }
  return String(resolved ?? '');
}

function compareValues(left, right, condition) {
  const operation = condition.operation;

  if (operation === 'is_empty') return isEmpty(left);
  if (operation === 'is_not_empty') return !isEmpty(left);
  if (operation === 'is_true') return left === true;
  if (operation === 'is_false') return left === false;
  if (operation === 'equals') return left === right;
  if (operation === 'not_equals') return left !== right;

  if (condition.dataType === 'number') {
    if (Number.isNaN(left) || Number.isNaN(right)) return false;
    if (operation === 'greater_than') return left > right;
    if (operation === 'greater_equal') return left >= right;
    if (operation === 'less_than') return left < right;
    if (operation === 'less_equal') return left <= right;
  }

  if (condition.dataType === 'string') {
    if (operation === 'contains') return left.includes(right);
    if (operation === 'not_contains') return !left.includes(right);
    if (operation === 'starts_with') return left.startsWith(right);
    if (operation === 'ends_with') return left.endsWith(right);
  }

  if (condition.dataType === 'array') {
    const leftArray = Array.isArray(left) ? left : [];
    if (operation === 'contains') return leftArray.includes(right);
  }

  if (condition.dataType === 'object') {
    if (operation === 'has_key') return left && typeof left === 'object' && Object.hasOwn(left, right);
  }

  return false;
}

function isEmpty(value) {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
