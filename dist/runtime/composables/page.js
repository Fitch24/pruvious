import { createError, showError, useRoute, useState } from "#imports";
import { pruviousFetch } from "../utils/fetch.js";
import { useLanguage } from "./language.js";
export const usePage = () => useState("pruvious-page", () => null);
export async function getPage(path) {
  const language = useLanguage();
  const page = usePage();
  const route = useRoute();
  const subpath = path ?? route.fullPath;
  const response = subpath.includes("__p=") ? await pruviousFetch("previews.get", { subpath }) : await pruviousFetch("pages.get", { subpath });
  if (response.success) {
    if (response.code === 301 || response.code === 302) {
      page.value = null;
      return { to: response.data, code: response.code };
    } else {
      page.value = response.data;
      language.value = response.data.language;
    }
  } else {
    page.value = null;
    if (process.server) {
      throw createError({ statusCode: 404 });
    } else {
      showError({ statusCode: 404 });
    }
  }
  return null;
}
