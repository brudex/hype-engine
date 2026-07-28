import { NODE_TYPES } from './nodeDefaults';

const WORKFLOW_TO_NODE_TYPE = Object.entries(NODE_TYPES).reduce((map, [type, meta]) => {
  map[meta.workflowType || type] = type;
  return map;
}, {});

function preferredLabel(node) {
  return node.name || node.label || NODE_TYPES[node.type]?.label || node.id;
}

/** Unique workflow node names — duplicate canvas labels fall back to node id. */
export function buildWorkflowNameMap(nodes) {
  const preferredCounts = new Map();
  for (const node of nodes) {
    const preferred = preferredLabel(node);
    preferredCounts.set(preferred, (preferredCounts.get(preferred) || 0) + 1);
  }

  const used = new Set();
  const nameById = new Map();
  for (const node of nodes) {
    const preferred = preferredLabel(node);
    let name = preferredCounts.get(preferred) === 1 ? preferred : node.id;
    if (used.has(name)) {
      name = `${preferred}_${node.id}`;
    }
    used.add(name);
    nameById.set(node.id, name);
  }
  return nameById;
}

export function toWorkflowDefinition(flow) {
  const nameById = buildWorkflowNameMap(flow.nodes);
  const nodes = flow.nodes.map((node) => toWorkflowNode(node, nameById));

  return {
    nodes,
    connections: toWorkflowConnections(flow.nodes, flow.edges, nameById),
    pinData: {},
    meta: {
      id: flow.id,
      name: flow.name,
      version: flow.version || '1.0.0',
      triggerType: flow.trigger || 'manual',
    },
  };
}

export function toWorkflowNode(node, nameById = null) {
  const meta = NODE_TYPES[node.type] || {};
  return {
    id: node.id,
    name: nameById?.get(node.id) ?? preferredLabel(node),
    type: meta.workflowType || node.type,
    typeVersion: typeVersionFor(node.type),
    position: [node.position?.x ?? 120, node.position?.y ?? 120],
    parameters: normalizeParameters(node),
    ...(node.disabled ? { disabled: true } : {}),
    ...(node.type === 'http_request' ? { webhookId: node.id } : {}),
  };
}

export function toWorkflowConnections(nodes, edges, nameById = null) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const connections = {};

  edges.forEach((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) return;

    const sourceName = nameById?.get(source.id) ?? preferredLabel(source);
    const targetName = nameById?.get(target.id) ?? preferredLabel(target);
    const outputIndex = outputIndexFor(source, edge.sourceHandle);

    if (!connections[sourceName]) {
      connections[sourceName] = { main: [] };
    }
    while (connections[sourceName].main.length <= outputIndex) {
      connections[sourceName].main.push([]);
    }
    connections[sourceName].main[outputIndex].push({
      node: targetName,
      type: 'main',
      index: 0,
    });
  });

  return connections;
}

export function toWorkflowEdge(edge) {
  return {
    from: edge.source,
    fromOutput: edge.sourceHandle || 'success',
    to: edge.target,
  };
}

function typeVersionFor(type) {
  return {
    input: 1,
    http_request: 1,
    http_response: 1,
    rest_api: 1,
    prompt: 1,
    javascript: 2,
    post: 1,
    condition: 3.2,
  }[type] || 1;
}

function outputIndexFor(node, sourceHandle = 'success') {
  if (node.type !== 'condition') return 0;
  const conditions = Array.isArray(node.config?.conditions) ? node.config.conditions : [];
  const conditionIndex = conditions.findIndex((condition) => condition.id === sourceHandle);
  if (conditionIndex >= 0) return conditionIndex;
  const numericSuffix = String(sourceHandle).match(/(\d+)$/)?.[1];
  return numericSuffix ? Math.max(0, Number(numericSuffix) - 1) : 0;
}

function normalizeParameters(node) {
  const config = clonePlain(node.config || {});

  if (node.type === 'condition') {
    return {
      rules: {
        values: (config.conditions || []).map((condition) => ({
          conditions: {
            combinator: 'and',
            conditions: [
              {
                leftValue: toExpressionValue(condition.left),
                rightValue: parseConditionRightValue(condition),
                operator: conditionOperator(condition),
              },
            ],
          },
        })),
      },
    };
  }

  if (node.type === 'javascript') {
    const { code, ...rest } = config;
    return {
      ...rest,
      jsCode: code || '',
    };
  }

  if (node.type === 'post') {
    return {
      accountUuids: config.accounts || [],
      content: config.caption || '',
      media: config.media ? [config.media] : [],
      schedule: config.schedule || 'now',
      firstComment: config.firstComment || '',
      failureBehavior: config.failureBehavior || 'stop',
    };
  }

  if (node.type === 'input') {
    return {
      inputType: config.format || 'json',
      value: config.value || '',
    };
  }

  if (node.type === 'http_request') {
    return {
      triggerType: 'webhook',
      method: config.method || 'POST',
      responseFormat: config.responseFormat || 'json',
      timeout: config.timeout || 10000,
    };
  }

  if (node.type === 'http_response') {
    return {
      responseCode: config.statusCode || '200',
      responseBody: config.body || '',
    };
  }

  return config;
}

function toExpressionValue(value) {
  if (typeof value !== 'string') return value;
  if (value.startsWith('=')) return value;
  if (value.includes('{{')) return value;
  return value;
}

function parseConditionRightValue(condition) {
  if (['number'].includes(condition.dataType)) {
    const parsed = Number(condition.right);
    return Number.isNaN(parsed) ? condition.right : parsed;
  }
  return condition.right;
}

function conditionOperator(condition) {
  return {
    type: condition.dataType || 'string',
    operation: {
      equals: 'equals',
      not_equals: 'notEquals',
      greater_than: 'gt',
      greater_equal: 'gte',
      less_than: 'lt',
      less_equal: 'lte',
      contains: 'contains',
      not_contains: 'notContains',
      starts_with: 'startsWith',
      ends_with: 'endsWith',
      is_empty: 'empty',
      is_not_empty: 'notEmpty',
      is_true: 'true',
      is_false: 'false',
      has_key: 'hasKey',
    }[condition.operation] || condition.operation || 'equals',
  };
}

export function fromWorkflowDefinition(definition) {
  const nodes = Array.isArray(definition?.nodes) ? definition.nodes.map(fromWorkflowNode) : [];
  const edges = definition?.connections
    ? fromWorkflowConnections(definition.connections, nodes)
    : Array.isArray(definition?.edges)
      ? definition.edges.map(fromWorkflowEdge)
      : [];

  return {
    id: definition?.meta?.id || definition?.id || 'draft-flow',
    name: definition?.meta?.name || definition?.name || 'Untitled Flow',
    trigger: definition?.meta?.triggerType || definition?.trigger?.type || 'manual',
    nodes,
    edges,
  };
}

export function fromWorkflowNode(node) {
  const type = WORKFLOW_TO_NODE_TYPE[node.type] || node.type;
  const meta = NODE_TYPES[type] || {};
  const name = node.name || node.id;

  return {
    id: node.id,
    name,
    type,
    label: meta.label || name,
    position: Array.isArray(node.position)
      ? { x: node.position[0] ?? 120, y: node.position[1] ?? 120 }
      : node.position || { x: 120, y: 120 },
    status: 'idle',
    disabled: Boolean(node.disabled),
    warning: '',
    selected: false,
    config: {
      ...clonePlain(meta.config || {}),
      ...denormalizeParameters(type, node.parameters || node.config || {}),
    },
  };
}

export function fromWorkflowEdge(edge) {
  const source = edge.from || edge.source;
  const target = edge.to || edge.target;
  const sourceHandle = edge.fromOutput || edge.sourceHandle || 'success';

  return {
    id: edge.id || `${source}-${sourceHandle}-${target}`,
    source,
    target,
    sourceHandle,
    animated: false,
  };
}

export function fromWorkflowConnections(connections, nodes) {
  const nodeByName = new Map(nodes.flatMap((node) => [[node.name, node], [node.label, node], [node.id, node]]));
  const edges = [];

  Object.entries(connections || {}).forEach(([sourceName, connection]) => {
    const source = nodeByName.get(sourceName);
    if (!source) return;

    (connection.main || []).forEach((targets, outputIndex) => {
      (targets || []).forEach((target, targetIndex) => {
        const targetNode = nodeByName.get(target.node);
        if (!targetNode) return;
        const sourceHandle = sourceHandleFor(source, outputIndex);
        edges.push({
          id: `${source.id}-${sourceHandle}-${targetNode.id}-${targetIndex}`,
          source: source.id,
          target: targetNode.id,
          sourceHandle,
          animated: false,
        });
      });
    });
  });

  return edges;
}

function sourceHandleFor(node, outputIndex) {
  if (node.type !== 'condition') return 'success';
  return node.config?.conditions?.[outputIndex]?.id || `condition_${outputIndex + 1}`;
}

function denormalizeParameters(type, parameters) {
  const params = clonePlain(parameters || {});

  if (type === 'condition') {
    if (Array.isArray(params.conditions)) {
      return { conditions: params.conditions };
    }

    return {
      conditions: (params.rules?.values || []).map((rule, index) => {
        const condition = rule.conditions?.conditions?.[0] || {};
        return {
          id: `condition_${index + 1}`,
          label: `Condition ${index + 1}`,
          dataType: condition.operator?.type || 'string',
          operation: denormalizeOperator(condition.operator?.operation),
          left: condition.leftValue ?? '',
          right: condition.rightValue ?? '',
        };
      }),
    };
  }

  if (type === 'javascript') {
    const { jsCode, ...rest } = params;
    return { ...rest, code: jsCode || params.code || '' };
  }

  if (type === 'post') {
    return {
      accounts: params.accountUuids || params.accounts || [],
      caption: params.content || params.caption || '',
      media: Array.isArray(params.media) ? params.media[0] || '' : params.media || '',
      schedule: params.schedule || 'now',
      firstComment: params.firstComment || '',
      failureBehavior: params.failureBehavior || 'stop',
    };
  }

  if (type === 'input') {
    return {
      format: params.inputType || 'json',
      value: params.value || '',
    };
  }

  if (type === 'http_request') {
    return {
      method: params.method || 'POST',
      url: params.url || '',
      headers: params.headers || '',
      body: params.body || '',
      query: params.query || {},
      responseFormat: params.responseFormat || 'json',
      timeout: params.timeout || 10000,
    };
  }

  if (type === 'http_response') {
    return {
      statusCode: params.responseCode || '200',
      body: params.responseBody || '',
    };
  }

  return params;
}

function denormalizeOperator(operation) {
  return {
    notEquals: 'not_equals',
    gt: 'greater_than',
    gte: 'greater_equal',
    lt: 'less_than',
    lte: 'less_equal',
    notContains: 'not_contains',
    startsWith: 'starts_with',
    endsWith: 'ends_with',
    empty: 'is_empty',
    notEmpty: 'is_not_empty',
    true: 'is_true',
    false: 'is_false',
    hasKey: 'has_key',
  }[operation] || operation || 'equals';
}

function normalizeConfig(node) {
  if (node.type !== 'condition') return clonePlain(node.config || {});

  return {
    conditions: (node.config.conditions || []).map((condition, index) => ({
      id: condition.id || `condition_${index + 1}`,
      label: condition.label || `Condition ${index + 1}`,
      expression: condition.expression || conditionToExpression(condition),
      dataType: condition.dataType,
      operation: condition.operation,
      left: condition.left,
      right: condition.right,
    })),
  };
}

function clonePlain(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function logicOutputs(node) {
  return (node.config.conditions || []).reduce((outputs, condition, index) => {
    const id = condition.id || `condition_${index + 1}`;
    outputs[id] = {
      schema: {
        matched: 'boolean',
        conditionId: 'string',
      },
    };
    return outputs;
  }, {});
}

function conditionToExpression(condition) {
  const left = condition.left || '';
  const right = condition.right || '';
  const op = {
    equals: '===',
    not_equals: '!==',
    greater_than: '>',
    greater_equal: '>=',
    less_than: '<',
    less_equal: '<=',
  }[condition.operation];

  if (op) return `${left} ${op} ${right}`;
  if (condition.operation === 'is_empty') return `!${left}`;
  if (condition.operation === 'is_not_empty') return `!!${left}`;
  if (condition.operation === 'is_true') return `${left} === true`;
  if (condition.operation === 'is_false') return `${left} === false`;
  if (condition.operation === 'contains') return `${left}.includes(${right})`;
  if (condition.operation === 'not_contains') return `!${left}.includes(${right})`;
  return `${left}`;
}
