import { useFetch, useNuxtApp, useRuntimeConfig } from "#imports";
import { isString, joinRouteParts } from "../utils/string.js";
import { getLanguage } from "./language.js";
import { usePage } from "./page.js";
export async function getCollectionData(collection, fields = "*", cache = true) {
  const nuxtApp = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const { data } = await useFetch(
    joinRouteParts(
      runtimeConfig.app.baseURL,
      // The subdirectory
      runtimeConfig.public.pruvious.api.prefix,
      "collections",
      collection
    ),
    {
      query: {
        select: fields === "*" ? void 0 : Object.keys(fields).join(","),
        language: usePage().value?.language ?? getLanguage(),
        populate: true
      },
      key: `${collection}.read.` + (isString(fields) ? fields : Object.keys(fields).join(",")),
      transform: (input) => ({
        ...input,
        fetchedAt: /* @__PURE__ */ new Date()
      }),
      getCachedData: (key) => {
        if (!cache) {
          return;
        }
        const data2 = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        if (!data2) {
          return;
        } else if (cache === true) {
          return data2;
        }
        const expirationDate = new Date(data2.fetchedAt);
        expirationDate.setSeconds(expirationDate.getTime() + cache * 1e3);
        if (expirationDate.getTime() < Date.now()) {
          return;
        }
        return data2;
      }
    }
  );
  return data.value;
}
