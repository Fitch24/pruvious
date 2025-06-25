import { useState } from "#imports";
import DOMPurify from "dompurify";
export const usePruviousToaster = () => useState("pruvious-toaster", () => null);
export function pruviousToasterShow(item) {
  usePruviousToaster().value = {
    message: DOMPurify.sanitize(item.message).replace(/\*\*([^*]*(?:\*(?!\*)[^*]*)*)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\!\!([^!]*(?:\!(?!\!)[^!]*)*)\!\!/g, '<strong class="text-white">$1</strong>'),
    type: item.type || "info",
    afterRouteChange: item.afterRouteChange ?? false
  };
}
