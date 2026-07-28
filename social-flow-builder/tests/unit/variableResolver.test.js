import { describe, expect, it } from 'vitest';
import { resolveVariables } from '../../src/composables/useVariableResolver';

describe('resolveVariables', () => {
  it('resolves dot and bracket paths safely', () => {
    const context = {
      fetch_trends: {
        output: {
          topics: [{ name: 'Summer Drops' }],
        },
      },
    };

    expect(resolveVariables('Topic: {{fetch_trends.output.topics[0].name}}', context)).toBe('Topic: Summer Drops');
  });

  it('returns an empty string for missing values', () => {
    expect(resolveVariables('Value: {{missing.output}}', {})).toBe('Value: ');
  });
});
