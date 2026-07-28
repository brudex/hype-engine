<template>
  <aside class="fb-panel fb-library">
    <div class="fb-panel-header">
      <div>
        <h2 class="fb-panel-title">Node Library</h2>
        <small class="fb-muted">Add a building block</small>
      </div>
    </div>
    <div class="fb-library-search">
      <label for="node-library-search">Search nodes</label>
      <input
        id="node-library-search"
        v-model="query"
        class="fb-input"
        type="search"
        placeholder="Search nodes"
        autocomplete="off"
      />
    </div>
    <div class="fb-library-list">
      <button
        v-for="type in filteredTypes"
        :key="type"
        class="fb-library-item"
        type="button"
        draggable="true"
        @dragstart="onDragStart($event, type)"
      >
        <span>{{ NODE_TYPES[type].icon }}</span>
        <strong>{{ NODE_TYPES[type].label }}</strong>
        <small>{{ NODE_TYPES[type].description }}</small>
      </button>
      <p v-if="!filteredTypes.length" class="fb-library-empty">No nodes match your search.</p>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useConfigStore } from '../stores/config.store';
import { NODE_TYPES } from '../utils/nodeDefaults';

const config = useConfigStore();
const query = ref('');
const enabledTypes = computed(() => config.enabledNodes.filter((type) => NODE_TYPES[type]));
const filteredTypes = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) return enabledTypes.value;

  return enabledTypes.value.filter((type) => {
    const meta = NODE_TYPES[type];
    return [type, meta.label, meta.description, meta.icon].some((value) => String(value).toLowerCase().includes(term));
  });
});

function onDragStart(event, type) {
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/x-flow-node', type);
}
</script>

<style scoped>
.fb-library {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--fb-border);
}

.fb-library-search {
  display: grid;
  gap: 7px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--fb-border);
}

.fb-library-search label {
  color: var(--fb-muted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.fb-library-list {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 14px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: var(--fb-accent) #111115;
}

.fb-library-list::-webkit-scrollbar {
  width: 10px;
}

.fb-library-list::-webkit-scrollbar-track {
  background: #111115;
}

.fb-library-list::-webkit-scrollbar-thumb {
  border: 2px solid #111115;
  border-radius: 999px;
  background: var(--fb-border);
}

.fb-library-list::-webkit-scrollbar-thumb:hover {
  background: var(--fb-accent);
}

.fb-library-item {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 4px 10px;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  text-align: left;
  background: #151519;
  cursor: grab;
  user-select: none;
}

.fb-library-item:hover {
  border-color: var(--fb-accent);
}

.fb-library-item:active {
  cursor: grabbing;
}

.fb-library-item span {
  grid-row: span 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 40px;
  height: 40px;
  border-radius: var(--fb-radius);
  color: var(--fb-accent);
  background: var(--fb-bg);
  font-size: 9px;
  font-weight: 800;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.fb-library-item strong {
  font-size: 13px;
}

.fb-library-item small {
  color: var(--fb-muted);
  font-size: 12px;
  line-height: 1.35;
}

.fb-library-empty {
  margin: 0;
  padding: 16px 4px;
  color: var(--fb-muted);
  font-size: 13px;
}
</style>
