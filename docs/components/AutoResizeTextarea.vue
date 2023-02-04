<script setup>
import { onMounted } from "vue";
import AutoResizeTextarea from 'vue3-autoresize-textarea';

onMounted(() => {
    console.log("onMounted");
});
</script>

<template>
<AutoResizeTextarea />
</template>

<style>
textarea {
    border: 1px solid black;
}
</style>