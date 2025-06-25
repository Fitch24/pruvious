import { isArray } from "../utils/array.js";
import { isNull } from "../utils/common.js";
export function arrayValidator(context, customErrorMessage) {
  if (!isArray(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function arrayOrNullValidator(context, customErrorMessage) {
  if (!isArray(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
