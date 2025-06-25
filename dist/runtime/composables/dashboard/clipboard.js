import { useState } from "#imports";
import { useEventListener } from "@vueuse/core";
import { __ } from "../translatable-strings.js";
import { pruviousToasterShow } from "./toaster.js";
export const usePruviousClipboard = () => useState("pruvious-clipboard", () => null);
export async function copyToClipboard(type, payload) {
  await navigator.clipboard.writeText(JSON.stringify({ pruviousClipboardType: type, payload })).then(() => pruviousToasterShow({ message: __("pruvious-dashboard", "Copied") })).catch((error) => pruviousToasterShow({ message: error.toString(), type: "error" }));
  await checkClipboard();
}
useEventListener("copy", checkClipboard);
useEventListener("focus", checkClipboard);
useEventListener("pruvious-copy", checkClipboard);
async function checkClipboard() {
  try {
    const value = JSON.parse(await navigator.clipboard.readText());
    if (value.pruviousClipboardType) {
      usePruviousClipboard().value = value;
      return;
    }
  } catch {
  }
  usePruviousClipboard().value = null;
}
