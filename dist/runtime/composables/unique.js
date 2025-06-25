import { useState } from "#imports";
import { isUndefined } from "../utils/common.js";
const usePruviousUnique = () => useState("pruvious-unique", () => ({}));
export function pruviousUnique(prefix) {
  const records = usePruviousUnique();
  if (isUndefined(records.value[prefix])) {
    records.value[prefix] = 0;
  }
  const uniqueString = records.value[prefix] ? `${prefix}-${records.value[prefix]}` : prefix;
  records.value[prefix]++;
  return uniqueString;
}
