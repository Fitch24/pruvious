import { useState } from "#imports";
import { toArray } from "../utils/array.js";
import { pruviousFetch } from "../utils/fetch.js";
import { isKeyOf } from "../utils/object.js";
import { replacePlaceholders } from "../utils/translatable-strings.js";
import { getLanguage, useLanguage } from "./language.js";
export const useTranslatableStrings = () => useState("pruvious-translatable-strings", () => ({}));
export function __(domain, text, input) {
  const ts = useTranslatableStrings();
  const language = useLanguage().value ?? "";
  const cacheKey = text + (input ? `|${JSON.stringify(input)}` : "");
  if (ts.value[domain]?.[language]?.strings && ts.value[domain]?.[language].strings !== "pending" && !isKeyOf(ts.value[domain][language].cache, cacheKey)) {
    ts.value[domain][language].cache[cacheKey] = replacePlaceholders(
      text,
      ts.value[domain]?.[language].strings,
      input
    );
  }
  return ts.value[domain]?.[language]?.cache[cacheKey] || text;
}
export function _(text, input) {
  return __("default", text, input);
}
export async function loadTranslatableStrings(domain, language) {
  const ts = useTranslatableStrings();
  const promises = [];
  domain ||= "default";
  language ||= getLanguage();
  for (const d of toArray(domain)) {
    if (!ts.value[d]?.[language]) {
      ts.value[d] ||= {};
      ts.value[d][language] = { strings: "pending", cache: {} };
      promises.push(
        pruviousFetch("translatable-strings.get", { subpath: d, query: { language } }).then((response) => {
          ts.value[d][language].strings = response.success ? response.data : {};
        })
      );
    }
  }
  await Promise.all(promises);
}
