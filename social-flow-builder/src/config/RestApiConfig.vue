<template>
  <form>
    <div class="fb-field">
      <label>Method</label>
      <select v-model="config.method" class="fb-select">
        <option v-for="method in methods" :key="method">{{ method }}</option>
      </select>
    </div>
    <div class="fb-field">
      <label>URL</label>
      <input v-model="config.url" class="fb-input" />
    </div>
    <div class="fb-field">
      <label>Headers</label>
      <textarea v-model="config.headers" class="fb-textarea" placeholder='{"Authorization":"Bearer ..."}' />
    </div>
    <div class="fb-field">
      <label>Body</label>
      <textarea v-model="config.body" class="fb-textarea" />
    </div>
    <div class="fb-field">
      <label>Auth</label>
      <select v-model="config.auth" class="fb-select">
        <option value="none">None</option>
        <option value="bearer">Bearer Token</option>
        <option value="api_key">API Key</option>
        <option value="basic">Basic Auth</option>
      </select>
    </div>
    <div class="fb-field">
      <label>Timeout</label>
      <input v-model.number="config.timeout" class="fb-input" type="number" min="1000" />
    </div>
    <div class="fb-field">
      <label>Retry</label>
      <input v-model.number="config.retry" class="fb-input" type="number" min="0" max="5" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ node: { type: Object, required: true } });
const config = computed(() => props.node.config);
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
</script>
