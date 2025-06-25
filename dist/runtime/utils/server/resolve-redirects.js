import { query } from "../../collections/query.js";
import { clearRedirects, redirects } from "../../instances/redirects.js";
export async function resolveRedirect(path) {
  if (redirects[path]) {
    return redirects[path];
  }
  if (Object.keys(redirects).length > 1e5) {
    clearRedirects();
  }
  const rules = (await query("redirects").read()).rules;
  for (const rule of rules) {
    if (rule.isRegExp) {
      try {
        const match = path.match(new RegExp(rule.fromRegExp));
        if (match) {
          redirects[path] = {
            code: rule.code ? +rule.code : 302,
            to: rule.toRegExp.replace(/\$([1-9][0-9]*)/g, (_, i) => match[+i] ?? ""),
            forwardQueryParams: rule.forwardQueryParams
          };
          return redirects[path];
        }
      } catch {
      }
    } else if (rule.from === path) {
      redirects[path] = {
        code: rule.code ? +rule.code : 302,
        to: rule.to,
        forwardQueryParams: rule.forwardQueryParams
      };
      return redirects[path];
    }
  }
  redirects[path] = null;
  return null;
}
