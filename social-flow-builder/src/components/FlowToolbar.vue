<template>
  <header class="fb-toolbar">
    <div class="fb-title-block">
      <input v-model="flow.name" class="fb-flow-name" aria-label="Flow name" />
      <span>{{ config.mode }} · {{ flow.nodes.length }} nodes · {{ flow.edges.length }} edges</span>
    </div>
    <div class="fb-toolbar-actions">
      <button class="fb-btn" type="button" title="Test run" @click="execute('test')">Test</button>
      <button class="fb-btn fb-btn-primary" type="button" title="Live run" @click="execute('live')">Run</button>
      <button class="fb-btn fb-btn-cta" type="button" title="Save flow" :disabled="isSaving" @click="save">
        {{ isSaving ? 'Saving' : 'Save' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { useFlowStore } from '../stores/flow.store';
import { useConfigStore } from '../stores/config.store';
import { useRunStore } from '../stores/run.store';
import { useApiBridge } from '../composables/useApiBridge';
import { useFlowExecutor } from '../composables/useFlowExecutor';
import { useToastStore } from '../stores/toast.store';
import { ref } from 'vue';

const flow = useFlowStore();
const config = useConfigStore();
const run = useRunStore();
const toasts = useToastStore();
const { execute } = useFlowExecutor();
const api = useApiBridge();
const isSaving = ref(false);

function saveErrorMessage(error) {
  const data = error.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.join('\n');
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === 'string' && data.error.trim()) {
    return data.error;
  }

  return error.message || 'Save failed';
}

async function save() {
  if (isSaving.value) return;
  const startedAt = performance.now();
  isSaving.value = true;

  try {
    const payload = flow.flowPayload;
    const response = await api.saveFlow(payload);

    run.addLog({
      nodeId: 'flow',
      status: 'success',
      durationMs: Math.round(performance.now() - startedAt),
      output: {
        saved: true,
        endpoint: `/flows/save/${config.flowId}`,
        response: response.data,
      },
    });
    toasts.show({
      type: 'success',
      title: 'Flow saved',
      message: 'Your latest canvas changes were saved successfully.',
    });
  } catch (error) {
    const message = saveErrorMessage(error);
    run.addLog({
      nodeId: 'flow',
      status: 'error',
      durationMs: Math.round(performance.now() - startedAt),
      errorMessage: message,
      output: error.response?.data || null,
    });
    toasts.show({
      type: 'error',
      title: 'Save failed',
      message,
      duration: 8000,
    });
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
.fb-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 68px;
  padding: 12px 16px;
  background: var(--fb-bg);
}

.fb-title-block {
  display: grid;
  gap: 5px;
}

.fb-title-block span {
  color: var(--fb-muted);
  font-size: 12px;
}

.fb-flow-name {
  width: min(420px, 52vw);
  border: 0;
  color: var(--fb-text);
  background: transparent;
  font-size: 18px;
  font-weight: 800;
  outline: none;
}

.fb-toolbar-actions {
  display: flex;
  gap: 8px;
}
</style>
