<template>
  <aside class="fb-flow-list">
    <div class="fb-panel-header">
      <div>
        <h2 class="fb-panel-title">Flows</h2>
        <small class="fb-muted">Standalone development</small>
      </div>
      <button class="fb-btn fb-icon-btn" type="button" title="Create flow">+</button>
    </div>
    <button v-for="item in mockFlows" :key="item.id" class="fb-flow-item" type="button">
      <strong>{{ item.name }}</strong>
      <span>{{ item.status }} · {{ new Date(item.updatedAt).toLocaleDateString() }}</span>
    </button>
  </aside>
</template>

<script setup>
import { mockFlows } from './mockData';
</script>

<style scoped>
.fb-flow-list {
  border-right: 1px solid var(--fb-border);
  background: var(--fb-surface);
}

.fb-flow-item {
  display: grid;
  gap: 6px;
  width: calc(100% - 20px);
  margin: 10px;
  padding: 12px;
  border: 1px solid var(--fb-border);
  border-radius: var(--fb-radius);
  color: var(--fb-text);
  text-align: left;
  background: #151519;
}

.fb-flow-item span {
  color: var(--fb-muted);
  font-size: 12px;
}
</style>
