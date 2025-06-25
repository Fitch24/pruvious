import { isUndefined } from "../utils/common.js";
export function defaultSanitizer(context) {
  return isUndefined(context.value) ? context.definition.default(context) : context.value;
}
