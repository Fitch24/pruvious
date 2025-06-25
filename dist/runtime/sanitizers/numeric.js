import { isRealNumber } from "../utils/number.js";
import { isString } from "../utils/string.js";
export function numericSanitizer(context) {
  const casted = isString(context.value) ? +context.value : null;
  return isRealNumber(casted) ? casted : context.value;
}
