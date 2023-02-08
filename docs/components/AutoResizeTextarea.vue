<script setup>
import { onMounted, ref } from "vue";
import AutoResizeTextarea from "vue3-autoresize-textarea";

let node = ref(null);
</script>

<template>
  <AutoResizeTextarea v-bind="value" ref="node" title="HELLLO" />
</template>

<style>
textarea {
  border: 2px solid black;
  padding: 10px;
}
</style>
