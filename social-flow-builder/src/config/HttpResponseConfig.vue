<template>
  <form>
    <div class="fb-field">
      <label>Response Code</label>
      <input v-model="config.statusCode" class="fb-input" placeholder="{{format_output.output.statusCode}}" />
    </div>
    <div class="fb-field">
      <label>Response Body</label>
      <textarea
        v-model="config.body"
        class="fb-textarea"
        placeholder='{"message":"{{format_output.output.caption}}"}'
      />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ node: { type: Object, required: true } });
const config = computed(() => props.node.config);
</script>
