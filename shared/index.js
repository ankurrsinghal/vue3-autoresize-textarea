var PROXY_TEXTAREA_ELEMENT_HIDDEN_STYLE = "\n  height: 0 !important;\n  visibility: hidden !important;\n  overflow: hidden !important;\n  position: absolute !important;\n  z-index: -1000 !important;\n  top: 0 !important;\n  right: 0 !important;\n  pointer-events: none !important;\n  opacity: 0 !important;\n";
var CONTEXT_STYLE = [
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
var _proxyTextareaElement = undefined;
var _minRows = 0;
var _maxRows = 0;
var _sourceStyles = undefined;
function parseNumber(value) {
    if (value) {
        if (typeof value === "string") {
            var parsedValue = Number.parseInt(value, 10);
            if (!Number.isNaN(value)) {
                return parsedValue;
            }
        }
        if (typeof value === "number")
            return value;
    }
    return 0;
}
function getSizingData(styles) {
    var boxSizing = styles.getPropertyValue("box-sizing");
    var paddingSize = Number.parseFloat(styles.getPropertyValue("padding-bottom")) +
        Number.parseFloat(styles.getPropertyValue("padding-top"));
    var borderSize = Number.parseFloat(styles.getPropertyValue("border-bottom-width")) +
        Number.parseFloat(styles.getPropertyValue("border-top-width"));
    return { boxSizing: boxSizing, paddingSize: paddingSize, borderSize: borderSize };
}
function isBorderBox(boxSizing) {
    return boxSizing === "border-box";
}
function isContentBox(boxSizing) {
    return boxSizing === "content-box";
}
var ProxyTextareaElement = {
    setup: function (_a) {
        var styles = _a.styles, maxRows = _a.maxRows, minRows = _a.minRows;
        _sourceStyles = styles;
        _maxRows = parseNumber(maxRows);
        _minRows = parseNumber(minRows);
        // setup proxy textarea element
        // if not present
        if (_proxyTextareaElement === undefined) {
            _proxyTextareaElement = document.createElement("textarea");
            var contextStyle = CONTEXT_STYLE.map(function (name) { return "".concat(name, ":").concat(styles.getPropertyValue(name)); }).join(";");
            _proxyTextareaElement.setAttribute("style", "".concat(contextStyle, ";").concat(PROXY_TEXTAREA_ELEMENT_HIDDEN_STYLE));
            if (_proxyTextareaElement.parentNode === null ||
                _proxyTextareaElement.parentNode !== document.body) {
                document.body.appendChild(_proxyTextareaElement);
            }
        }
    },
    updateText: function (text) {
        _proxyTextareaElement.value = text;
    },
    getComputedHeight: function () {
        var _a = getSizingData(_sourceStyles), boxSizing = _a.boxSizing, paddingSize = _a.paddingSize, borderSize = _a.borderSize;
        var finalHeight = _proxyTextareaElement.scrollHeight;
        if (isBorderBox(boxSizing)) {
            finalHeight += borderSize;
        }
        else if (isContentBox(boxSizing)) {
            finalHeight -= paddingSize;
        }
        if (_maxRows !== 0 || _minRows !== 0) {
            _proxyTextareaElement.value = "";
            var singleRowHeight = _proxyTextareaElement.scrollHeight - paddingSize;
            if (_minRows !== 0) {
                var minHeight = singleRowHeight * _minRows;
                if (isBorderBox(boxSizing)) {
                    minHeight += paddingSize + borderSize;
                }
                finalHeight = Math.max(finalHeight, minHeight);
            }
            if (_maxRows !== 0) {
                var maxHeight = singleRowHeight * _maxRows;
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
