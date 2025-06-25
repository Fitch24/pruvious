import { isArray } from "../utils/array.js";
import { isNull, isUndefined } from "../utils/common.js";
import { isRealNumber } from "../utils/number.js";
export function requiredValidator(context, customErrorMessage) {
  if (isNull(context.value) || isUndefined(context.value) || isArray(context.value) && !context.value.length || typeof context.value === "boolean" && context.value !== true || typeof context.value === "number" && !isRealNumber(context.value) || typeof context.value === "string" && !context.value) {
    throw new Error(customErrorMessage ?? context.__(context.language, "pruvious-server", "This field is required"));
  }
}
