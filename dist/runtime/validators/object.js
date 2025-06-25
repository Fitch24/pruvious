import { isNull } from "../utils/common.js";
import { isObject } from "../utils/object.js";
export function objectValidator(context, customErrorMessage) {
  if (!isObject(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function objectOrNullValidator(context, customErrorMessage) {
  if (!isObject(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
