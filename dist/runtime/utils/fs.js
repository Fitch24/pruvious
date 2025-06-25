import { toArray } from "@antfu/utils";
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from "fs";
import fse from "fs-extra";
import { dirname, join, relative, resolve } from "path";
import { resolveAppPath, resolveModulePath } from "../instances/path.js";
export function* walkDir(directory, filter = {}, rootDirectory) {
  rootDirectory ||= directory;
  for (const file of readdirSync(directory)) {
    const fullPath = resolve(directory, file);
    const stats = lstatSync(fullPath);
    if (stats.isFile()) {
      if ((!filter.startsWith || toArray(filter.startsWith).some((v) => file.startsWith(v))) && (!filter.startsWithout || toArray(filter.startsWithout).every((v) => !file.startsWith(v))) && (!filter.endsWith || toArray(filter.endsWith).some((v) => file.endsWith(v))) && (!filter.endsWithout || toArray(filter.endsWithout).every((v) => !file.endsWith(v)))) {
        yield { file, directory, fullPath, relativePath: join(relative(rootDirectory, directory), file) };
      }
    } else if (stats.isDirectory()) {
      yield* walkDir(fullPath, filter, rootDirectory);
    }
  }
}
export function write(file, content) {
  fse.ensureDirSync(dirname(file));
  if (!existsSync(file) || readFileSync(file, "utf-8") !== content) {
    writeFileSync(file, content);
  }
}
export function removeExcept(directory, except) {
  fse.ensureDirSync(directory);
  for (const file of readdirSync(directory)) {
    if (!except.includes(file)) {
      fse.removeSync(resolve(directory, file));
    }
  }
}
export function relativeImport(fromDir, to) {
  return relative(fromDir, to).replaceAll("\\", "/").replace(/\.(?:mjs|\.d\.ts|ts)$/, "");
}
export function relativeDotPruviousImport(...modulePath) {
  const dotPruviousPath = resolveAppPath("./.pruvious");
  return relativeImport(dotPruviousPath, resolveModulePath(...modulePath));
}
