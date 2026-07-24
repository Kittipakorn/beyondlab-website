export function getTextareaCaretPosition(
  textarea: HTMLTextAreaElement,
  position: number,
) {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  const properties = [
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing",
    "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "boxSizing", "tabSize",
  ] as const;

  mirror.style.position = "fixed";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.style.width = `${textarea.clientWidth}px`;
  properties.forEach((property) => {
    mirror.style[property] = style[property];
  });

  mirror.textContent = textarea.value.slice(0, position);
  const marker = document.createElement("span");
  marker.textContent = textarea.value.slice(position, position + 1) || "\u200b";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const mirrorRect = mirror.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const result = {
    left: markerRect.left - mirrorRect.left - textarea.scrollLeft,
    top: markerRect.top - mirrorRect.top - textarea.scrollTop,
    lineHeight: Number.parseFloat(style.lineHeight) || 24,
  };
  mirror.remove();
  return result;
}
