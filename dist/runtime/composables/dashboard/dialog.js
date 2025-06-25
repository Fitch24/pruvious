import { useState } from "#imports";
import DOMPurify from "dompurify";
import { __ } from "../translatable-strings.js";
export const usePruviousDialog = () => useState("pruvious-dialog", () => null);
export async function pruviousDialog(message, labels) {
  const dialog = usePruviousDialog();
  dialog.value = {
    message: DOMPurify.sanitize(message).replace(/\*\*([^*]*(?:\*(?!\*)[^*]*)*)\*\*/g, '<strong class="text-primary-700">$1</strong>').replace(/\!\!([^!]*(?:\!(?!\!)[^!]*)*)\!\!/g, '<strong class="text-amber-600">$1</strong>'),
    resolveLabel: labels?.resolve ?? __("pruvious-dashboard", "Yes"),
    rejectLabel: labels?.reject ?? __("pruvious-dashboard", "No")
  };
  return new Promise((resolve) => {
    window.addEventListener("pruvious-dialog", (event) => resolve(event.detail), {
      once: true
    });
  });
}
