import { clearObject } from "../utils/object.js";
export const redirects = {};
export function clearRedirects() {
  clearObject(redirects);
}
