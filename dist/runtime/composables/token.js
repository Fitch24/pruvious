import { useRuntimeConfig, useState } from "#imports";
import decode from "jwt-decode";
import { isPositiveInteger } from "../utils/number.js";
export const useToken = () => useState("pruvious-token", () => null);
export function getRawToken() {
  if (process.client) {
    const runtimeConfig = useRuntimeConfig();
    return localStorage.getItem(runtimeConfig.public.pruvious.jwtLocalStorageKey);
  }
  return null;
}
export function getToken() {
  if (process.client) {
    const storedToken = useToken();
    let tmpToken = storedToken.value;
    if (!tmpToken) {
      const rawToken = getRawToken();
      if (rawToken) {
        try {
          tmpToken = { token: rawToken, ...decode(rawToken) };
        } catch {
          removeToken();
        }
      }
    }
    if (tmpToken) {
      if (isPositiveInteger(tmpToken.userId) && isPositiveInteger(tmpToken.iat) && isPositiveInteger(tmpToken.exp) && tmpToken.exp * 1e3 > Date.now()) {
        storedToken.value = tmpToken;
      } else {
        removeToken();
      }
    }
    return storedToken.value;
  }
  return null;
}
export function removeToken() {
  if (process.client) {
    const runtimeConfig = useRuntimeConfig();
    const storedToken = useToken();
    localStorage.removeItem(runtimeConfig.public.pruvious.jwtLocalStorageKey);
    storedToken.value = null;
  }
}
export function setToken(token) {
  if (process.client) {
    const runtimeConfig = useRuntimeConfig();
    const storedToken = useToken();
    localStorage.setItem(runtimeConfig.public.pruvious.jwtLocalStorageKey, token);
    storedToken.value = { token, ...decode(token) };
  }
}
