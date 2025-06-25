import { isFunction } from "./function.js";
export function blurActiveElement() {
  const el = document.activeElement;
  if (el && isFunction(el.blur)) {
    el.blur();
  }
}
export function isEditingText() {
  let el = document.activeElement;
  while (el && el.tagName !== "BODY") {
    if (el.tagName === "INPUT" && el.getAttribute("type") !== "checkbox" || el.tagName === "TEXTAREA" || el.hasAttribute("contenteditable")) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}
export function isDropzone(target) {
  while (target.tagName !== "BODY") {
    if (target.hasAttribute("data-no-dropzone")) {
      return false;
    }
    target = target.parentElement;
  }
  return true;
}
