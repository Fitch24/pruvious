import fs from "fs-extra";
import { resolve } from "path";
import { evaluateModule } from "../instances/evaluator.js";
import { queueError } from "../instances/logger.js";
import { resolveAppPath } from "../instances/path.js";
import { getModuleOption } from "../instances/state.js";
import { isUndefined } from "../utils/common.js";
import { walkDir } from "../utils/fs.js";
import { validateDefaultExport } from "../utils/validation.js";
const cachedDashboardPages = {};
export function resolveDashboardPages() {
  const records = {};
  const fromApp = resolveAppPath("./dashboard");
  let errors = 0;
  if (fs.existsSync(fromApp) && fs.lstatSync(fromApp).isDirectory()) {
    for (const { fullPath } of walkDir(fromApp, { endsWith: ".ts", endsWithout: ".d.ts" })) {
      errors += resolveDashboardPage(fullPath, records, false);
    }
  }
  for (const layer of getModuleOption("layers").slice(1)) {
    if (fs.existsSync(resolve(layer, "dashboard"))) {
      for (const { fullPath } of walkDir(resolve(layer, "dashboard"), {
        endsWith: [".ts"],
        endsWithout: ".d.ts"
      })) {
        errors += resolveDashboardPage(fullPath, records, false, true);
      }
    }
  }
  return { records, errors };
}
function resolveDashboardPage(filePath, records, isStandard, ignoreDuplicate = false) {
  try {
    let exports = cachedDashboardPages[filePath];
    if (isUndefined(exports)) {
      let code = fs.readFileSync(filePath, "utf-8");
      const hasLocalImports = /^\s*import.+['""](?:\.|~~|~|@@|@)/m.test(code);
      if (!isStandard && !/^\s*import.+defineDashboardPage.+pruvious/m.test(code)) {
        code += "import { defineDashboardPage } from '#pruvious'\n";
      }
      exports = evaluateModule(filePath, code);
      if (isStandard || !hasLocalImports) {
        cachedDashboardPages[filePath] = exports;
      }
    }
    if (validateDefaultExport("dashboard pages", "defineDashboardPage({ ... })", exports, filePath)) {
      if (!records[exports.default.path] || !ignoreDuplicate) {
        records[exports.default.path] = { definition: exports.default, source: filePath };
      }
      return 0;
    }
  } catch (e) {
    queueError(`Cannot define dashboard page in $c{{ ${filePath} }}

Details:`, e);
  }
  return 1;
}
export function clearCachedDashboardPages(path) {
  delete cachedDashboardPages[path];
}
