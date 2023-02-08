<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUpdated,
  Ref,
  ref,
  toRefs,
  computed,
} from "vue";
import ProxyTextareaElement from "shared";

export default defineComponent({
  name: "AutoResizeTextarea",
  props: {
    modelValue: String,
    minRows: Number,
    maxRows: Number,
  },
  setup(props, { expose, emit }) {
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

    expose({ node });

    const value = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });

    return {
      value,
      node,
    };
  },
});
</script>

<template>
  <textarea ref="node" v-model="value" />
</template>
