<template>
  <form>
    <div class="fb-field">
      <label>Method</label>
      <select v-model="config.method" class="fb-select">
        <option v-for="method in methods" :key="method">{{ method }}</option>
      </select>
    </div>
    <div class="fb-field">
      <label>Endpoint</label>
      <div class="fb-copy-label">{{ endpoint }}</div>
    </div>
    <div class="fb-field">
      <label>Response Format</label>
      <select v-model="config.responseFormat" class="fb-select">
        <option value="json">JSON</option>
        <option value="text">Text</option>
      </select>
    </div>
    <div class="fb-field">
      <label>Timeout</label>
      <input v-model.number="config.timeout" class="fb-input" type="number" min="1000" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';
import { useConfigStore } from '../stores/config.store';

const props = defineProps({ node: { type: Object, required: true } });
const appConfig = useConfigStore();
const config = computed(() => props.node.config);
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const endpoint = computed(() => {
  const baseUrl = (appConfig.apiBaseUrl || '').replace(/\/$/, '');
  return `${baseUrl}/webhooks/${appConfig.flowId || ':workflowUuid'}`;
});
</script>

<style scoped>
.fb-copy-label {
  min-height: 38px;
  padding: 9px 10px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-accent);
  background: #111115;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
  user-select: text;
  cursor: text;
}
</style>
