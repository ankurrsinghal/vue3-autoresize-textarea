<script lang="ts">
import { defineComponent, onMounted, onUpdated, Ref, ref, toRefs } from "vue";
import ProxyTextareaElement from "shared";

export default defineComponent({
  name: "AutoResizeTextarea",
  props: {
    minRows: Number,
    maxRows: Number,
  },
  setup(props, { expose }) {
    let node: Ref<Element | null> = ref(null);

    function resizeTextarea() {
      if (node.value !== null) {
        const element = node.value as HTMLTextAreaElement;
        const sourceStyles = getComputedStyle(element);
        const { maxRows, minRows } = toRefs(props);
        ProxyTextareaElement.setup({
          styles: sourceStyles,
          maxRows: maxRows.value,
          minRows: minRows.value,
        });
        ProxyTextareaElement.updateText(element.value);

        element.style.setProperty(
          "height",
          ProxyTextareaElement.getComputedHeight() + "px"
        );
      }
    }

    onMounted(() => {
      resizeTextarea();
    });

    onUpdated(() => {
      resizeTextarea();
    });

    function handleChange() {
      resizeTextarea();
    }

    expose({ node });

    return {
      node,
      handleChange,
    };
  },
});
</script>

<template>
  <textarea ref="node" @input="handleChange" />
</template>
