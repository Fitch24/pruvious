import { slugify } from "../utils/slugify.js";
import { capitalize } from "../utils/string.js";
export function defineDashboardPage(options) {
  return {
    path: options.path,
    label: options.label ?? capitalize(slugify(options.path), false),
    vueComponent: options.vueComponent,
    icon: options.icon ?? "Tool",
    priority: options.priority ?? 7,
    capabilities: options.capabilities ?? []
  };
}
