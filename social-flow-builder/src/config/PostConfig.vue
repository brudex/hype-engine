<template>
  <form>
    <div class="fb-field">
      <label>Accounts</label>
      <select v-model="config.accounts" class="fb-select" multiple>
        <option v-for="account in accounts.accounts" :key="account.id" :value="account.id">
          {{ account.name }} · {{ account.platform }}
        </option>
      </select>
    </div>
    <div class="fb-field">
      <label>Caption / Text</label>
      <textarea v-model="config.caption" class="fb-textarea" />
    </div>
    <div class="fb-field">
      <label>Media</label>
      <input v-model="config.media" class="fb-input" />
    </div>
    <div class="fb-field">
      <label>Schedule</label>
      <select v-model="config.schedule" class="fb-select">
        <option value="now">Publish now</option>
        <option value="datetime">At specific datetime</option>
        <option value="optimal">Optimal time</option>
      </select>
    </div>
    <div class="fb-field">
      <label>First Comment</label>
      <textarea v-model="config.firstComment" class="fb-textarea" />
    </div>
    <div class="fb-field">
      <label>Failure Behavior</label>
      <select v-model="config.failureBehavior" class="fb-select">
        <option value="stop">Stop flow</option>
        <option value="skip">Skip platform</option>
        <option value="retry">Retry 3x</option>
        <option value="notify">Notify only</option>
      </select>
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';
import { useAccountsStore } from '../stores/accounts.store';

const props = defineProps({ node: { type: Object, required: true } });
const accounts = useAccountsStore();
const config = computed(() => props.node.config);
</script>
