import { useNuxtApp, useRuntimeConfig, useState } from "#imports";
import { loadTranslatableStrings, useTranslatableStrings } from "./translatable-strings.js";
export const useLanguage = () => useState("pruvious-language", () => null);
export function getLanguage() {
  const language = useLanguage();
  const runtimeConfig = useRuntimeConfig();
  if (!language.value) {
    language.value = resolveLanguage();
  }
  if (process.client && localStorage.getItem(runtimeConfig.public.pruvious.language.localStorageKey)) {
    localStorage.setItem(runtimeConfig.public.pruvious.language.localStorageKey, language.value);
  }
  return language.value;
}
export async function setLanguage(languageCode, options) {
  const runtimeConfig = useRuntimeConfig();
  const { supported } = runtimeConfig.public.pruvious.language;
  if (supported.some(({ code }) => code === languageCode)) {
    if (options?.reloadTranslatableStrings !== false) {
      const ts = useTranslatableStrings().value;
      await loadTranslatableStrings(Object.keys(ts), languageCode);
    }
    const language = useLanguage();
    language.value = languageCode;
    if (process.server) {
      const nuxtApp = useNuxtApp();
      nuxtApp.ssrContext.event.context.language = language.value;
    } else {
      localStorage.setItem(runtimeConfig.public.pruvious.language.localStorageKey, language.value);
    }
    return true;
  }
  return false;
}
export function resolveLanguage() {
  const nuxtApp = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const options = runtimeConfig.public.pruvious.language;
  const primaryLanguage = options.primary;
  if (process.server) {
    return nuxtApp.ssrContext.event.context.language || runtimeConfig.public.pruvious.language.primary;
  } else {
    const language = localStorage.getItem(options.localStorageKey) || navigator.language;
    if (options.supported.some(({ code }) => code === language)) {
      return language;
    } else if (language.includes("-")) {
      const shortCode = language.split("-").shift();
      if (options.supported.some(({ code }) => code === shortCode)) {
        return shortCode;
      }
    }
  }
  return primaryLanguage;
}
