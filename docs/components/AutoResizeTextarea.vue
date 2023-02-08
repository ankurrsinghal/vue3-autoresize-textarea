<script setup>
import { onMounted, ref } from "vue";
import AutoResizeTextarea from "vue3-autoresize-textarea";

let node = ref(null);
</script>

<template>
  <AutoResizeTextarea maxRows="10" minRows="3" />
</template>

<style>
textarea {
  border: 2px solid black;
  padding: 10px;
}
</style>
