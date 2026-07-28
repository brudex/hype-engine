<template>
  <div class="fb-standalone">
    <FlowBuilderApp />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import FlowBuilderApp from '../FlowBuilderApp.vue';
import { mockAccounts } from './mockData';
import { useConfigStore } from '../stores/config.store';
import { useAccountsStore } from '../stores/accounts.store';

const config = useConfigStore();
const accounts = useAccountsStore();

onMounted(() => {
  config.init({
    mode: 'standalone',
    apiBaseUrl: '/api/flow-builder',
    enabledNodes: ['input', 'http_request', 'http_response', 'rest_api', 'prompt', 'javascript', 'post', 'condition'],
  });
  accounts.setAccounts(mockAccounts);
});
</script>

<style scoped>
.fb-standalone {
  min-height: 100vh;
  background: var(--fb-bg);
}
</style>
