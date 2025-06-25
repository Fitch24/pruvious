import { patchModuleOptions } from "../utils/module-options.js";
import { deepClone, deepMerge } from "../utils/object.js";
export const intervals = [];
let booting = true;
let optionsInitialized = false;
const moduleOptions = {
  api: "",
  baseUrl: "",
  catchAllPages: true,
  customCapabilities: [],
  dashboard: {},
  database: "",
  jobs: {},
  jwt: {},
  language: {},
  layers: [],
  migration: {},
  pageCache: true,
  redis: false,
  singleCollectionsTable: "",
  standardCollections: {},
  standardFields: {},
  standardHooks: {},
  standardJobs: {},
  standardMiddleware: {},
  standardTranslatableStrings: {},
  uploads: {},
  uploadsDir: ""
};
export function bootingFinished() {
  booting = false;
}
export function isBooting() {
  return booting;
}
export function cacheModuleOptions(runtimeConfig) {
  if (!optionsInitialized) {
    const config = deepClone(runtimeConfig);
    patchModuleOptions(config);
    deepMerge(moduleOptions, {
      api: config.public.pruvious.api,
      baseUrl: runtimeConfig.app.baseURL,
      catchAllPages: config.pruvious.catchAllPages,
      customCapabilities: config.pruvious.customCapabilities,
      dashboard: config.pruvious.dashboard,
      database: config.pruvious.database,
      jobs: config.pruvious.jobs,
      jwt: config.pruvious.jwt,
      language: config.public.pruvious.language,
      migration: config.pruvious.migration,
      pageCache: config.pageCache,
      redis: config.pruvious.redis,
      singleCollectionsTable: config.pruvious.singleCollectionsTable,
      standardCollections: config.pruvious.standardCollections,
      standardFields: config.pruvious.standardFields,
      standardHooks: config.pruvious.standardHooks,
      standardJobs: config.pruvious.standardJobs,
      standardMiddleware: config.pruvious.standardMiddleware,
      standardTranslatableStrings: config.pruvious.standardTranslatableStrings,
      uploads: config.pruvious.uploads,
      uploadsDir: config.pruvious.uploadsDir
    });
    optionsInitialized = true;
  }
}
export function cacheLayerPaths(layers) {
  moduleOptions.layers = layers;
}
export function getModuleOption(option) {
  return moduleOptions[option];
}
export function getModuleOptions() {
  return deepClone(moduleOptions);
}
