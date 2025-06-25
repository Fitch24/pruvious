import { isUndefined } from "../utils/common.js";
export function presentValidator(context, customErrorMessage) {
  if (isUndefined(context.value)) {
    if (context.__ && context.language) {
      throw new Error(
        context.__(context.language, "pruvious-server", customErrorMessage ?? "This field must be present")
      );
    } else {
      throw new Error(customErrorMessage ?? "This field must be present");
    }
  }
}
