import { isRef, useRuntimeConfig } from "#imports";
import { getLanguage } from "../composables/language.js";
import { getRawToken, removeToken } from "../composables/token.js";
import { isObject } from "./object.js";
import { joinRouteParts } from "./string.js";
export async function pruviousFetch(path, options) {
  const defaultOptions = {};
  const dispatchEvents = options?.dispatchEvents !== false;
  let resolvedPath = "/";
  let error;
  let code;
  defaultOptions.method = path.split(".").pop().toUpperCase();
  defaultOptions.method = defaultOptions.method && ["GET", "POST", "PATCH", "DELETE"].includes(defaultOptions.method) ? defaultOptions.method : "GET";
  resolvedPath = pruviousApiPath(path);
  if (options?.subpath) {
    resolvedPath = joinRouteParts(resolvedPath, options.subpath);
  }
  if (options && isObject(options.body)) {
    options.body = Object.fromEntries(
      Object.entries(options.body).map(([key, value]) => [key, isRef(value) ? value.value : value])
    );
  }
  const token = getRawToken();
  const headers = options?.headers ?? {};
  if (!headers["Accept-Language"]) {
    headers["Accept-Language"] = getLanguage();
  }
  if (!headers["Authorization"] && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const data = await $fetch(resolvedPath, {
    headers,
    onRequest() {
      if (process.client && dispatchEvents) {
        window.dispatchEvent(new CustomEvent("pruvious-fetch-start"));
      }
    },
    onResponse: ({ response }) => {
      code = response.status;
    },
    onResponseError: ({ response }) => {
      if (response.status === 401) {
        removeToken();
        if (process.client && dispatchEvents) {
          window.dispatchEvent(new CustomEvent("pruvious-fetch-unauthorized"));
        }
      }
      if (process.client && dispatchEvents) {
        window.dispatchEvent(new CustomEvent("pruvious-fetch-error", { detail: response._data || response.statusText }));
      }
    },
    ...defaultOptions,
    ...options ?? {}
  }).catch((e) => error = e).finally(() => {
    if (process.client && dispatchEvents) {
      window.dispatchEvent(new CustomEvent("pruvious-fetch-end"));
    }
  });
  return error ? { success: false, code, error: error.data || error.message || "" } : { success: true, code, data };
}
export function pruviousApiPath(base, ...path) {
  const runtimeConfig = useRuntimeConfig();
  return joinRouteParts(
    runtimeConfig.app.baseURL,
    // The subdirectory
    runtimeConfig.public.pruvious.api.prefix,
    runtimeConfig.public.pruvious.api.routes[base] || base.split(".")[0],
    ...path.map(String)
  );
}
