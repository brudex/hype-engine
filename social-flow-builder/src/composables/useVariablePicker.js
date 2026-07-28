import { computed } from 'vue';
import { NODE_TYPES } from '../utils/nodeDefaults';

export function useVariablePicker(nodes) {
  const suggestions = computed(() =>
    nodes.value.flatMap((node) => {
      const outputs = Object.keys(NODE_TYPES[node.type]?.outputs || { success: {} });
      const nodeKey = node.name || node.id;
      return outputs.map((output) => ({
        nodeId: nodeKey,
        output,
        token: `{{${nodeKey}.output}}`,
      }));
    }),
  );

  function insertToken(text, token) {
    return `${text || ''}${token}`;
  }

  return { suggestions, insertToken };
}
