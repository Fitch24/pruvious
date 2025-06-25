import { parse } from "./bytes.js";
import { isNumber } from "./number.js";
import { setProperty } from "./object.js";
import { camelCase, isString, joinRouteParts, kebabCase, snakeCase } from "./string.js";
const special = [
  "baseComponents",
  "baseUrl",
  "customCapabilities",
  "expirationLong",
  "legalLinks",
  "localStorageKey",
  "localStorageKey",
  "maxFileSize",
  "renewInterval",
  "searchInterval",
  "secretKey",
  "singleCollectionsTable",
  "standardCollections",
  "standardFields",
  "standardHooks",
  "standardJobs",
  "standardMiddleware",
  "standardTranslatableStrings",
  "urlPrefix"
].map((key) => snakeCase(key).toUpperCase());
export function patchModuleOptions(runtimeConfig) {
  for (const [key, value] of Object.entries(process.env)) {
    for (const [prefix, object] of [
      ["NUXT_PRUVIOUS_", runtimeConfig.pruvious],
      ["NUXT_PUBLIC_PRUVIOUS_", runtimeConfig.public.pruvious]
    ]) {
      if (key.startsWith(prefix)) {
        let path = key.slice(prefix.length);
        for (const word of special) {
          path = path.replace(word, kebabCase(word));
        }
        path = path.replaceAll("_", ".").split(".").map((part) => camelCase(part.toLowerCase())).join(".");
        setProperty(object, path, value);
      }
    }
  }
  if (runtimeConfig.public.pruvious.language && !runtimeConfig.public.pruvious.language.supported?.length) {
    runtimeConfig.public.pruvious.language.supported.push({ name: "English", code: "en" });
  }
  if (runtimeConfig.pruvious.uploads?.drive?.type === "s3") {
    ;
    runtimeConfig.pruvious.uploads.drive.baseUrl = runtimeConfig.pruvious.uploads.drive.baseUrl.replace(/\/*$/, "/");
  }
  ;
  runtimeConfig.public.pruvious.uploadsBase = runtimeConfig.pruvious.uploads?.drive?.type === "s3" ? runtimeConfig.pruvious.uploads.drive.baseUrl : joinRouteParts(runtimeConfig.app.baseURL, runtimeConfig.pruvious.uploads.drive.urlPrefix ?? "uploads") + "/";
  if (isString(runtimeConfig.pruvious.uploads?.maxFileSize)) {
    ;
    runtimeConfig.pruvious.uploads.maxFileSize = parse(runtimeConfig.pruvious.uploads.maxFileSize);
  } else if (runtimeConfig.pruvious.uploads && !isNumber(runtimeConfig.pruvious.uploads?.maxFileSize)) {
    ;
    runtimeConfig.pruvious.uploads.maxFileSize = parse("16 MB");
  }
}
