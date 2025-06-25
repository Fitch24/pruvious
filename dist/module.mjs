import { defineNuxtModule, createResolver, addRouteMiddleware, addServerHandler, extendPages, addServerPlugin } from '@nuxt/kit';
import { defu } from 'defu';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';
import path from 'path';
import semver from 'semver';
import { isDevelopment, isTest } from 'std-env';
import { warn } from '../dist/runtime/instances/logger.js';
import { initModulePathResolver, initRootDir, resolveAppPath, resolveLayerPath, resolveRelativeModulePath, resolveRelativeAppPath, resolveModulePath } from '../dist/runtime/instances/path.js';
import { cacheLayerPaths, cacheModuleOptions, getModuleOptions, getModuleOption } from '../dist/runtime/instances/state.js';
import { watchPruviousFiles, boot, validateLanguageOptions, createComponentDirectories } from '../dist/runtime/main.js';
import { parse } from '../dist/runtime/utils/bytes.js';
import { getDatabaseInfo } from '../dist/runtime/utils/database.js';
import { patchModuleOptions } from '../dist/runtime/utils/module-options.js';
import { mergeDefaults } from '../dist/runtime/utils/object.js';
import { pascalCase, isString, joinRouteParts } from '../dist/runtime/utils/string.js';



// -- Unbuild CommonJS Shims --
import __cjs_url__ from 'url';
import __cjs_path__ from 'path';
import __cjs_mod__ from 'module';
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require = __cjs_mod__.createRequire(import.meta.url);
const module = defineNuxtModule({
  meta: {
    name: "pruvious",
    configKey: "pruvious"
  },
  defaults: {
    api: {
      prefix: "api",
      routes: {
        "clear-cache.post": "clear-cache",
        "collections": "collections",
        "dashboard.get": "dashboard",
        "install.post": "install",
        "installed.get": "installed",
        "login.post": "login",
        "logout.post": "logout",
        "logout-all.post": "logout-all",
        "logout-others.post": "logout-others",
        "pages.get": "pages",
        "previews.get": "previews",
        "process-job.post": "process-job",
        "profile.get": "profile",
        "profile.patch": "profile",
        "renew-token.post": "renew-token",
        "robots.txt.get": "robots.txt",
        "sitemap.xml.get": "sitemap.xml",
        "translatable-strings.get": "translatable-strings",
        "*": true
      }
    },
    catchAllPages: true,
    customCapabilities: [],
    dashboard: {
      baseComponents: {
        "collections/overview": void 0,
        "collections/record": void 0,
        "head": void 0,
        "header/logo": void 0,
        "install": void 0,
        "login": void 0,
        "login/logo": void 0,
        "logout": void 0,
        "media": void 0,
        "misc": {
          AddBlockPopup: void 0,
          Base: void 0,
          BlockTreeItem: void 0,
          BooleanFieldPreview: void 0,
          CollectionsContentRecord: void 0,
          CollectionsSimpleRecord: void 0,
          CollectionTranslations: void 0,
          DateFormatField: void 0,
          DateTimeFormatField: void 0,
          Dialog: void 0,
          DragImage: void 0,
          FieldLayout: void 0,
          FieldLayoutTabs: void 0,
          FilterPopup: void 0,
          FilterRule: void 0,
          Globals: void 0,
          HistoryButtons: void 0,
          ImagePreview: void 0,
          InputError: void 0,
          LegalLinks: void 0,
          LoadingIndicator: void 0,
          Logo: void 0,
          LogoFull: void 0,
          MediaBreadcrumbs: void 0,
          MediaDirectoryPopup: void 0,
          MediaFileInput: void 0,
          MediaItemDirectory: void 0,
          MediaItemUpload: void 0,
          MediaLibrary: void 0,
          MediaLibraryPopup: void 0,
          MediaMovePopup: void 0,
          MediaMovePopupItem: void 0,
          MediaUploadPopup: void 0,
          MoreBlockOptionsPopup: void 0,
          MultiCollectionsOverview: void 0,
          Popup: void 0,
          QuickActions: void 0,
          SearchMedia: void 0,
          SearchRecords: void 0,
          SingleCollectionsOverview: void 0,
          StringFieldPreview: void 0,
          TableColumnsPopup: void 0,
          TablePagination: void 0,
          TableSorter: void 0,
          Toaster: void 0,
          TranslationsFieldPreview: void 0,
          UnsavedChanges: void 0
        }
      },
      enabled: true,
      legalLinks: [],
      prefix: "dashboard",
      removeSiteStyles: true
    },
    database: "sqlite:./pruvious.db",
    jobs: { searchInterval: 60 },
    jwt: {
      expiration: "4 hours",
      expirationLong: "7 days",
      renewInterval: 30,
      secretKey: nanoid(64),
      localStorageKey: "token"
    },
    language: {
      supported: [],
      primary: "en",
      localStorageKey: "language"
    },
    migration: true,
    pageCache: { type: "local", path: "./.cache/pages" },
    redis: false,
    singleCollectionsTable: "single_collections",
    standardCollections: {
      pages: true,
      presets: true,
      previews: true,
      redirects: true,
      roles: true,
      seo: true,
      uploads: true,
      users: true
    },
    standardFields: {
      "block": true,
      "button-group": true,
      "checkbox": true,
      "checkboxes": true,
      "chips": true,
      "date": true,
      "date-range": true,
      "date-time": true,
      "date-time-range": true,
      "editor": true,
      "file": true,
      "icon": true,
      "image": true,
      "link": true,
      "number": true,
      "range": true,
      "record": true,
      "records": true,
      "repeater": true,
      "select": true,
      "size": true,
      "slider": true,
      "slider-range": true,
      "switch": true,
      "text": true,
      "text-area": true,
      "time": true,
      "time-range": true
    },
    standardHooks: {
      redirects: true
    },
    standardJobs: {
      "clean-expired-previews": true,
      "clean-expired-tokens": true,
      "publish-pages": true
    },
    standardMiddleware: {
      client: {
        auth: true
      },
      server: {
        auth: true,
        config: true,
        language: true
      }
    },
    standardTranslatableStrings: {
      dashboard: true,
      server: true
    },
    uploads: {
      drive: {
        type: "local",
        path: "./.uploads",
        urlPrefix: "uploads"
      },
      maxFileSize: "16 MB"
    }
  },
  async setup(options, nuxt) {
    if (!semver.satisfies(nuxt._version, "3.15")) {
      warn(
        `This version of Pruvious is compatible with Nuxt $c{{ 3.15.x }}. You are currently using Nuxt $y{{ ${nuxt._version} }}.`
      );
    }
    initModulePathResolver(createResolver(import.meta.url));
    initRootDir(nuxt.options.rootDir);
    cacheLayerPaths(nuxt.options._layers.map(({ cwd, config }) => path.resolve(cwd, config.rootDir)));
    fs.emptyDirSync(resolveAppPath("./.pruvious"));
    for (const [name, componentPath] of Object.entries(options.dashboard.baseComponents)) {
      if (name === "misc") {
        for (const [miscName, miscComponentPath] of Object.entries(componentPath)) {
          options.dashboard.baseComponents.misc[miscName] = miscComponentPath ? resolveLayerPath(miscComponentPath) : resolveRelativeModulePath("./runtime/components/misc", `${miscName}.vue`);
        }
      } else {
        options.dashboard.baseComponents[name] = componentPath ? resolveLayerPath(componentPath) : resolveRelativeModulePath("./runtime/components/dashboard", `${pascalCase(name)}.vue`);
      }
    }
    nuxt.options.runtimeConfig.pruvious = mergeDefaults(nuxt.options.runtimeConfig.pruvious, {
      catchAllPages: options.catchAllPages,
      customCapabilities: options.customCapabilities,
      dashboard: options.dashboard,
      database: options.database,
      jwt: options.jwt,
      jobs: options.jobs,
      migration: options.migration,
      pageCache: options.pageCache,
      redis: options.redis,
      singleCollectionsTable: options.singleCollectionsTable,
      standardCollections: options.standardCollections,
      standardFields: options.standardFields,
      standardHooks: options.standardHooks,
      standardJobs: options.standardJobs,
      standardMiddleware: options.standardMiddleware,
      standardTranslatableStrings: options.standardTranslatableStrings,
      uploads: options.uploads,
      uploadsDir: options.uploads.drive?.type === "local" ? resolveRelativeAppPath(options.uploads.drive.path ?? "./.uploads") : void 0
    });
    nuxt.options.runtimeConfig.public.pruvious = mergeDefaults(nuxt.options.runtimeConfig.public.pruvious, {
      api: options.api,
      dashboardPrefix: options.dashboard.prefix,
      dashboardRemoveSiteStyles: options.dashboard.removeSiteStyles,
      jwtRenewInterval: options.jwt.renewInterval,
      jwtLocalStorageKey: options.jwt.localStorageKey,
      language: options.language,
      uploadLimit: isString(options.uploads.maxFileSize) ? parse(options.uploads.maxFileSize) : options.uploads.maxFileSize ?? parse("16 MB")
    });
    patchModuleOptions(nuxt.options.runtimeConfig);
    cacheModuleOptions(nuxt.options.runtimeConfig);
    const moduleOptions = getModuleOptions();
    if (moduleOptions.standardMiddleware.client.auth) {
      addRouteMiddleware(
        {
          name: "pruvious-auth",
          path: resolveModulePath("./runtime/middleware/client/auth"),
          global: moduleOptions.standardMiddleware.client.auth
        },
        { override: true }
      );
    }
    for (const middleware of ["config", "language", "auth"]) {
      if (moduleOptions.standardMiddleware.server[middleware]) {
        addServerHandler({
          route: "",
          middleware: true,
          handler: resolveModulePath(`./runtime/middleware/server/${middleware}`)
        });
      }
    }
    if (moduleOptions.api.routes.collections) {
      addServerHandler({
        route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes.collections, "**"),
        handler: resolveModulePath("./runtime/api/collections")
      });
    }
    for (const route of [
      "clear-cache.post",
      "dashboard.get",
      "install.post",
      "installed.get",
      "login.post",
      "logout.post",
      "logout-all.post",
      "logout-others.post",
      "process-job.post",
      "profile.get",
      "profile.patch",
      "renew-token.post"
    ]) {
      if (moduleOptions.api.routes[route]) {
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes[route]),
          handler: resolveModulePath(`./runtime/api/${route}`)
        });
      }
    }
    if (moduleOptions.api.routes["pages.get"]) {
      if (moduleOptions.api.prefix) {
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes["pages.get"]),
          handler: resolveModulePath("./runtime/api/pages.get")
        });
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes["pages.get"], "**"),
          handler: resolveModulePath("./runtime/api/pages.get")
        });
      }
    }
    if (moduleOptions.api.routes["previews.get"]) {
      if (moduleOptions.api.prefix) {
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes["previews.get"]),
          handler: resolveModulePath("./runtime/api/previews.get")
        });
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes["previews.get"], "**"),
          handler: resolveModulePath("./runtime/api/previews.get")
        });
      }
    }
    if (moduleOptions.api.routes["translatable-strings.get"]) {
      if (moduleOptions.api.prefix) {
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix, moduleOptions.api.routes["translatable-strings.get"]),
          handler: resolveModulePath("./runtime/api/translatable-strings.get")
        });
        addServerHandler({
          route: joinRouteParts(
            moduleOptions.api.prefix,
            moduleOptions.api.routes["translatable-strings.get"],
            ":domain"
          ),
          handler: resolveModulePath("./runtime/api/translatable-strings.get")
        });
      }
    }
    if (moduleOptions.api.routes["*"]) {
      if (moduleOptions.api.prefix) {
        addServerHandler({
          route: joinRouteParts(moduleOptions.api.prefix),
          handler: resolveModulePath("./runtime/api/catch-all")
        });
      }
      addServerHandler({
        route: joinRouteParts(moduleOptions.api.prefix, "**"),
        handler: resolveModulePath("./runtime/api/catch-all")
      });
    }
    extendPages((pages) => {
      if (moduleOptions.dashboard.enabled) {
        pages.push({
          name: "pruvious-dashboard",
          path: joinRouteParts(moduleOptions.dashboard.prefix, ":catchAll(.*)?"),
          file: resolveModulePath("./runtime/pages/dashboard/index.vue")
        });
      }
      if (moduleOptions.api.routes["pages.get"] && moduleOptions.catchAllPages) {
        pages.push({
          name: "pruvious-page",
          path: "/:catchAll(.*)",
          file: resolveModulePath("./runtime/pages/[...slug].vue")
        });
      }
    });
    if (moduleOptions.api.routes["robots.txt.get"]) {
      addServerHandler({
        route: joinRouteParts(moduleOptions.api.routes["robots.txt.get"]),
        handler: resolveModulePath("./runtime/api/robots.get")
      });
    }
    if (moduleOptions.api.routes["sitemap.xml.get"]) {
      addServerHandler({
        route: joinRouteParts(moduleOptions.api.routes["sitemap.xml.get"]),
        handler: resolveModulePath("./runtime/api/sitemap.get")
      });
      addServerHandler({
        route: joinRouteParts(moduleOptions.api.routes["sitemap.xml.get"], ":index"),
        handler: resolveModulePath("./runtime/api/sitemap.get")
      });
    }
    nuxt.hook("build:manifest", (manifest) => {
      for (const item of Object.values(manifest)) {
        if (item.isEntry || item.isDynamicEntry) {
          item.dynamicImports = [];
        }
      }
    });
    nuxt.hook("builder:watch", watchPruviousFiles);
    nuxt.hook("components:dirs", (dirs) => {
      if (options.standardFields.icon) {
        dirs.unshift({ path: resolveAppPath("./icons"), prefix: "Icon" });
      }
      dirs.unshift(
        { path: resolveModulePath("./runtime/components/icons"), prefix: "PruviousIcon" },
        { path: resolveModulePath("./runtime/components/misc"), prefix: "Pruvious" },
        { path: resolveAppPath("./blocks") }
      );
      for (const layer of moduleOptions.layers) {
        if (fs.existsSync(path.resolve(layer, "blocks"))) {
          dirs.unshift({ path: path.resolve(layer, "blocks") });
        }
      }
    });
    nuxt.hook("nitro:config", (config) => {
      if (moduleOptions.dashboard.enabled) {
        config.routeRules ||= {};
        config.routeRules[`/${moduleOptions.dashboard.prefix}/**`] = { ssr: false };
      }
    });
    nuxt.hook("ready", boot);
    nuxt.hook("vite:extendConfig", (config) => {
      config.optimizeDeps = defu(config.optimizeDeps ?? {}, {
        needsInterop: ["vue-slider-component"],
        include: ["vue-slider-component"]
      });
    });
    if (moduleOptions.uploads) {
      nuxt.hook("nitro:init", (nitro) => {
        nitro.hooks.addHooks({ "dev:reload": () => require("sharp") });
      });
    }
    nuxt.options.alias["#pruvious"] = resolveAppPath("./.pruvious");
    nuxt.options.ignore ||= [];
    nuxt.options.pages = true;
    nuxt.options.vite = defu(nuxt.options.vite ?? {}, {
      $server: { build: { rollupOptions: { output: { preserveModules: true } } } }
    });
    const dbInfo = getDatabaseInfo();
    if (dbInfo.dialect === "sqlite") {
      nuxt.options.ignore.push("**/" + path.basename(dbInfo.storage));
      nuxt.options.ignore.push(`**/${path.basename(dbInfo.storage)}-journal`);
    }
    if (moduleOptions.uploads.drive.type === "local") {
      const uploadsDir = getModuleOption("uploadsDir");
      const symDir = path.join(
        nuxt.options.rootDir,
        nuxt.options.dir.public,
        moduleOptions.uploads.drive.urlPrefix ?? "uploads"
      );
      fs.ensureDirSync(uploadsDir);
      fs.removeSync(symDir);
      if (isDevelopment || isTest) {
        fs.ensureSymlinkSync(uploadsDir, symDir, "junction");
      }
      nuxt.options.ignore.push("**/" + path.basename(moduleOptions.uploads.drive.path ?? "./uploads") + "/**/*");
    }
    addServerPlugin(resolveModulePath("./runtime/plugins/page-cache"));
    validateLanguageOptions();
    createComponentDirectories();
  }
});

export { module as default };
