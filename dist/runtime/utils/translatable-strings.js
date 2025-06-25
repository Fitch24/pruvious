import { isDefined } from "./common.js";
import { isObject } from "./object.js";
import { isAlphanumeric, isString } from "./string.js";
export function extractPlaceholders(pattern) {
  const placeholders = [];
  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === "$") {
      i++;
      if (pattern[i] !== "$") {
        let placeholder = "";
        while (i < pattern.length && isAlphanumeric(pattern[i])) {
          placeholder += pattern[i];
          i++;
        }
        if (placeholder) {
          placeholders.push(placeholder);
        }
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
  return placeholders;
}
export function replacePlaceholders(text, strings, input = {}) {
  const string = strings[String(text)];
  if (isString(string)) {
    return string;
  } else if (string) {
    const tokens = tokenizePlaceholders(string.pattern);
    for (const token of tokens) {
      if (token.type === "placeholder") {
        const replacements = string.replacements?.[token.value];
        if (isString(replacements)) {
          token.value = replacements;
        } else if (replacements) {
          token.value = "";
          for (const replacement of replacements) {
            if (isString(replacement)) {
              token.value = replacement;
              break;
            } else {
              let pass = true;
              for (const conditionObject of replacement.conditions) {
                if (!pass) break;
                for (const [inputKey, condition] of Object.entries(conditionObject)) {
                  if (!pass) break;
                  const inputValue = input[inputKey] ?? (string.input?.[inputKey] === "boolean" ? false : string.input?.[inputKey] === "number" ? 0 : "");
                  if (isObject(condition)) {
                    for (const [operator, value] of Object.entries(condition)) {
                      if (operator === "eq" && inputValue !== value || operator === "ne" && inputValue === value || operator === "gt" && inputValue <= value || operator === "gte" && inputValue < value || operator === "lt" && inputValue >= value || operator === "lte" && inputValue > value || operator === "regexp" && !new RegExp(value.toString()).test(inputValue.toString())) {
                        pass = false;
                        break;
                      }
                    }
                  } else if (inputValue !== condition) {
                    pass = false;
                    break;
                  }
                }
              }
              if (pass) {
                token.value = replacement.output;
                break;
              }
            }
          }
        } else if (isDefined(input[token.value])) {
          token.value = input[token.value].toString();
        } else {
          token.value = "";
        }
      }
    }
    return tokens.map(({ value }) => value).join("");
  }
  return "";
}
export function tokenizePlaceholders(pattern) {
  const tokens = [];
  let i = 0;
  let literal = "";
  while (i < pattern.length) {
    if (pattern[i] === "$") {
      i++;
      if (pattern[i] !== "$") {
        let placeholder = "";
        while (i < pattern.length && isAlphanumeric(pattern[i])) {
          placeholder += pattern[i];
          i++;
        }
        if (placeholder) {
          if (literal) {
            tokens.push({ value: literal, type: "literal" });
            literal = "";
          }
          tokens.push({ value: placeholder, type: "placeholder" });
        }
      } else {
        literal += "$";
        i++;
      }
    } else {
      literal += pattern[i];
      i++;
    }
  }
  if (literal) {
    tokens.push({ value: literal, type: "literal" });
  }
  return tokens;
}
