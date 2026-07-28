import { describe, expect, it } from 'vitest';
import sampleFlow from '../../sample-flow.json';
import { createNode } from '../../src/utils/nodeDefaults';
import { fromWorkflowDefinition, toWorkflowDefinition } from '../../src/utils/workflowSchema';

describe('workflow schema conversion', () => {
  it('creates new canvas nodes with UUID ids and readable workflow names', () => {
    const node = createNode('rest_api', 1, { x: 10, y: 20 });

    expect(node.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(node.name).toBe('fetch_trends');
    expect(node.label).toBe('REST');
  });

  it('exports the n8n-compatible workflow definition shape', () => {
    const definition = toWorkflowDefinition({
      id: 'draft-flow',
      name: 'Branching Flow',
      version: '1.0.0',
      trigger: 'manual',
      nodes: [
        {
          id: 'input_data',
          type: 'input',
          label: 'Input',
          position: { x: 120, y: -160 },
          config: { format: 'json', value: '{}' },
        },
        {
          id: 'check_length',
          type: 'condition',
          label: 'Check Length',
          position: { x: 380, y: 220 },
          config: {
            conditions: [
              { id: 'has_topics', dataType: 'number', operation: 'greater_than', left: '={{$json["topics"].length}}', right: '0' },
              { id: 'no_topics', dataType: 'number', operation: 'equals', left: '={{$json["topics"].length}}', right: '0' },
            ],
          },
        },
        {
          id: 'write_caption',
          type: 'prompt',
          label: 'Write Caption',
          position: { x: 640, y: 120 },
          config: { userPrompt: 'Write it', model: 'gpt-4o-mini' },
        },
      ],
      edges: [
        { source: 'input_data', sourceHandle: 'success', target: 'check_length' },
        { source: 'check_length', sourceHandle: 'has_topics', target: 'write_caption' },
      ],
    });

    expect(definition).toHaveProperty('nodes');
    expect(definition).toHaveProperty('connections');
    expect(definition).toHaveProperty('pinData');
    expect(definition).toHaveProperty('meta');
    expect(definition).not.toHaveProperty('trigger');
    expect(definition).not.toHaveProperty('edges');
    expect(definition.nodes[0]).toMatchObject({
      id: 'input_data',
      type: 'input',
      typeVersion: 1,
      position: [120, -160],
    });
    expect(definition.nodes[0]).toHaveProperty('parameters');
    expect(definition.nodes[0]).not.toHaveProperty('config');
    expect(definition.connections.Input.main[0][0]).toEqual({ node: 'Check Length', type: 'main', index: 0 });
    expect(definition.connections['Check Length'].main[0][0]).toEqual({ node: 'Write Caption', type: 'main', index: 0 });
    expect(definition.nodes[1].parameters.rules.values[0].conditions.conditions[0].operator).toEqual({
      type: 'number',
      operation: 'gt',
    });
  });

  it('uses unique workflow names when multiple nodes share the same label', () => {
    const definition = toWorkflowDefinition({
      id: 'draft-flow',
      name: 'Duplicate Labels',
      nodes: [
        {
          id: 'input_data',
          type: 'input',
          label: 'Input',
          position: { x: 120, y: 120 },
          config: { format: 'json', value: '{}' },
        },
        {
          id: 'fetch_trends',
          type: 'rest_api',
          label: 'REST',
          position: { x: 400, y: 80 },
          config: { url: 'https://api.example.com/a' },
        },
        {
          id: 'fetch_trends_2',
          type: 'rest_api',
          label: 'REST',
          position: { x: 400, y: 220 },
          config: { url: 'https://api.example.com/b' },
        },
      ],
      edges: [
        { source: 'input_data', sourceHandle: 'success', target: 'fetch_trends' },
        { source: 'fetch_trends', sourceHandle: 'success', target: 'fetch_trends_2' },
      ],
    });

    const names = definition.nodes.map((node) => node.name);
    expect(new Set(names).size).toBe(names.length);
    expect(definition.nodes.find((node) => node.id === 'fetch_trends')?.name).toBe('fetch_trends');
    expect(definition.nodes.find((node) => node.id === 'fetch_trends_2')?.name).toBe('fetch_trends_2');
    expect(definition.connections.Input.main[0][0]).toEqual({ node: 'fetch_trends', type: 'main', index: 0 });
    expect(definition.connections.fetch_trends.main[0][0]).toEqual({ node: 'fetch_trends_2', type: 'main', index: 0 });
  });

  it('imports the sample flow connections back to canvas edges', () => {
    const flow = fromWorkflowDefinition(sampleFlow);

    expect(flow.nodes).toHaveLength(7);
    expect(flow.edges).toHaveLength(7);
    expect(flow.nodes[0].position).toEqual({ x: 120, y: -160 });
    expect(flow.edges.find((edge) => edge.source === '8f4e1c2a-1a2b-4c3d-9e0f-333333333333' && edge.sourceHandle === 'condition_1')).toBeTruthy();
    expect(flow.edges.find((edge) => edge.source === '8f4e1c2a-1a2b-4c3d-9e0f-333333333333' && edge.sourceHandle === 'condition_2')).toBeTruthy();
  });
});
