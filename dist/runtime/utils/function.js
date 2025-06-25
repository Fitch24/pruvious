import { isFunction as _isFunction } from "@antfu/utils";
export async function catchFirstErrorMessage(groups) {
  const results = {};
  for (const [name, callbacks] of Object.entries(groups)) {
    for (const callback of callbacks) {
      try {
        await callback();
      } catch (e) {
        results[name] = e.message;
        break;
      }
    }
  }
  return results;
}
export const isFunction = _isFunction;
export async function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
