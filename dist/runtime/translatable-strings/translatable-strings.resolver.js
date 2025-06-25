import fs from "fs-extra";
import { resolve } from "path";
import { evaluateModule } from "../instances/evaluator.js";
import { queueError } from "../instances/logger.js";
import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { getModuleOption } from "../instances/state.js";
import { isUndefined } from "../utils/common.js";
import { walkDir } from "../utils/fs.js";
import { isKeyOf, isObject } from "../utils/object.js";
import { isString } from "../utils/string.js";
import { extractPlaceholders } from "../utils/translatable-strings.js";
import { queueErrorAndReturn, validateDefaultExport, validateSafeSlug } from "../utils/validation.js";
const cachedTranslatableStrings = {};
export function resolveTranslatableStrings() {
  const records = {};
  const fromModule = resolveModulePath("./runtime/translatable-strings/standard");
  const fromApp = resolveAppPath("./translatable-strings");
  const registeredStandardTranslatableStrings = getModuleOption("standardTranslatableStrings");
  let errors = 0;
  for (const { file, fullPath } of walkDir(fromModule, { endsWith: [".js", ".ts"], endsWithout: ".d.ts" })) {
    if (registeredStandardTranslatableStrings[file.split(".").shift()]) {
      errors += resolveTranslatableStringFile(fullPath, records, true);
    }
  }
  if (fs.existsSync(fromApp) && fs.lstatSync(fromApp).isDirectory()) {
    for (const { fullPath } of walkDir(fromApp, { endsWith: ".ts", endsWithout: ".d.ts" })) {
      errors += resolveTranslatableStringFile(fullPath, records, false);
    }
  }
  for (const layer of getModuleOption("layers").slice(1)) {
    if (fs.existsSync(resolve(layer, "translatable-strings"))) {
      for (const { fullPath } of walkDir(resolve(layer, "translatable-strings"), {
        endsWith: [".ts"],
        endsWithout: ".d.ts"
      })) {
        errors += resolveTranslatableStringFile(fullPath, records, false, true);
      }
    }
  }
  return { records, errors };
}
function resolveTranslatableStringFile(filePath, records, isStandard, ignoreDuplicate = false) {
  try {
    let exports = cachedTranslatableStrings[filePath];
    if (isUndefined(exports)) {
      let code = fs.readFileSync(filePath, "utf-8");
      const hasLocalImports = /^\s*import.+['""](?:\.|~~|~|@@|@)/m.test(code);
      if (!isStandard && !/^\s*import.+defineTranslatableStrings.+pruvious/m.test(code)) {
        code += "import { defineTranslatableStrings } from '#pruvious'\n";
      }
      exports = evaluateModule(filePath, code);
      if (isStandard || !hasLocalImports) {
        cachedTranslatableStrings[filePath] = exports;
      }
    }
    if (validateDefaultExport("translatable strings", "defineTranslatableStrings({ ... })", exports, filePath) && validateSafeSlug({
      subject: "translatable strings",
      prop: "domain",
      value: exports.default.domain,
      path: filePath,
      examples: ["'default'", "'blog'", "'client-dashboard'", "etc."]
    }) && validateTranslatableStrings(exports.default.strings, filePath)) {
      if (Object.values(records).some(
        ({ definition }) => definition.domain === exports.default.domain && definition.language === exports.default.language
      )) {
        if (ignoreDuplicate) {
          return 0;
        } else {
          queueError(
            `Cannot register duplicate translatable strings $c{{ ${exports.default.domain} (${exports.default.language}) }} in $c{{ ${filePath} }}`
          );
        }
      } else {
        records[filePath] = { definition: exports.default, source: filePath, isStandard };
        return 0;
      }
    }
  } catch (e) {
    queueError(`Cannot define translatable string in $c{{ ${filePath} }}

Details:`, e);
  }
  return 1;
}
export function validateTranslatableStrings(strings, path) {
  for (const [key, value] of Object.entries(strings)) {
    if (isObject(value)) {
      const { pattern, input, replacements } = value;
      if (!isString(pattern)) {
        return queueErrorAndReturn(`Invalid pattern in translatable string $c{{ ${key} }} in $c{{ ${path} }}`);
      }
      const placeholders = extractPlaceholders(pattern);
      for (const placeholder of placeholders) {
        if ((!input || !isKeyOf(input, placeholder)) && (!replacements || !isKeyOf(replacements, placeholder))) {
          return queueErrorAndReturn(
            `Missing replacement for placeholder $c{{ ${placeholder} }} in $c{{ ${path} }}`,
            `

Pattern: $c{{ ${pattern} }}`
          );
        }
      }
    }
  }
  return true;
}
export function clearCachedTranslatableStrings(path) {
  delete cachedTranslatableStrings[path];
}
