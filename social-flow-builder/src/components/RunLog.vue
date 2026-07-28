<template>
  <section class="fb-run-log" :style="{ height: `${panelHeight}px` }">
    <button
      class="fb-log-resize"
      type="button"
      title="Resize logs"
      @mousedown.prevent="startResize"
    />

    <aside class="fb-log-sidebar">
      <div class="fb-log-sidebar-header">
        <strong>Logs</strong>
        <button type="button" :disabled="!run.log.length" @click="run.clear">Clear execution</button>
      </div>
      <p class="fb-log-status">{{ run.statusLabel || statusLabel }}</p>

      <div class="fb-log-list">
        <button
          v-for="entry in entries"
          :key="entry.key"
          class="fb-log-entry"
          :class="[`is-${entry.status}`, { 'is-active': entry.key === selectedKey }]"
          type="button"
          @click="selectEntry(entry.key)"
        >
          <span class="fb-log-entry-icon">{{ iconFor(entry.status) }}</span>
          <span>
            <strong>{{ entry.nodeId }}</strong>
            <small>{{ entry.status }} in {{ entry.durationMs }}ms</small>
          </span>
          <span v-if="entry.status === 'error'" class="fb-log-entry-alert">!</span>
        </button>

        <p v-if="!entries.length" class="fb-log-empty">Run the flow to inspect per-node traces.</p>
      </div>
    </aside>

    <section class="fb-log-detail">
      <header class="fb-log-detail-header">
        <div>
          <strong>{{ selectedEntry?.nodeId || 'Execution output' }}</strong>
          <span v-if="selectedEntry">
            {{ selectedEntry.status }} in {{ selectedEntry.durationMs }}ms
          </span>
        </div>
        <div class="fb-log-detail-actions">
          <button
            type="button"
            :class="{ 'is-active': activeTab === 'input' }"
            @click="activeTab = 'input'"
          >
            Input
          </button>
          <button
            type="button"
            :class="{ 'is-active': activeTab === 'output' }"
            @click="activeTab = 'output'"
          >
            Output
          </button>
        </div>
      </header>

      <div class="fb-log-detail-body">
        <template v-if="selectedEntry">
          <p v-if="selectedEntry.errorMessage && activeTab === 'output'" class="fb-log-error">
            {{ selectedEntry.errorMessage }}
          </p>

          <div class="fb-log-section-title">{{ activeTab }}</div>

          <table v-if="tableRows.length" class="fb-log-table">
            <thead>
              <tr>
                <th v-for="column in tableColumns" :key="column">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableRows" :key="index">
                <td v-for="column in tableColumns" :key="column">{{ formatCell(row[column]) }}</td>
              </tr>
            </tbody>
          </table>

          <pre v-else class="fb-log-json">{{ formattedData }}</pre>
        </template>

        <div v-else class="fb-log-placeholder">
          <strong>No execution data yet</strong>
          <span>Run the workflow or execute a step to see input and output here.</span>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRunStore } from '../stores/run.store';

const run = useRunStore();
const panelHeight = ref(260);
const selectedKey = ref(null);
const activeTab = ref('output');
let resizeState = null;

const entries = computed(() =>
  run.log.map((entry, index) => ({
    ...entry,
    key: `${entry.at}-${entry.nodeId}-${index}`,
  })),
);

const selectedEntry = computed(() => entries.value.find((entry) => entry.key === selectedKey.value) || entries.value[0] || null);
const selectedData = computed(() => {
  if (!selectedEntry.value) return null;
  if (activeTab.value === 'input') {
    return selectedEntry.value.inputContext || selectedEntry.value.input || null;
  }
  return selectedEntry.value.output ?? selectedEntry.value.error ?? null;
});
const tableSource = computed(() => normalizeTableSource(selectedData.value));
const tableColumns = computed(() => {
  const columns = new Set();
  tableSource.value.forEach((row) => Object.keys(row).forEach((key) => columns.add(key)));
  return [...columns];
});
const tableRows = computed(() => (tableColumns.value.length ? tableSource.value : []));
const formattedData = computed(() => {
  if (selectedData.value === null || typeof selectedData.value === 'undefined') {
    return activeTab.value === 'input' ? 'No input data captured.' : 'No output data captured.';
  }
  return JSON.stringify(selectedData.value, null, 2);
});
const statusLabel = computed(() => {
  if (!run.log.length) return 'No execution yet';
  const latestError = run.log.find((entry) => entry.status === 'error');
  if (latestError) return `Error in ${latestError.durationMs}ms`;
  return `${run.status} · ${run.log.length} item${run.log.length === 1 ? '' : 's'}`;
});

watch(
  entries,
  (nextEntries) => {
    if (!nextEntries.length) {
      selectedKey.value = null;
      return;
    }
    if (!nextEntries.some((entry) => entry.key === selectedKey.value)) {
      selectedKey.value = nextEntries[0].key;
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  stopResize();
});

function selectEntry(key) {
  selectedKey.value = key;
}

function startResize(event) {
  resizeState = {
    y: event.clientY,
    height: panelHeight.value,
  };
  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
}

function onResize(event) {
  if (!resizeState) return;
  const nextHeight = resizeState.height + resizeState.y - event.clientY;
  const maxHeight = Math.max(320, Math.round(window.innerHeight * 0.72));
  panelHeight.value = Math.min(maxHeight, Math.max(170, nextHeight));
}

function stopResize() {
  resizeState = null;
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
}

function normalizeTableSource(value) {
  const payload = unwrapContextOutput(value);
  if (Array.isArray(payload) && payload.every(isPlainObject)) return payload;
  if (isPlainObject(payload) && Object.values(payload).every((item) => !isPlainObject(item) && !Array.isArray(item))) {
    return [payload];
  }
  return [];
}

function unwrapContextOutput(value) {
  if (isPlainObject(value) && 'output' in value && Object.keys(value).some((key) => ['status', 'meta', 'error'].includes(key))) {
    return value.output;
  }
  return value;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function formatCell(value) {
  if (value === null || typeof value === 'undefined') return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function iconFor(status) {
  return {
    success: '✓',
    error: '!',
    skipped: '-',
    running: '...',
  }[status] || 'i';
}
</script>

<style>
.fb-run-log {
  position: relative;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  min-height: 170px;
  max-height: 72vh;
  border-top: 1px solid var(--fb-border);
  color: var(--fb-text);
  background: #2b2b2d;
}

.fb-log-resize {
  position: absolute;
  top: -5px;
  left: 0;
  z-index: 4;
  width: 100%;
  height: 10px;
  border: 0;
  background: transparent;
  cursor: ns-resize;
}

.fb-log-resize::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--fb-border);
}

.fb-log-sidebar {
  min-width: 0;
  border-right: 1px solid var(--fb-border);
  background: #28282a;
  overflow: hidden;
}

.fb-log-sidebar-header,
.fb-log-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid var(--fb-border);
}

.fb-log-sidebar-header strong,
.fb-log-detail-header strong {
  font-size: 14px;
}

.fb-log-sidebar-header button,
.fb-log-detail-actions button {
  border: 1px solid transparent;
  border-radius: var(--fb-radius);
  color: var(--fb-muted);
  background: transparent;
  cursor: pointer;
  font-size: 12px;
}

.fb-log-sidebar-header button {
  padding: 6px 8px;
}

.fb-log-sidebar-header button:hover:not(:disabled),
.fb-log-detail-actions button:hover {
  color: var(--fb-text);
  background: rgba(255, 255, 255, 0.06);
}

.fb-log-sidebar-header button:disabled {
  cursor: default;
  opacity: 0.45;
}

.fb-log-status {
  margin: 0;
  padding: 12px 16px 6px;
  color: var(--fb-muted);
  font-size: 13px;
}

.fb-log-list {
  display: grid;
  gap: 6px;
  max-height: calc(100% - 88px);
  padding: 0 10px 12px;
  overflow: auto;
}

.fb-log-entry {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 8px;
  min-height: 46px;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.fb-log-entry.is-active {
  background: rgba(255, 255, 255, 0.14);
}

.fb-log-entry.is-error {
  color: #ff777f;
}

.fb-log-entry:hover {
  background: rgba(255, 255, 255, 0.08);
}

.fb-log-entry-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  color: #0b0b0d;
  background: var(--fb-accent);
  font-size: 12px;
  font-weight: 900;
}

.fb-log-entry.is-error .fb-log-entry-icon,
.fb-log-entry-alert {
  color: #0b0b0d;
  background: #ff777f;
}

.fb-log-entry span:nth-child(2) {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.fb-log-entry strong,
.fb-log-entry small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fb-log-entry small {
  color: var(--fb-muted);
  font-size: 11px;
}

.fb-log-entry-alert {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.fb-log-empty {
  margin: 20px 8px;
  color: var(--fb-muted);
  font-size: 13px;
}

.fb-log-detail {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
}

.fb-log-detail-header > div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.fb-log-detail-header span {
  color: var(--fb-muted);
  font-size: 13px;
}

.fb-log-detail-actions {
  display: flex;
  gap: 6px;
}

.fb-log-detail-actions button {
  min-width: 66px;
  min-height: 30px;
  border-color: var(--fb-border);
  color: var(--fb-text);
}

.fb-log-detail-actions button.is-active {
  border-color: #ffbbb8;
  background: rgba(255, 119, 127, 0.28);
}

.fb-log-detail-body {
  min-height: 0;
  padding: 14px;
  overflow: auto;
}

.fb-log-section-title {
  margin-bottom: 12px;
  color: var(--fb-muted);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.fb-log-error {
  margin: 0 0 12px;
  padding: 14px;
  border: 1px solid rgba(255, 119, 127, 0.32);
  border-radius: var(--fb-radius);
  color: #ff777f;
  background: rgba(255, 119, 127, 0.08);
  font-weight: 700;
}

.fb-log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.fb-log-table th,
.fb-log-table td {
  max-width: 360px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  text-align: left;
  vertical-align: top;
}

.fb-log-table th {
  color: var(--fb-text);
  background: rgba(255, 255, 255, 0.06);
  font-weight: 800;
}

.fb-log-table td {
  color: var(--fb-muted);
}

.fb-log-json {
  min-height: 100%;
  margin: 0;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--fb-radius);
  color: #b9b2ff;
  background: #242426;
  font-size: 12px;
  line-height: 1.55;
  overflow: auto;
  white-space: pre-wrap;
}

.fb-log-placeholder {
  display: grid;
  place-content: center;
  gap: 8px;
  height: 100%;
  color: var(--fb-muted);
  text-align: center;
}

.fb-log-placeholder strong {
  color: var(--fb-text);
}
</style>
