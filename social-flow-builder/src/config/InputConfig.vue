<template>
  <form>
    <div class="fb-field">
      <label>Input Type</label>
      <select v-model="config.format" class="fb-select">
        <option value="json">JSON</option>
        <option value="text">Text</option>
      </select>
    </div>
    <div class="fb-field">
      <label>Value</label>
      <textarea v-model="config.value" class="fb-textarea fb-input-value" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ node: { type: Object, required: true } });
const config = computed(() => props.node.config);
</script>

<style scoped>
.fb-input-value {
  min-height: 220px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}
</style>
