<template>
  <section class="fb-inspector">
    <div class="fb-panel-header">
      <div>
        <h2 class="fb-panel-title">FlowContext</h2>
        <small class="fb-muted">Latest outputs from completed nodes</small>
      </div>
    </div>
    <pre>{{ JSON.stringify(run.context, null, 2) }}</pre>
  </section>
</template>

<script setup>
import { useRunStore } from '../stores/run.store';

const run = useRunStore();
</script>

<style scoped>
.fb-inspector pre {
  margin: 0;
  padding: 14px;
  overflow: auto;
  color: var(--fb-cta);
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>
