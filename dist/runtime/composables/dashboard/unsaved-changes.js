import { useState } from "#imports";
export const useUnsavedChanges = () => useState("pruvious-unsaved-changes", () => null);
export function watchUnsavedChanges(history) {
  useUnsavedChanges().value = history;
}
