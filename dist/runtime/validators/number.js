import { isNull } from "../utils/common.js";
import { isInteger, isPositiveInteger, isRealNumber } from "../utils/number.js";
export function numberValidator(context, customErrorMessage) {
  if (!isRealNumber(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function numberOrNullValidator(context, customErrorMessage) {
  if (!isRealNumber(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function integerValidator(context, customErrorMessage) {
  if (!isInteger(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function integerOrNullValidator(context, customErrorMessage) {
  if (!isInteger(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function positiveIntegerValidator(context, customErrorMessage) {
  if (!isPositiveInteger(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
export function positiveIntegerOrNullValidator(context, customErrorMessage) {
  if (!isPositiveInteger(context.value) && !isNull(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "Invalid input type")
      );
    } else {
      throw new Error(customErrorMessage ?? "Invalid input type");
    }
  }
}
