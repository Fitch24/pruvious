import { translatableStrings } from "#pruvious/server";
import { getModuleOption } from "../../instances/state.js";
import { isString } from "../../utils/string.js";
import { replacePlaceholders } from "../../utils/translatable-strings.js";
export function __(eventOrLanguage, domain, text, input) {
  const options = getModuleOption("language");
  const primaryLanguage = options.primary;
  const language = isString(eventOrLanguage) ? eventOrLanguage : eventOrLanguage.context.language;
  const ts = translatableStrings[domain];
  if (ts?.[language] && ts[language].strings[text]) {
    return replacePlaceholders(text, ts[language].strings, input);
  } else if (ts?.[primaryLanguage] && ts[primaryLanguage].strings[text]) {
    return replacePlaceholders(text, ts[primaryLanguage].strings, input);
  }
  return text;
}
export function _(eventOrLanguage, text, input) {
  return __(eventOrLanguage, "default", text, input);
}
