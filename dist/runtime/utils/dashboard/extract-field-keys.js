import { isArray } from "../array.js";
import { isObject } from "../object.js";
import { isString } from "../string.js";
export function extractFieldKeys(fieldLayout) {
  const keys = [];
  for (const item of fieldLayout) {
    if (isString(item)) {
      keys.push(item.split("|")[0].trim());
    } else if (isArray(item)) {
      keys.push(...item.map((subitem) => subitem.split("|")[0].trim()));
    } else if (isObject(item)) {
      for (const fields of Object.values(item)) {
        keys.push(...extractFieldKeys(fields));
      }
    }
  }
  return keys;
}
