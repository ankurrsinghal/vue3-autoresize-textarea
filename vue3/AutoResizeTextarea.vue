<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

export default defineComponent({
  setup() {

    let node: Ref<Element | null> = ref(null);
    let proxyNode: Ref<Element | null> = ref(null);

    function setupProxyTextareaElement(textarea: HTMLTextAreaElement) {
      textarea.style.setProperty('visibility', 'hidden');
      textarea.style.setProperty('opacity', '0');
      textarea.style.setProperty('pointer-events', 'none');
      textarea.style.setProperty('z-index', '-1000');
    }

    onMounted(() => {
      setupProxyTextareaElement(proxyNode.value! as HTMLTextAreaElement);
    });


    function handleChange(e: Event) {
      const node = e.target as HTMLTextAreaElement;
      const proxyTextareaElement = proxyNode.value! as HTMLTextAreaElement;

      proxyTextareaElement.value = node.value;
      requestAnimationFrame(() => {
        const styles = getComputedStyle(node);
        const borderBottomWidth = parseFloat(styles.borderBottomWidth);
        const borderTopWidth = parseFloat(styles.borderTopWidth);
        node.style.setProperty('height', (proxyTextareaElement.scrollHeight + borderBottomWidth + borderTopWidth) + 'px');
      });
    }

    return {
      node,
      proxyNode,
      handleChange
    }
  },
});
</script>

<template>
  <textarea ref="node" @input="handleChange" />
  <textarea ref="proxyNode" />
</template>