import { navigateTo, useRuntimeConfig, useState } from "#imports";
import tooltipDirective from "../../plugins/pruvious-tooltip.js";
import { isArray, toArray } from "../../utils/array.js";
import { pruviousFetch } from "../../utils/fetch.js";
import { joinRouteParts } from "../../utils/string.js";
import { useAuth } from "../auth.js";
import { getToken, setToken } from "../token.js";
export const usePruviousDashboard = () => useState("pruvious-dashboard", () => ({
  blocks: {},
  collection: null,
  collections: {},
  initialized: false,
  installed: false,
  isCacheActive: false,
  legalLinks: [],
  loaded: false,
  menu: [],
  routeParams: [],
  refresh: false
}));
export async function updatePruviousDashboard(route) {
  const dashboard = usePruviousDashboard();
  const runtimeConfig = useRuntimeConfig();
  dashboard.value.routeParams = route.path.replace(runtimeConfig.public.pruvious.dashboardPrefix, "").split("/").filter(Boolean);
  if (!dashboard.value.initialized) {
    const auth = useAuth();
    const installedResponse = await pruviousFetch("installed.get");
    dashboard.value.installed = installedResponse.success ? installedResponse.data : false;
    if (auth.value.isLoggedIn && dashboard.value.installed) {
      const renewTokenResponse = await pruviousFetch("renew-token.post");
      if (renewTokenResponse.success) {
        setToken(renewTokenResponse.data);
      } else {
        auth.value.userId = null;
        auth.value.isLoggedIn = false;
      }
    }
    if (process.client) {
      setInterval(async () => {
        if (auth.value.isLoggedIn) {
          const renewTokenResponse = await pruviousFetch("renew-token.post");
          if (renewTokenResponse.success) {
            setToken(renewTokenResponse.data);
          }
        }
      }, runtimeConfig.public.pruvious.jwtRenewInterval * 6e4);
      window.addEventListener("focus", () => {
        const token = getToken();
        if (auth.value.isLoggedIn && token && token.exp < Date.now() / 1e3) {
        }
      });
    }
    dashboard.value.initialized = true;
  }
}
export function registerDynamicPruviousDashboardPlugins(nuxtApp) {
  if (!nuxtApp.vueApp._context.directives["pruvious-tooltip"]) {
    tooltipDirective(nuxtApp);
  }
}
export function navigateToPruviousDashboardPath(path, options, route) {
  const runtimeConfig = useRuntimeConfig();
  const dest = joinRouteParts(runtimeConfig.public.pruvious.dashboardPrefix, ...toArray(path).map(String));
  const to = options?.to?.toString().split("?").shift();
  const toPath = to ? joinRouteParts(to) : null;
  const pathString = isArray(path) ? path.join("/") : String(path);
  const query = {
    ...pathString.includes("?") ? Object.fromEntries(new URLSearchParams(pathString.split("?")[1])) : {},
    ...route?.query ?? {}
  };
  return navigateTo(
    {
      path: dest,
      query: {
        ...query,
        to: toPath && toPath !== dest && toPath !== joinRouteParts(runtimeConfig.public.pruvious.dashboardPrefix) ? toPath : void 0
      }
    },
    options
  );
}
