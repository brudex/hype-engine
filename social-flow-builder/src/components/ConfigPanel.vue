<template>
  <aside class="fb-panel fb-config">
    <div class="fb-panel-header">
      <div>
        <h2 class="fb-panel-title">Properties</h2>
        <small class="fb-muted">{{ node ? node.name || node.id : 'No node selected' }}</small>
      </div>
    </div>
    <section class="fb-config-body">
      <div v-if="node" class="fb-config-inner">
        <div class="fb-field">
          <label>Node ID</label>
          <div class="fb-display-value fb-id-label">{{ node.id }}</div>
        </div>
        <div class="fb-field">
          <label>Node Name</label>
          <input class="fb-input" :value="node.name || node.id" @change="flow.renameSelectedNode($event.target.value)" />
        </div>
        <div class="fb-field">
          <label>Node Type</label>
          <div class="fb-display-value">{{ nodeTypeLabel }}</div>
        </div>
        <component :is="configComponent" :node="node" />
      </div>
      <div v-else class="fb-empty">Select a node to edit its settings.</div>
    </section>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useFlowStore } from '../stores/flow.store';
import InputConfig from '../config/InputConfig.vue';
import HttpRequestConfig from '../config/HttpRequestConfig.vue';
import HttpResponseConfig from '../config/HttpResponseConfig.vue';
import RestApiConfig from '../config/RestApiConfig.vue';
import PromptConfig from '../config/PromptConfig.vue';
import JavascriptConfig from '../config/JavascriptConfig.vue';
import PostConfig from '../config/PostConfig.vue';
import ConditionConfig from '../config/ConditionConfig.vue';
import { NODE_TYPES } from '../utils/nodeDefaults';

const flow = useFlowStore();
const node = computed(() => flow.selectedNode);
const nodeTypeLabel = computed(() => NODE_TYPES[node.value?.type]?.label || node.value?.type || '');
const configComponent = computed(() => ({
  input: InputConfig,
  http_request: HttpRequestConfig,
  http_response: HttpResponseConfig,
  rest_api: RestApiConfig,
  prompt: PromptConfig,
  javascript: JavascriptConfig,
  post: PostConfig,
  condition: ConditionConfig,
}[node.value?.type] || PromptConfig));
</script>

<style scoped>
.fb-config {
  border-left: 1px solid var(--fb-border);
  overflow: auto;
}

.fb-config-body,
.fb-config-inner {
  padding: 14px;
}

.fb-empty {
  padding: 24px;
  color: var(--fb-muted);
}

.fb-display-value {
  display: flex;
  align-items: center;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-accent);
  background: #111115;
  font-weight: 700;
}

.fb-id-label {
  align-items: flex-start;
  min-height: auto;
  padding: 8px 10px;
  color: var(--fb-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
  user-select: text;
}

</style>
