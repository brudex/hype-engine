<template><BaseNode :id="id" /></template>
<script setup>
import BaseNode from './BaseNode.vue';
defineProps({ id: { type: String, required: true } });
</script>
