import { isNull } from "../utils/common.js";
import { isString } from "../utils/string.js";
export function emailValidator(context, customErrorMessage) {
  if (!isString(context.value) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid email address")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid email address");
    }
  }
}
export function lowercaseValidator(context, customErrorMessage) {
  if (!isString(context.value) || context.value.toLowerCase() !== context.value) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(
          context.language,
          "pruvious-server",
          customErrorMessage ?? "The value must be a lowercase string"
        )
      );
    } else {
      throw new Error(
        customErrorMessage ?? context.__(context.language, "pruvious-server", "The value must be a lowercase string")
      );
    }
  }
}
export function stringValidator(context, customErrorMessage) {
  if (!isString(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function stringOrNullValidator(context, customErrorMessage) {
  if (!isString(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
