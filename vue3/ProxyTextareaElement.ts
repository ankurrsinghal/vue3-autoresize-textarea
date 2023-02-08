type ProxyTextareaElementType = {
  updateText: (text: string) => void;
  getScrollHeight: () => number;
  setupFromSourceStyles: (styles: CSSStyleDeclaration) => void;
};

const PROXY_TEXTAREA_ELEMENT_HIDDEN_STYLE = `
  height: 0 !important;
  visibility: hidden !important;
  overflow: hidden !important;
  position: absolute !important;
  z-index: -1000 !important;
  top: 0 !important;
  right: 0 !important;
  pointer-events: none !important;
  opacity: 0 !important;
`;

const CONTEXT_STYLE = [
  "letter-spacing",
  "line-height",
  "padding-top",
  "padding-bottom",
  "font-family",
  "font-weight",
  "font-size",
  "text-rendering",
  "text-transform",
  "width",
  "text-indent",
  "padding-left",
  "padding-right",
  "border-width",
  "box-sizing",
];

let proxyTextareaElement: HTMLTextAreaElement | undefined = undefined;

const ProxyTextareaElement: ProxyTextareaElementType = {
  setupFromSourceStyles(styles: CSSStyleDeclaration) {
    // setup proxy textarea element
    // if not present
    if (proxyTextareaElement === undefined) {
      proxyTextareaElement = document.createElement("textarea");
      if (
        proxyTextareaElement.parentNode === null ||
        proxyTextareaElement.parentNode !== document.body
      ) {
        document.body.appendChild(proxyTextareaElement);
      }
    }

    const contextStyle = CONTEXT_STYLE.map(
      (name) => `${name}:${styles.getPropertyValue(name)}`
    ).join(";");

    proxyTextareaElement.setAttribute(
      "style",
      `${contextStyle};${PROXY_TEXTAREA_ELEMENT_HIDDEN_STYLE}`
    );
  },
  updateText(text: string) {
    proxyTextareaElement!.value = text;
  },
  getScrollHeight() {
    return proxyTextareaElement!.scrollHeight;
  },
};

export default ProxyTextareaElement;
