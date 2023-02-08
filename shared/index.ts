type Undefineable<T> = T | undefined;

type SetupType = {
  styles: CSSStyleDeclaration;
  minRows: Undefineable<number | string>;
  maxRows: Undefineable<number | string>;
}

type ProxyTextareaElementType = {
  updateText: (text: string) => void;
  getComputedHeight: () => number;
  setup: (options: SetupType) => void;
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

let _proxyTextareaElement: HTMLTextAreaElement | undefined = undefined;
let _minRows: number = 0;
let _maxRows: number = 0;
let _sourceStyles: Undefineable<CSSStyleDeclaration> = undefined;

function parseNumber(value: number | string | undefined) {
  if (value) {
    if (typeof value === "string") {
      const parsedValue = Number.parseInt(value, 10);
      if (!Number.isNaN(value)) {
        return parsedValue;
      }
    }

    if (typeof value === "number") return value;
  }

  return 0;
}

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

function isBorderBox(boxSizing: string) {
  return boxSizing === "border-box";
}

function isContentBox(boxSizing: string) {
  return boxSizing === "content-box";
}

const ProxyTextareaElement: ProxyTextareaElementType = {
  setup({ styles, maxRows, minRows }) {
    _sourceStyles = styles;
    _maxRows = parseNumber(maxRows);
    _minRows = parseNumber(minRows);

    // setup proxy textarea element
    // if not present
    if (_proxyTextareaElement === undefined) {
      _proxyTextareaElement = document.createElement("textarea");
      const contextStyle = CONTEXT_STYLE.map(
        (name) => `${name}:${styles.getPropertyValue(name)}`
      ).join(";");
  
      _proxyTextareaElement.setAttribute(
        "style",
        `${contextStyle};${PROXY_TEXTAREA_ELEMENT_HIDDEN_STYLE}`
      );
      if (
        _proxyTextareaElement.parentNode === null ||
        _proxyTextareaElement.parentNode !== document.body
      ) {
        document.body.appendChild(_proxyTextareaElement);
      }
    }
  },
  updateText(text: string) {
    _proxyTextareaElement!.value = text;
  },
  getComputedHeight() {
    const { boxSizing, paddingSize, borderSize } = getSizingData(_sourceStyles!);
    let finalHeight = _proxyTextareaElement!.scrollHeight;

    if (isBorderBox(boxSizing)) {
      finalHeight += borderSize;
    } else if (isContentBox(boxSizing)) {
      finalHeight -= paddingSize;
    }

    if (_maxRows !== 0 || _minRows !== 0) {
      _proxyTextareaElement!.value = "";
      const singleRowHeight = _proxyTextareaElement!.scrollHeight - paddingSize;
      if (_minRows !== 0) {
        let minHeight = singleRowHeight * _minRows;
        if (isBorderBox(boxSizing)) {
          minHeight += paddingSize + borderSize;
        }

        finalHeight = Math.max(finalHeight, minHeight);
      }

      if (_maxRows !== 0) {
        let maxHeight = singleRowHeight * _maxRows;
        if (isBorderBox(boxSizing)) {
          maxHeight += paddingSize + borderSize;
        }

        finalHeight = Math.min(finalHeight, maxHeight);
      }
    }

    return finalHeight;
  },
};

export default ProxyTextareaElement;
