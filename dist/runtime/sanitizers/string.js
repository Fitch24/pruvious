import { isRealNumber } from "../utils/number.js";
export function stringSanitizer(context) {
  return isRealNumber(context.value) ? context.value.toString() : context.value;
}
