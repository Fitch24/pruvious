import { joinRouteParts } from "./string.js";
export const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/gif",
  "image/apng",
  "image/avif",
  "image/bmp",
  "image/heic",
  "image/tiff",
  "image/x-icon"
];
export function getPublicFilePath(upload, runtimeConfig) {
  return runtimeConfig.public.pruvious.uploadsBase + upload.directory + upload.filename;
}
export function parseMediaDirectoryName(value) {
  let directory = joinRouteParts(value).toLowerCase().slice(1) + "/";
  return directory === "/" ? "" : directory;
}
