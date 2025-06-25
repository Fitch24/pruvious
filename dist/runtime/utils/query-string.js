import { isArray, uniqueArray } from "./array.js";
import { isString } from "./string.js";
export function encodeQueryString(value) {
  return encodeURIComponent(value).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/%3E/g, ">").replace(/%3C/g, "<").replace(/%3D/g, "=").replace(/%21/g, "!").replace(/%2C/g, ",").replace(/%3A/g, ":").replace(/%26/g, "&");
}
export function parseQSArray(value) {
  if (isString(value)) {
    return uniqueArray(
      value.split(",").map((v) => v.trim()).filter(Boolean)
    );
  } else if (isArray(value)) {
    return uniqueArray(value.map((v) => isString(v) ? v.trim() : "").filter(Boolean));
  }
  return null;
}
export function parseWhereTokens(tokens) {
  const result = [];
  let token;
  while (token = tokens.shift()) {
    if (token === "]") {
      return result;
    }
    result.push(token === "[" ? parseWhereTokens(tokens) : token);
  }
  return result;
}
export function* tokenize(characters) {
  let token = "";
  let c = "";
  let escape = false;
  while (c = characters.shift()) {
    if ((c === "[" || c === "]") && !escape) {
      if (token) {
        yield token;
        token = "";
      }
      yield c;
    } else if (c === "\\" && !escape) {
      escape = true;
    } else {
      token += c;
      escape = false;
    }
  }
  if (token) {
    yield token;
  }
}
