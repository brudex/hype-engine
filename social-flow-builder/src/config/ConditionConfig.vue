<template>
  <form class="fb-condition-config">
    <section class="fb-condition-list">
      <article v-for="(condition, index) in config.conditions" :key="condition.id" class="fb-condition-row">
        <div class="fb-condition-row-header">
          <strong>Condition {{ index + 1 }}</strong>
          <button
            class="fb-remove-condition"
            type="button"
            title="Remove condition"
            :disabled="config.conditions.length === 1"
            @click="removeCondition(index)"
          >
            -
          </button>
        </div>

        <div class="fb-field">
          <label>Value 1</label>
          <input v-model="condition.left" class="fb-input" placeholder="{{write_caption.meta.tokensUsed}}" />
        </div>

        <div class="fb-condition-grid">
          <div class="fb-field">
            <label>Type</label>
            <select v-model="condition.dataType" class="fb-select" @change="syncOperation(condition)">
              <option v-for="type in dataTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
          </div>

          <div class="fb-field">
            <label>Operation</label>
            <select v-model="condition.operation" class="fb-select">
              <option v-for="operation in operationsFor(condition.dataType)" :key="operation.value" :value="operation.value">
                {{ operation.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="requiresRightValue(condition.operation)" class="fb-field">
          <label>Value 2</label>
          <input v-model="condition.right" class="fb-input" placeholder="300" />
        </div>
      </article>
    </section>

    <button class="fb-add-condition" type="button" @click="addCondition">Add condition</button>
  </form>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useFlowStore } from '../stores/flow.store';

const props = defineProps({ node: { type: Object, required: true } });
const flow = useFlowStore();
const config = computed(() => props.node.config);

const dataTypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
];

const operations = {
  string: [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
  number: [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
    { value: 'greater_than', label: 'is greater than' },
    { value: 'greater_equal', label: 'is greater than or equal' },
    { value: 'less_than', label: 'is less than' },
    { value: 'less_equal', label: 'is less than or equal' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
  boolean: [
    { value: 'is_true', label: 'is true' },
    { value: 'is_false', label: 'is false' },
    { value: 'equals', label: 'equals' },
  ],
  array: [
    { value: 'contains', label: 'contains' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
  object: [
    { value: 'has_key', label: 'has key' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
};

const unaryOperations = new Set(['is_empty', 'is_not_empty', 'is_true', 'is_false']);

watch(
  config,
  (nextConfig) => {
    if (!Array.isArray(nextConfig.conditions) || !nextConfig.conditions.length) {
      nextConfig.conditions = [createCondition(1)];
    }
  },
  { immediate: true },
);

function operationsFor(dataType) {
  return operations[dataType] || operations.string;
}

function syncOperation(condition) {
  const allowed = operationsFor(condition.dataType);
  if (!allowed.some((operation) => operation.value === condition.operation)) {
    condition.operation = allowed[0].value;
  }
}

function requiresRightValue(operation) {
  return !unaryOperations.has(operation);
}

function addCondition() {
  config.value.conditions.push(createCondition(config.value.conditions.length + 1));
}

function removeCondition(index) {
  if (config.value.conditions.length === 1) return;
  flow.removeSourceHandleEdges(props.node.id, config.value.conditions[index].id);
  config.value.conditions.splice(index, 1);
}

function createCondition(index) {
  return {
    id: `condition_${Date.now()}_${index}`,
    dataType: 'string',
    operation: 'equals',
    left: '',
    right: '',
  };
}
</script>

<style scoped>
.fb-condition-config {
  display: grid;
  gap: 14px;
}

.fb-add-condition,
.fb-remove-condition {
  min-height: 36px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  background: #151519;
  cursor: pointer;
}

.fb-add-condition {
  border-color: var(--fb-accent);
  color: var(--fb-bg);
  background: var(--fb-accent);
  font-weight: 800;
}

.fb-condition-list {
  display: grid;
  gap: 12px;
}

.fb-condition-row {
  padding: 12px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  background: #151519;
}

.fb-condition-row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.fb-condition-row-header strong {
  font-size: 13px;
}

.fb-remove-condition {
  width: 32px;
  min-height: 32px;
  padding: 0;
  color: var(--fb-danger);
}

.fb-remove-condition:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.fb-condition-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 10px;
}
</style>
