export function unifyLiteralStrings(...values) {
  return values.length ? values.sort().map((v) => `'${v.replaceAll("'", "\\'")}'`).join(" | ") : "never";
}
export function unifyLiterals(...values) {
  return values.length ? values.sort().join(" | ") : "never";
}
