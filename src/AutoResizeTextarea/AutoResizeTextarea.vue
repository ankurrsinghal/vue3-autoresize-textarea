<script lang="ts">
import { defineComponent, onMounted, onUnmounted, Ref, ref } from "vue";

export default defineComponent({
  setup() {

    let node: Ref<Element | null> = ref(null);

    onMounted(() => {
      
    });


    function handleChange(e: Event) {
      const node = e.target as HTMLTextAreaElement;
      node.style.height = 'auto';
      node.style.height = node.scrollHeight + 'px';
    }

    return {
      node,
      handleChange
    }
  },
});
</script>

<template>
  <textarea ref="node" @input="handleChange" />
</template>