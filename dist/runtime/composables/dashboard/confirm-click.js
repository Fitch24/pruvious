import { useState } from "#imports";
import { pruviousUnique } from "../unique.js";
export const useClickConfirmation = () => useState("pruvious-click-confirmation", () => void 0);
export async function confirmClick(options) {
  const clickConfirmation = useClickConfirmation();
  const id = options.id ?? pruviousUnique("confirm");
  if (clickConfirmation.value?.id === id) {
    await clickConfirmation.value.success?.();
    clickConfirmation.value = void 0;
  } else {
    clickConfirmation.value = { ...options, id };
    options.target.addEventListener(
      "mouseleave",
      async () => {
        if (clickConfirmation.value?.id === id) {
          await clickConfirmation.value.fail?.();
          clickConfirmation.value = void 0;
        }
      },
      { once: true }
    );
  }
}
