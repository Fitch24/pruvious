export function defineTranslatableStrings(definition) {
  return {
    domain: definition.domain,
    language: definition.language,
    strings: definition.strings,
    api: definition.api ?? true,
    guards: definition.guards ?? []
  };
}
