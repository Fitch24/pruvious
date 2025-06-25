"use strict";
import { cleanDoubleSlashes, joinURL, withoutTrailingSlash } from "ufo";
export function sortArgs(args) {
  return Object.fromEntries(Object.entries(args).sort(([a], [b]) => a.localeCompare(b)));
}
export function isHostname(value) {
  try {
    return new URL(`http://${value}`).hostname === value;
  } catch {
    return false;
  }
}
export function isSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
export function slugify(string) {
  return string.normalize().trim().replace(/\s+/g, "-").toLowerCase();
}
export function joinRouteParts(...parts) {
  const parsedParts = parts.filter(Boolean).map((part) => part.replaceAll("\\", "/"));
  if (parsedParts[0]?.includes(":")) {
    parsedParts[0] = parsedParts[0].replace(/^[a-z]:[\\\/]/i, "");
  }
  return withoutTrailingSlash(cleanDoubleSlashes(joinURL("/", ...parsedParts)));
}
export function convertBytesToM(bytes) {
  const megabytes = Math.ceil(bytes / (1024 * 1024));
  return `${megabytes}M`;
}
