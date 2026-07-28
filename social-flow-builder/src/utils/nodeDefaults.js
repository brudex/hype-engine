export const NODE_TYPES = {
  input: {
    label: 'Input',
    icon: 'IN',
    description: 'Provide a JSON or text payload to downstream nodes.',
    workflowType: 'input',
    outputs: {
      success: {
        schema: {
          value: 'any',
          format: 'string',
        },
      },
      error: {},
    },
    config: {
      format: 'json',
      value: '{\n  "topic": "Summer Drops",\n  "audience": "founders"\n}',
    },
  },
  http_request: {
    label: 'HTTP Request',
    icon: 'HTTP IN',
    description: 'Receive webhook calls and pass the request payload downstream.',
    workflowType: 'http_request',
    outputs: {
      success: {
        schema: {
          body: 'any',
          headers: 'object',
          query: 'object',
        },
      },
      error: {
        schema: {
          message: 'string',
          statusCode: 'number',
        },
      },
    },
    config: {
      endpoint: '',
      method: 'POST',
      responseFormat: 'json',
      timeout: 10000,
    },
  },
  http_response: {
    label: 'HTTP Response',
    icon: 'HTTP OUT',
    description: 'Return a status code and response body to the webhook caller.',
    workflowType: 'http_response',
    outputs: {
      success: {
        schema: {
          statusCode: 'number',
          body: 'any',
        },
      },
      error: {},
    },
    config: {
      statusCode: '200',
      body: '{\n  "ok": true,\n  "message": "Flow completed"\n}',
    },
  },
  rest_api: {
    label: 'REST',
    icon: 'REST',
    description: 'Fetch external data through the host bridge.',
    workflowType: 'rest',
    outputs: {
      success: {
        schema: {
          topics: 'array',
          items: 'array',
        },
      },
      error: {
        schema: {
          message: 'string',
          statusCode: 'number',
        },
      },
    },
    config: {
      url: 'https://api.example.com/trends',
      method: 'GET',
      headers: '',
      body: '',
      auth: 'none',
      timeout: 10000,
      retry: 0,
    },
  },
  prompt: {
    label: 'AI Prompt',
    icon: 'AI',
    description: 'Generate social copy from upstream context.',
    workflowType: 'ai_prompt',
    outputs: {
      success: {
        schema: {
          text: 'string',
          variants: 'array',
        },
      },
      error: {},
    },
    config: {
      model: 'gpt-4o-mini',
      systemPrompt: 'You are a sharp social media strategist.',
      userPrompt: 'Write a concise post about {{fetch_trends.output.topics[0].name}}.',
      temperature: 0.7,
      maxTokens: 600,
      outputFormat: 'text',
      variants: 1,
      apiKeySource: 'platform',
    },
  },
  javascript: {
    label: 'Javascript',
    icon: '{}',
    description: 'Reshape outputs with sandboxed JavaScript.',
    workflowType: 'javascript',
    outputs: {
      success: {
        schema: {
          caption: 'string',
          hashtags: 'string',
        },
      },
      error: {},
    },
    config: {
      code: 'async function run(inputs) {\n  return inputs;\n}',
      timeout: 5000,
      memoryLimit: 64,
    },
  },
  post: {
    label: 'Publish',
    icon: 'POST',
    description: 'Dry-run or publish through Mixpost services.',
    workflowType: 'publish',
    outputs: {
      success: {},
      error: {},
    },
    config: {
      accounts: [],
      caption: '{{format_output.output.caption}}',
      media: '',
      schedule: 'now',
      firstComment: '',
      failureBehavior: 'stop',
    },
  },
  condition: {
    label: 'Logic',
    icon: 'IF',
    description: 'Branch execution from one or more comparison rules.',
    workflowType: 'logic',
    outputs: {},
    config: {
      conditions: [
        {
          id: 'condition_1',
          label: 'Condition 1',
          dataType: 'number',
          operation: 'less_than',
          left: '{{write_caption.meta.tokensUsed}}',
          right: '300',
        },
      ],
    },
  },
};

export function createNode(type, index = 1, position = { x: 120, y: 120 }) {
  const meta = NODE_TYPES[type];
  const name = defaultNodeName(type, index);

  return {
    id: createNodeId(),
    name,
    type,
    label: meta.label,
    position,
    status: 'idle',
    disabled: false,
    warning: '',
    config: structuredClone(meta.config),
  };
}

export function createNodeId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function defaultNodeName(type, index) {
  const base = {
    input: 'input_data',
    http_request: 'http_request',
    http_response: 'http_response',
    rest_api: 'fetch_trends',
    prompt: 'write_caption',
    javascript: 'format_output',
    post: 'publish_post',
    condition: 'check_length',
  }[type];
  return index === 1 ? base : `${base}_${index}`;
}
