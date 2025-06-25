import { useState } from "#imports";
export const useDragImageLabel = () => useState("pruvious-drag-image-label", () => "");
export const useIsMoving = () => useState("pruvious-is-moving", () => false);
export function startMoving(options) {
  useDragImageLabel().value = options.dragImageLabel;
  useIsMoving().value = true;
}
export function stopMoving() {
  useDragImageLabel().value = "";
  useIsMoving().value = false;
}
