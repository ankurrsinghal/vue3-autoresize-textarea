<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import ProxyTextareaElement from "./ProxyTextareaElement";

function getSizingData(styles: CSSStyleDeclaration) {
  const boxSizing = styles.getPropertyValue("box-sizing");
  const paddingSize =
    Number.parseFloat(styles.getPropertyValue("padding-bottom")) +
    Number.parseFloat(styles.getPropertyValue("padding-top"));
  const borderSize =
    Number.parseFloat(styles.getPropertyValue("border-bottom-width")) +
    Number.parseFloat(styles.getPropertyValue("border-top-width"));

  return { boxSizing, paddingSize, borderSize };
}

export default defineComponent({
  name: "AutoResizeTextarea",
  setup(props, { expose }) {
    let node: Ref<Element | null> = ref(null);

    function handleChange(e: Event) {
      const node = e.target as HTMLTextAreaElement;

      const sourceStyles = getComputedStyle(node);

      ProxyTextareaElement.setupFromSourceStyles(sourceStyles);
      ProxyTextareaElement.updateText(node.value);

      const { boxSizing, paddingSize, borderSize } =
        getSizingData(sourceStyles);

      let finalHeight = ProxyTextareaElement.getScrollHeight();

      if (boxSizing === "border-box") {
        finalHeight += borderSize;
      } else if (boxSizing === "content-box") {
        finalHeight -= paddingSize;
      }

      node.style.setProperty("height", finalHeight + "px");
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
