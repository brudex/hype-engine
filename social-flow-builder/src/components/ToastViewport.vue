<template>
  <div class="fb-toast-viewport" aria-live="polite" aria-atomic="false">
    <article
      v-for="toast in toasts.items"
      :key="toast.id"
      class="fb-toast"
      :class="`is-${toast.type}`"
    >
      <span class="fb-toast-icon" aria-hidden="true">{{ iconFor(toast.type) }}</span>
      <div class="fb-toast-copy">
        <strong>{{ toast.title }}</strong>
        <p v-if="toast.message">{{ toast.message }}</p>
      </div>
      <button type="button" title="Dismiss" @click="toasts.dismiss(toast.id)">×</button>
    </article>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast.store';

const toasts = useToastStore();

function iconFor(type) {
  return {
    success: '✓',
    error: '!',
    info: 'i',
  }[type] || 'i';
}
</script>

<style scoped>
.fb-toast-viewport {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 50;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.fb-toast {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 28px;
  align-items: start;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  background: rgba(21, 21, 25, 0.96);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.36);
  pointer-events: auto;
}

.fb-toast.is-success {
  border-color: rgba(178, 255, 0, 0.52);
}

.fb-toast.is-error {
  border-color: rgba(255, 93, 93, 0.7);
}

.fb-toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--fb-radius);
  color: var(--fb-bg);
  background: var(--fb-cta);
  font-size: 18px;
  font-weight: 900;
}

.fb-toast.is-error .fb-toast-icon {
  background: var(--fb-danger);
}

.fb-toast-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.fb-toast-copy strong {
  font-size: 13px;
  line-height: 1.25;
}

.fb-toast-copy p {
  margin: 0;
  color: var(--fb-muted);
  font-size: 12px;
  line-height: 1.35;
  white-space: pre-line;
}

.fb-toast button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--fb-radius);
  color: var(--fb-muted);
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.fb-toast button:hover {
  color: var(--fb-text);
  background: rgba(255, 255, 255, 0.06);
}
</style>
