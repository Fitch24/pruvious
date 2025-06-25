import fs from "fs-extra";
import { resolve } from "path";
import { evaluate, evaluateModule } from "../instances/evaluator.js";
import { queueError } from "../instances/logger.js";
import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { getModuleOption } from "../instances/state.js";
import { uniqueArray } from "../utils/array.js";
import { isDefined, isUndefined } from "../utils/common.js";
import { walkDir } from "../utils/fs.js";
import { validateDefaultExport, validateSafeSlug } from "../utils/validation.js";
const cachedFields = {};
const cachedStandardFields = {};
export function resolveFields() {
  const records = {};
  const fromModule = resolveModulePath("./runtime/fields/standard");
  const fromApp = resolveAppPath("./fields");
  const registeredStandardFields = getModuleOption("standardFields");
  let errors = 0;
  for (const { fullPath, file } of walkDir(fromModule, { endsWith: [".js", ".ts"], endsWithout: ".d.ts" })) {
    if (registeredStandardFields[file.split(".")[0]]) {
      errors += resolveField(fullPath, records, true);
    }
  }
  if (fs.existsSync(fromApp) && fs.lstatSync(fromApp).isDirectory()) {
    for (const { fullPath } of walkDir(fromApp, { endsWith: ".ts", endsWithout: ".d.ts" })) {
      errors += resolveField(fullPath, records, false);
    }
  }
  for (const layer of getModuleOption("layers").slice(1)) {
    if (fs.existsSync(resolve(layer, "fields"))) {
      for (const { fullPath } of walkDir(resolve(layer, "fields"), {
        endsWith: [".ts"],
        endsWithout: ".d.ts"
      })) {
        errors += resolveField(fullPath, records, false, true);
      }
    }
  }
  return { records, errors };
}
function resolveField(filePath, records, isStandard, ignoreDuplicate = false) {
  try {
    let exports = cachedFields[filePath];
    if (isUndefined(exports)) {
      let code = fs.readFileSync(filePath, "utf-8");
      const hasLocalImports = /^\s*import.+['""](?:\.|~~|~|@@|@)/m.test(code);
      if (!isStandard && !/^\s*import.+defineField.+pruvious/m.test(code)) {
        code += "import { defineField } from '#pruvious'\n";
      }
      exports = evaluateModule(filePath, code);
      if (isStandard || !hasLocalImports) {
        cachedFields[filePath] = exports;
        if (isStandard && exports.default) {
          cachedStandardFields[exports.default.name] = exports.default;
        }
      }
    }
    if (validateDefaultExport("fields", "defineField({ ... })", exports, filePath) && validateSafeSlug({
      subject: "field",
      prop: "name",
      value: exports.default.name,
      path: filePath,
      examples: ["'video'", "'gallery'", "'time-range'", "etc."]
    })) {
      if (records[exports.default.name]) {
        if (ignoreDuplicate) {
          return 0;
        } else {
          queueError(`Cannot register duplicate field name $c{{ ${exports.default.name} }} in $c{{ ${filePath} }}`);
        }
      } else {
        records[exports.default.name] = {
          definition: exports.default,
          source: filePath,
          isStandard,
          hasVueField: isDefined(exports.vueField),
          hasVueSubfield: isDefined(exports.vueSubfield),
          hasVueFieldTrap: isDefined(exports.vueFieldTrap),
          hasVueFieldPreview: isDefined(exports.vueFieldPreview)
        };
        cachedFields[exports.default.name] = exports;
        if (isStandard) {
          cachedStandardFields[exports.default.name] = exports.default;
        }
        return 0;
      }
    }
  } catch (e) {
    queueError(`Cannot define field in $c{{ ${filePath} }}

Details:`, e);
  }
  return 1;
}
export function clearCachedField(path) {
  delete cachedFields[path];
}
export function getStandardFieldNames() {
  return uniqueArray(fs.readdirSync(resolveModulePath("./runtime/fields/standard")).map((file) => file.split(".")[0]));
}
export function getStandardFieldDefinitions() {
  const fromModule = resolveModulePath("./runtime/fields/standard");
  for (const { fullPath, file } of walkDir(fromModule, { endsWith: [".js", ".ts"], endsWithout: ".d.ts" })) {
    const fieldName = file.split(".")[0];
    if (!cachedStandardFields[fieldName]) {
      cachedStandardFields[fieldName] = evaluate(fullPath).default;
    }
  }
  return cachedStandardFields;
}
