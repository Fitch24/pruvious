import { isBoolean, isNull } from "../utils/common.js";
export function booleanValidator(context, customErrorMessage) {
  if (!isBoolean(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function booleanOrNullValidator(context, customErrorMessage) {
  if (!isBoolean(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
