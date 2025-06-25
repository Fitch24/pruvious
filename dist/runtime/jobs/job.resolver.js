import fs from "fs-extra";
import { resolve } from "path";
import { evaluateModule } from "../instances/evaluator.js";
import { queueError } from "../instances/logger.js";
import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { getModuleOption } from "../instances/state.js";
import { isUndefined } from "../utils/common.js";
import { walkDir } from "../utils/fs.js";
const cachedJobs = {};
export function resolveJobs() {
  const records = {};
  const fromModule = resolveModulePath("./runtime/jobs/standard");
  const fromApp = resolveAppPath("./jobs");
  const registeredStandardJobs = getModuleOption("standardJobs");
  let errors = 0;
  for (const { fullPath, file } of walkDir(fromModule, { endsWith: [".js", ".ts"], endsWithout: ".d.ts" })) {
    if (registeredStandardJobs[file.split(".")[0]]) {
      errors += resolveJob(fullPath, records, true);
    }
  }
  if (fs.existsSync(fromApp) && fs.lstatSync(fromApp).isDirectory()) {
    for (const { fullPath } of walkDir(fromApp, { endsWith: ".ts", endsWithout: ".d.ts" })) {
      errors += resolveJob(fullPath, records, false);
    }
  }
  for (const layer of getModuleOption("layers").slice(1)) {
    if (fs.existsSync(resolve(layer, "jobs"))) {
      for (const { fullPath } of walkDir(resolve(layer, "jobs"), {
        endsWith: [".ts"],
        endsWithout: ".d.ts"
      })) {
        errors += resolveJob(fullPath, records, false, true);
      }
    }
  }
  return { records, errors };
}
function resolveJob(filePath, records, isStandard, ignoreDuplicate = false) {
  try {
    let exports = cachedJobs[filePath];
    if (isUndefined(exports)) {
      let code = fs.readFileSync(filePath, "utf-8");
      const hasLocalImports = /^\s*import.+['""](?:\.|~~|~|@@|@)/m.test(code);
      if (!isStandard && !/^\s*import.+defineJob.+pruvious/m.test(code)) {
        code += "import { defineJob } from '#pruvious'\n";
      }
      exports = evaluateModule(filePath, code);
      if (isStandard || !hasLocalImports) {
        cachedJobs[filePath] = exports;
      }
    }
    if (records[exports.default.name]) {
      if (ignoreDuplicate) {
        return 0;
      } else {
        queueError(`Cannot register duplicate job name $c{{ ${exports.default.name} }} in $c{{ ${filePath} }}`);
      }
    } else {
      records[filePath] = { definition: exports.default, source: filePath, isStandard };
      return 0;
    }
  } catch (e) {
    queueError(`Cannot define job in $c{{ ${filePath} }}

Details:`, e);
  }
  return 1;
}
export function clearCachedJob(path) {
  delete cachedJobs[path];
}
