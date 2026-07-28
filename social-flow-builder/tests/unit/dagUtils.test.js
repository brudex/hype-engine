import { describe, expect, it } from 'vitest';
import { hasCycle, topologicalSort } from '../../src/utils/dagUtils';

describe('dagUtils', () => {
  const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('sorts a directed acyclic graph', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];

    expect(topologicalSort(nodes, edges).map((node) => node.id)).toEqual(['a', 'b', 'c']);
  });

  it('detects cycles', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'a' },
    ];

    expect(hasCycle(nodes, edges)).toBe(true);
  });
});
