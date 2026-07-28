<template>
  <form>
    <div class="fb-field">
      <label>Model</label>
      <select v-model="config.model" class="fb-select">
        <option value="claude-sonnet">Claude Sonnet</option>
        <option value="claude-haiku">Claude Haiku</option>
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-4o-mini">GPT-4o-mini</option>
        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
        <option value="gemini-flash">Gemini Flash</option>
        <option value="mixtral">Mixtral</option>
      </select>
    </div>
    <div class="fb-field">
      <label>System Prompt</label>
      <textarea v-model="config.systemPrompt" class="fb-textarea" />
    </div>
    <div class="fb-field">
      <label>User Prompt</label>
      <textarea v-model="config.userPrompt" class="fb-textarea" />
    </div>
    <div class="fb-field">
      <label>Temperature {{ config.temperature }}</label>
      <input v-model.number="config.temperature" type="range" min="0" max="1" step="0.1" />
    </div>
    <div class="fb-field">
      <label>Max Tokens</label>
      <input v-model.number="config.maxTokens" class="fb-input" type="number" />
    </div>
    <div class="fb-field">
      <label>Output Format</label>
      <select v-model="config.outputFormat" class="fb-select">
        <option value="text">Plain text</option>
        <option value="json">JSON</option>
        <option value="markdown">Markdown</option>
      </select>
    </div>
    <div class="fb-field">
      <label>Variants</label>
      <input v-model.number="config.variants" class="fb-input" type="number" min="1" max="5" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ node: { type: Object, required: true } });
const config = computed(() => props.node.config);
</script>
