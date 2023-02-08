<script setup>
import { onMounted, ref, watch } from "vue";
import AutoResizeTextarea from "vue3-autoresize-textarea";

let node = ref(null);
let value = ref('Hello');

</script>

<template>
  <AutoResizeTextarea v-model="value" />
</template>

<style>
textarea {
  border: 2px solid black;
  padding: 10px;
}
</style>
