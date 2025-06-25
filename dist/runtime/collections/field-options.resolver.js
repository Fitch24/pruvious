const resolvedCollectionFieldOptions = {};
export function resolveCollectionFieldOptions(cacheKey, field, name, options, fields) {
  if (!resolvedCollectionFieldOptions[cacheKey]) {
    resolvedCollectionFieldOptions[cacheKey] = {};
  }
  if (!resolvedCollectionFieldOptions[cacheKey][name]) {
    resolvedCollectionFieldOptions[cacheKey][name] = resolveFieldOptions(field, name, options, fields);
  }
  return resolvedCollectionFieldOptions[cacheKey][name];
}
export function resolveFieldOptions(field, name, options, fields) {
  const resolvedOptions = {};
  for (const [optionName, optionDefinition] of Object.entries(fields[field].options)) {
    resolvedOptions[optionName] = options[optionName] ?? (optionDefinition.default ? optionDefinition.default({ definition: fields[field], options, name }) : void 0);
  }
  if (field === "repeater") {
    resolvedOptions.subfields = {};
    for (const [subfieldName, subfieldDefinition] of Object.entries(options.subfields)) {
      resolvedOptions.subfields[subfieldName] = {
        ...subfieldDefinition,
        options: resolveFieldOptions(subfieldDefinition.type, subfieldName, subfieldDefinition.options, fields)
      };
    }
  }
  return resolvedOptions;
}
