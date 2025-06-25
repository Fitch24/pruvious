import { isString } from "../utils/string.js";
export function booleanishSanitizer(context) {
  const v = isString(context.value) ? context.value.toLowerCase() : context.value;
  const t = [true, 1, "1", "true", "t", "yes", "y"];
  const f = [false, 0, "0", "false", "f", "no", "n"];
  return t.includes(v) ? true : f.includes(v) ? false : context.value;
}
