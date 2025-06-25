import { clearRedirects } from "../../../instances/redirects.js";
import { defineHook } from "../../hook.definition.js";
export default defineHook("redirects", "afterUpdate", () => {
  clearRedirects();
});
