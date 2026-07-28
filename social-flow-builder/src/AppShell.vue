<template>
  <main class="fb-shell" :style="themeVars">
    <FlowToolbar />
    <section class="fb-workspace">
      <FlowCanvas />
      <div class="fb-canvas-launchers">
        <button class="fb-launcher-btn" type="button" title="Add node" @click="openLibrary">+</button>
      </div>
      <button
        v-if="!propertiesOpen"
        class="fb-properties-tab"
        type="button"
        @click="openProperties"
      >
        Properties
      </button>

      <div v-if="libraryOpen" class="fb-drawer fb-library-drawer">
        <NodeLibrary />
        <button class="fb-drawer-close" type="button" title="Close node library" @click="libraryOpen = false">×</button>
      </div>

      <div v-if="propertiesOpen" class="fb-drawer fb-properties-drawer">
        <ConfigPanel />
        <button class="fb-drawer-close" type="button" title="Hide properties" @click="propertiesOpen = false">×</button>
      </div>
    </section>
    <RunLog />
    <NodeExecutionView v-if="flowStore.inspectedNode" />
    <ToastViewport />
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import FlowToolbar from './components/FlowToolbar.vue';
import NodeLibrary from './components/NodeLibrary.vue';
import FlowCanvas from './components/FlowCanvas.vue';
import ConfigPanel from './components/ConfigPanel.vue';
import RunLog from './components/RunLog.vue';
import NodeExecutionView from './components/NodeExecutionView.vue';
import ToastViewport from './components/ToastViewport.vue';
import { useConfigStore } from './stores/config.store';
import { useFlowStore } from './stores/flow.store';
import { useApiBridge } from './composables/useApiBridge';
import { useToastStore } from './stores/toast.store';

const configStore = useConfigStore();
const flowStore = useFlowStore();
const api = useApiBridge();
const toasts = useToastStore();
const libraryOpen = ref(false);
const propertiesOpen = ref(false);

onMounted(() => {
  loadSavedFlow();
});

function openLibrary() {
  propertiesOpen.value = false;
  libraryOpen.value = true;
}

function openProperties() {
  libraryOpen.value = false;
  propertiesOpen.value = true;
}

const themeVars = computed(() => {
  const theme = configStore.theme || {};
  return {
    '--fb-accent': theme.accent,
    '--fb-font': theme.font,
    '--fb-radius': theme.radius,
  };
});

async function loadSavedFlow() {
  configStore.init();
  if (!configStore.flowId) return;

  try {
    const response = await api.loadFlow(configStore.flowId);
    const workflow = response.data?.data || response.data;
    flowStore.loadFromWorkflow(workflow);
  } catch (error) {
    if (error.response?.status === 404) return;
    toasts.show({
      type: 'error',
      title: 'Could not load flow',
      message: error.response?.data?.message || error.message || 'The saved canvas could not be loaded.',
    });
  }
}
</script>

<style scoped>
.fb-workspace {
  position: relative;
}

.fb-canvas-launchers {
  position: absolute;
  right: 28px;
  top: 46px;
  z-index: 10;
  display: grid;
  gap: 14px;
}

.fb-launcher-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  background: #151519;
  cursor: pointer;
  font-size: 34px;
  font-weight: 600;
  line-height: 1;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
}

.fb-launcher-btn:hover {
  border-color: var(--fb-accent);
  color: var(--fb-accent);
}

.fb-properties-tab {
  position: absolute;
  right: 0;
  top: 50%;
  z-index: 10;
  min-width: 40px;
  min-height: 132px;
  border: 1px solid var(--fb-border);
  border-right: 0;
  border-radius: var(--fb-radius) 0 0 var(--fb-radius);
  color: var(--fb-accent);
  background: #151519;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
}

.fb-properties-tab:hover {
  color: var(--fb-bg);
  background: var(--fb-accent);
}

.fb-drawer {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 12;
  min-height: 0;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.38);
}

.fb-library-drawer {
  right: 0;
  width: 300px;
}

.fb-properties-drawer {
  right: 0;
  width: 380px;
}

.fb-drawer :deep(.fb-panel) {
  height: 100%;
}

.fb-drawer-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-muted);
  background: #111115;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.fb-drawer-close:hover {
  border-color: var(--fb-accent);
  color: var(--fb-accent);
}
</style>
