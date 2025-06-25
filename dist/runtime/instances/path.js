import { existsSync } from "fs";
import { join, relative, resolve } from "path";
import { getModuleOption } from "./state.js";
let moduleResolver;
let rootDir = "";
export function resolveAppPath(...path) {
  return resolve(rootDir, ...path);
}
export function resolveRelativeAppPath(...path) {
  const relativePath = relative(process.cwd(), resolveAppPath(...path));
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}
export function resolveLayerPath(...path) {
  const joined = join(...path);
  for (const layer of getModuleOption("layers")) {
    const resolved = resolve(layer, joined);
    if (existsSync(resolved)) {
      return resolved;
    }
  }
  throw new Error(`Unable to resolve path ${joined.startsWith(".") ? joined : `./${joined}`}`);
}
export function resolveModulePath(...path) {
  if (!moduleResolver) {
    throw new Error(`Module resolver is not instantiated.`);
  }
  return resolve(moduleResolver.resolve(...path));
}
export function resolveRelativeModulePath(...path) {
  const relativePath = relative(process.cwd(), resolveModulePath(...path));
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}
export function initModulePathResolver(resolver) {
  moduleResolver = resolver;
}
export function initRootDir(dir) {
  rootDir = dir;
}
export function appPathExists(...path) {
  return existsSync(resolveAppPath(...path));
}
