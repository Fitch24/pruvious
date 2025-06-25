import {
  prefixPrimaryLanguage,
  primaryLanguage,
  supportedLanguages
} from "#pruvious";
import { collections } from "#pruvious/collections";
import { isString, joinRouteParts, resolveCollectionPathPrefix } from "../../utils/string.js";
export async function resolvePagePath(path, collectionName, language) {
  const collection = collections[collectionName];
  const resolvedLanguage = resolveLanguage(language);
  const languagePrefix = resolvedLanguage === primaryLanguage && !prefixPrimaryLanguage ? "" : resolvedLanguage;
  const collectionPrefix = resolveCollectionPathPrefix(collection, resolvedLanguage, primaryLanguage);
  return joinRouteParts(languagePrefix, collectionPrefix, path);
}
export function resolveLanguage(input) {
  return isString(input) && supportedLanguages.includes(input) ? input : primaryLanguage;
}
