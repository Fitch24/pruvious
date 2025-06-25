import { isArray, uniqueArray } from "../utils/array.js";
export function uniqueArraySanitizer(context) {
  return isArray(context.value) ? uniqueArray(context.value) : context.value;
}
