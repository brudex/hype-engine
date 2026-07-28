<template>
  <div
    class="fb-node"
    :class="[
      `is-${node?.status || 'idle'}`,
      `type-${node?.type}`,
      { 'is-selected': isSelected, 'is-disabled': node?.disabled },
    ]"
    @dblclick.stop="flow.inspectNode(id)"
  >
    <Handle type="target" :position="Position.Left" />
    <div ref="menuRef" class="fb-node-menu-wrap">
      <button class="fb-node-menu-trigger" type="button" title="Node actions" @click.stop="menuOpen = !menuOpen">
        ⋮
      </button>
      <div v-if="menuOpen" class="fb-node-menu" @click.stop>
        <button type="button" @click="deleteNode"><span>⌫</span>Delete</button>
        <button type="button" @click="toggleDisabled"><span>{{ node?.disabled ? '⏻' : '⊘' }}</span>{{ node?.disabled ? 'Enable' : 'Disable' }}</button>
        <button type="button" @click="duplicateNode"><span>⧉</span>Duplicate</button>
        <button type="button" @click="executeStep"><span>▶</span>Execute step</button>
      </div>
    </div>
    <div class="fb-node-top">
      <span class="fb-node-icon">{{ meta.icon }}</span>
      <div>
        <strong>{{ node?.label || meta.label }}</strong>
        <small>{{ node?.name || id }}</small>
      </div>
    </div>
    <template v-if="isConditionNode">
      <div class="fb-condition-outputs">
        <div v-for="(condition, index) in conditionOutputs" :key="condition.id" class="fb-condition-output">
          <span>Condition {{ index + 1 }}</span>
          <Handle
            :id="condition.id"
            type="source"
            :position="Position.Right"
            class="fb-condition-handle"
          />
        </div>
      </div>
    </template>
    <Handle v-else id="success" type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import { useFlowStore } from '../stores/flow.store';
import { useRunStore } from '../stores/run.store';
import { NODE_TYPES } from '../utils/nodeDefaults';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const flow = useFlowStore();
const run = useRunStore();
const menuOpen = ref(false);
const menuRef = ref(null);
const node = computed(() => flow.nodes.find((item) => item.id === props.id));
const meta = computed(() => NODE_TYPES[node.value?.type] || NODE_TYPES.prompt);
const isSelected = computed(() => node.value?.selected || flow.selectedNodeId === props.id);
const isConditionNode = computed(() => node.value?.type === 'condition');
const conditionOutputs = computed(() => {
  if (!isConditionNode.value) return [];
  const conditions = node.value?.config?.conditions;
  return Array.isArray(conditions) && conditions.length ? conditions : [{ id: 'condition_1' }];
});

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});

function onDocumentClick(event) {
  if (!menuOpen.value) return;
  if (menuRef.value?.contains(event.target)) return;
  closeMenu();
}

function closeMenu() {
  menuOpen.value = false;
}

function deleteNode() {
  if (!node.value) return;
  flow.deleteNode(node.value.id);
  closeMenu();
}

function toggleDisabled() {
  flow.toggleNodeDisabled(props.id);
  closeMenu();
}

function duplicateNode() {
  flow.duplicateNode(props.id);
  closeMenu();
}

function executeStep() {
  flow.setNodeStatus(props.id, 'success');
  run.addLog({
    nodeId: node.value?.name || props.id,
    status: 'success',
    durationMs: 0,
    output: { executedStep: true },
  });
  closeMenu();
}
</script>

<style scoped>
.fb-node {
  position: relative;
  width: 220px;
  padding: 12px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  background: linear-gradient(180deg, #1f1f23 0%, #121216 100%);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.26);
}

.fb-node-menu-wrap {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 4;
}

.fb-node-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: var(--fb-radius);
  color: var(--fb-muted);
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.fb-node-menu-trigger:hover {
  border-color: var(--fb-border);
  color: var(--fb-accent);
  background: #111115;
}

.fb-node-menu {
  position: absolute;
  top: 32px;
  right: 0;
  display: grid;
  min-width: 150px;
  padding: 5px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  background: #151519;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.48);
}

.fb-node-menu button {
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  color: var(--fb-text);
  text-align: left;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.fb-node-menu button:hover {
  color: var(--fb-bg);
  background: var(--fb-accent);
}

.fb-node-menu span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--fb-muted);
  font-size: 13px;
}

.fb-node-menu button:hover span {
  color: var(--fb-bg);
}

.fb-node-top {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 10px;
}

.fb-node-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-accent);
  background: #0b0b0d;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

strong,
small {
  display: block;
}

strong {
  font-size: 14px;
}

small {
  margin-top: 3px;
  color: var(--fb-muted);
  font-size: 11px;
}

.fb-condition-outputs {
  display: grid;
  gap: 7px;
  margin-top: 10px;
}

.fb-condition-output {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 28px;
  padding: 0 20px 0 10px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-muted);
  background: rgba(11, 11, 13, 0.72);
  font-size: 11px;
  font-weight: 700;
}

.fb-condition-output:hover {
  border-color: var(--fb-accent);
  color: var(--fb-accent);
}

.fb-condition-handle {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.fb-node.is-running {
  border-color: var(--fb-cta);
  box-shadow: 0 0 18px rgba(198, 255, 0, 0.24);
}

.fb-node.is-success {
  border-color: var(--fb-accent);
  box-shadow: 0 0 18px rgba(0, 239, 255, 0.2);
}

.fb-node.is-error {
  border-color: var(--fb-danger);
}

.fb-node.is-disabled {
  opacity: 0.55;
  border-style: dashed;
}

.fb-node.type-input .fb-node-icon {
  border-color: var(--fb-accent);
}

.fb-node.is-selected {
  border-color: var(--fb-cta);
  box-shadow:
    0 0 0 2px rgba(198, 255, 0, 0.32),
    0 0 26px rgba(0, 239, 255, 0.34),
    0 14px 36px rgba(0, 0, 0, 0.34);
}

.fb-node.is-selected .fb-node-icon {
  border-color: var(--fb-cta);
  color: var(--fb-bg);
  background: var(--fb-cta);
}

.vue-flow__handle {
  width: 10px;
  height: 10px;
  border-color: var(--fb-bg);
  background: var(--fb-accent);
}
</style>
