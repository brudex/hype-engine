<template>
  <section class="fb-execution-backdrop" @click.self="flow.closeNodeInspector">
    <div class="fb-execution-modal" role="dialog" aria-modal="true" :aria-label="`${node.label} execution details`">
      <header class="fb-execution-topbar">
        <button class="fb-back-btn" type="button" @click="flow.closeNodeInspector">← Back to canvas</button>
        <div>
          <strong>{{ node.label }}</strong>
          <span>{{ node.name || node.id }}</span>
        </div>
      </header>

      <div class="fb-execution-grid">
        <section class="fb-data-pane">
          <header>Input</header>
          <pre v-if="latestEntry?.inputContext">{{ formatJson(latestEntry.inputContext) }}</pre>
          <div v-else class="fb-empty-data">
            <strong>No input data yet</strong>
            <span>Run the flow to capture the JSON input passed into this node.</span>
          </div>
        </section>

        <section class="fb-node-pane">
          <div class="fb-node-pane-header">
            <span class="fb-node-pane-icon">{{ meta.icon }}</span>
            <div>
              <strong>{{ node.label }}</strong>
              <span>{{ meta.description }}</span>
            </div>
            <button class="fb-execute-step-btn" type="button" @click="executeStep">
              <span aria-hidden="true">⌬</span>
              Execute step
            </button>
          </div>
          <div class="fb-node-config">
            <div class="fb-field">
              <label>Node ID</label>
              <div class="fb-display-value">{{ node.id }}</div>
            </div>
            <div class="fb-field">
              <label>Node Name</label>
              <div class="fb-display-value">{{ node.name || node.id }}</div>
            </div>
            <component :is="configComponent" :node="node" />
          </div>
        </section>

        <section class="fb-data-pane">
          <header>Output</header>
          <pre v-if="latestEntry?.output !== undefined">{{ formatJson(latestEntry.output) }}</pre>
          <div v-else class="fb-empty-data">
            <strong>No output data yet</strong>
            <span>Execute this node or run the flow to view the latest output.</span>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useFlowStore } from '../stores/flow.store';
import { useRunStore } from '../stores/run.store';
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
const run = useRunStore();
const node = computed(() => flow.inspectedNode);
const meta = computed(() => NODE_TYPES[node.value?.type] || NODE_TYPES.prompt);
const latestEntry = computed(() => {
  const key = node.value?.name || node.value?.id;
  return run.log.find((entry) => entry.nodeId === key || entry.nodeId === node.value?.id);
});
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

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function executeStep() {
  if (!node.value) return;
  flow.setNodeStatus(node.value.id, 'success');
  run.addLog({
    nodeId: node.value.name || node.value.id,
    status: 'success',
    durationMs: 0,
    output: {
      executedStep: true,
      nodeId: node.value.id,
      nodeName: node.value.name || node.value.id,
    },
  });
}
</script>

<style scoped>
.fb-execution-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px;
  color: var(--fb-text);
  background: rgba(11, 11, 13, 0.76);
  backdrop-filter: blur(10px);
}

.fb-execution-modal {
  display: grid;
  grid-template-rows: 58px minmax(0, 1fr);
  width: min(1500px, 94vw);
  height: min(850px, 88vh);
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  overflow: hidden;
  background: #151519;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.58);
  font-size: 13px;
}

.fb-execution-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 18px;
  border-bottom: 1px solid var(--fb-border);
  background: rgba(31, 31, 35, 0.86);
}

.fb-back-btn {
  border: 0;
  color: var(--fb-text);
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
}

.fb-execution-topbar div {
  display: grid;
  gap: 3px;
  text-align: right;
}

.fb-execution-topbar span {
  color: var(--fb-muted);
  font-size: 12px;
}

.fb-execution-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px minmax(0, 1fr);
  min-height: 0;
  gap: 14px;
  padding: 12px;
}

.fb-data-pane,
.fb-node-pane {
  min-height: 0;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  background: #1f1f23;
  overflow: hidden;
}

.fb-data-pane {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.fb-data-pane header {
  padding: 14px 16px;
  color: var(--fb-muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.fb-data-pane pre {
  margin: 0;
  padding: 14px 16px;
  overflow: auto;
  color: var(--fb-cta);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre-wrap;
}

.fb-empty-data {
  display: grid;
  place-content: center;
  gap: 10px;
  padding: 20px;
  color: var(--fb-muted);
  text-align: center;
}

.fb-empty-data strong {
  color: var(--fb-text);
  font-size: 15px;
}

.fb-node-pane {
  align-self: start;
  max-height: calc(min(850px, 88vh) - 82px);
  overflow: auto;
  background: #2a2a2f;
}

.fb-node-pane-header {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid var(--fb-border);
}

.fb-node-pane-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--fb-radius);
  color: var(--fb-accent);
  background: var(--fb-bg);
  font-size: 10px;
  font-weight: 800;
}

.fb-node-pane-header strong,
.fb-node-pane-header span {
  display: block;
}

.fb-node-pane-header strong {
  font-size: 15px;
  line-height: 1.2;
}

.fb-node-pane-header span {
  margin-top: 3px;
  color: var(--fb-muted);
  font-size: 11px;
  line-height: 1.35;
}

.fb-execute-step-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid rgba(0, 239, 255, 0.72);
  border-radius: var(--fb-radius);
  color: var(--fb-accent);
  background: #111115;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: 0 0 0 rgba(0, 239, 255, 0);
  transition: border-color 0.16s ease, color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
}

.fb-execute-step-btn:hover {
  border-color: var(--fb-cta);
  color: var(--fb-cta);
  background: rgba(198, 255, 0, 0.08);
  box-shadow: 0 0 16px rgba(0, 239, 255, 0.18);
}

.fb-execute-step-btn span {
  margin: 0;
  color: inherit;
  font-size: 12px;
}

.fb-node-config {
  padding: 14px;
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
  font-size: 12px;
  font-weight: 700;
}

.fb-node-config :deep(.fb-field) {
  margin-bottom: 11px;
}

.fb-node-config :deep(.fb-field label) {
  font-size: 11px;
}

.fb-node-config :deep(.fb-input),
.fb-node-config :deep(.fb-select) {
  height: 34px;
  font-size: 12px;
}

.fb-node-config :deep(.fb-textarea) {
  min-height: 78px;
  font-size: 12px;
  line-height: 1.4;
}

@media (max-width: 1180px) {
  .fb-execution-grid {
    grid-template-columns: 1fr;
  }

  .fb-node-pane {
    order: -1;
    max-height: none;
  }
}
</style>
