import { isString as _isString } from "@antfu/utils";
import {
  camelCase as _camelCase,
  kebabCase as _kebabCase,
  pascalCase as _pascalCase,
  snakeCase as _snakeCase
} from "scule";
import { cleanDoubleSlashes, joinURL, withoutTrailingSlash } from "ufo";
import { isNull, isUndefined } from "./common.js";
import { isNumber } from "./number.js";
import { isObject } from "./object.js";
export function camelCase(value) {
  return _camelCase(value);
}
export function capitalize(value, lowercaseRest = true) {
  return (value[0]?.toUpperCase() ?? "") + (lowercaseRest ? value.slice(1)?.toLowerCase() ?? "" : value.slice(1));
}
export function extractKeywords(value) {
  return value.toLowerCase().split(" ").map((keyword) => keyword.trim()).filter(Boolean);
}
export function isAlphanumeric(character) {
  const code = character.charCodeAt(0);
  return code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122 || // a-z
  code >= 48 && code <= 57;
}
export function isPascalCase(value) {
  return isString(value) && /^(?:[A-Z][a-z0-9]*)+$/.test(value);
}
export function isSafeSlug(value) {
  return isString(value) && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
}
export function isSlug(value) {
  return isString(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
export const isString = _isString;
export function isUrl(value) {
  try {
    return new URL(value).href.replace(/\/$/, "") === value.replace(/\/$/, "");
  } catch {
    return false;
  }
}
export function isUrlPath(value, allowRelative = false) {
  try {
    const url = new URL(value, "http://__pruvious");
    return !value.includes("//") && (url.pathname === value || allowRelative && url.pathname.slice(1) === value);
  } catch {
    return false;
  }
}
export function joinRouteParts(...parts) {
  const parsedParts = parts.filter(Boolean).map((part) => part.replaceAll("\\", "/"));
  if (parsedParts[0]?.includes(":")) {
    parsedParts[0] = parsedParts[0].replace(/^[a-z]:[\\\/]/i, "");
  }
  return withoutTrailingSlash(cleanDoubleSlashes(joinURL("/", ...parsedParts)));
}
export function kebabCase(value) {
  return _kebabCase(value);
}
export function pascalCase(value) {
  return _pascalCase(value);
}
export function resolveCollectionPathPrefix(collection, language, primaryLanguage) {
  const pp = collection.publicPages;
  return isString(pp.pathPrefix) ? pp.pathPrefix : isObject(pp.pathPrefix) ? pp.pathPrefix[language] ?? pp.pathPrefix[primaryLanguage] ?? "" : "";
}
export function setTranslationPrefix(path, language, supportedLanguages) {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] && supportedLanguages.includes(parts[0])) {
    parts.shift();
  }
  return joinRouteParts(language, ...parts);
}
export function getTranslationPrefix(path, supportedLanguages) {
  const parts = path.split("/").filter(Boolean);
  if (supportedLanguages.includes(parts[0])) {
    return parts[0];
  }
  return null;
}
export function removeAccents(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("\xDF", "ss");
}
export function snakeCase(value) {
  return _snakeCase(value);
}
export function titleCase(value, capitalizeAll = true) {
  if (!isString(value)) {
    return "";
  }
  return kebabCase(value).split("-").map((word) => word.trim()).filter(Boolean).map((word, i) => i === 0 || capitalizeAll ? capitalize(word) : word).join(" ");
}
export function stringify(value) {
  return isString(value) ? value : isNumber(value) ? value.toString() : isNull(value) || isUndefined(value) ? "" : JSON.stringify(value);
}
export function uncapitalize(value) {
  return (value[0]?.toLowerCase() ?? "") + (value.slice(1) ?? "");
}
