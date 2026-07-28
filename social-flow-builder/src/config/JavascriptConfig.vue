<template>
  <form>
    <div class="fb-field">
      <label>Code</label>
      <textarea v-model="config.code" class="fb-textarea fb-code" />
    </div>
    <div class="fb-field">
      <label>Timeout</label>
      <input v-model.number="config.timeout" class="fb-input" type="number" min="1000" max="30000" />
    </div>
    <div class="fb-field">
      <label>Memory Limit MB</label>
      <input v-model.number="config.memoryLimit" class="fb-input" type="number" min="16" max="256" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ node: { type: Object, required: true } });
const config = computed(() => props.node.config);
</script>

<style scoped>
.fb-code {
  min-height: 220px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}
</style>
