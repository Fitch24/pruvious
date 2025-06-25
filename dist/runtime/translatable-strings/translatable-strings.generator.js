import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { uniqueArray } from "../utils/array.js";
import { relativeImport, walkDir } from "../utils/fs.js";
import { isObject } from "../utils/object.js";
import { camelCase, pascalCase } from "../utils/string.js";
import { unifyLiteralStrings } from "../utils/typescript.js";
export function generateTranslatableStrings(translatableStrings, ts, tsServer, tsStandard) {
  const translatableStringsArray = Object.values(translatableStrings);
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const structure = {};
  for (const { definition } of translatableStringsArray) {
    structure[definition.domain] ||= {};
    structure[definition.domain][definition.language] = {
      definition,
      definitionConst: `${camelCase(definition.domain)}_${camelCase(
        definition.language
      )}_translatableStringsDefinition`
    };
  }
  if (!structure.default) {
    structure.default = {};
  }
  const definitionPath = resolveModulePath("./runtime/translatable-strings/translatable-strings.definition");
  ts.newDecl(`import { defineTranslatableStrings } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(
    "export { defineTranslatableStrings }"
  );
  tsServer.newDecl(
    `import { _, __ } from '${relativeImport(
      dotPruviousPath,
      resolveModulePath("./runtime/utils/server/translate-string")
    )}'`
  ).newLine("export { _, __ }");
  for (const { definition, source } of translatableStringsArray) {
    const from = relativeImport(dotPruviousPath, source);
    tsServer.newDecl(
      `import { default as ${camelCase(definition.domain)}_${camelCase(
        definition.language
      )}_translatableStringsDefinition } from '${from}'`
    );
    tsServer.newLine(
      `export { ${camelCase(definition.domain)}_${camelCase(definition.language)}_translatableStringsDefinition }`
    );
  }
  tsServer.newDecl("export const translatableStrings = {");
  for (const [domain, languages] of Object.entries(structure)) {
    tsServer.newLine(`'${domain}': {`);
    for (const [language, { definitionConst }] of Object.entries(languages)) {
      tsServer.newLine(`'${language}': ${definitionConst},`);
    }
    tsServer.newLine("},");
  }
  tsServer.newLine("}");
  ts.newDecl(`export type TranslatableStringsDomain = ${unifyLiteralStrings(...Object.keys(structure))}`);
  const publicDomains = Object.entries(structure).filter(([_, languages]) => Object.values(languages).some(({ definition }) => definition.api)).map(([domain]) => domain);
  ts.newDecl(
    `export type PublicTranslatableStringsDomain = ${unifyLiteralStrings(
      ...uniqueArray([...publicDomains, "default"])
    )}`
  );
  ts.newDecl("export interface TranslatableStringsTextKey {");
  for (const [domain, languages] of Object.entries(structure)) {
    const keys = uniqueArray(
      Object.values(languages).map(({ definition }) => Object.keys(definition.strings)).flat()
    );
    ts.newLine(`'${domain}': ${unifyLiteralStrings(...keys)}`);
  }
  ts.newLine("}");
  ts.newDecl("export interface TranslatableStringsInput {");
  for (const [domain, languages] of Object.entries(structure)) {
    ts.newLine(`'${domain}': {`);
    const strings = Object.values(languages).map(({ definition }) => definition.strings);
    const usedKeys = [];
    for (const string of strings) {
      for (const [key, value] of Object.entries(string)) {
        if (!usedKeys.includes(key) && isObject(value) && value.input) {
          ts.newLine(`'${key.replaceAll("'", "\\'")}': {`);
          for (const [inputName, inputType] of Object.entries(value.input)) {
            ts.newLine(`'${inputName}': ${inputType}`);
          }
          ts.newLine("}");
          usedKeys.push(key);
        }
      }
    }
    ts.newLine("}");
  }
  ts.newLine("}");
  const standardStructure = {};
  let i = 0;
  for (const { file, fullPath } of walkDir(resolveModulePath("./runtime/translatable-strings/standard"), {
    endsWith: [".js", ".ts"],
    endsWithout: ".d.ts"
  })) {
    const fileParts = file.split(".");
    const importName = `standard${pascalCase(fileParts[0])}${pascalCase(fileParts[1])}TranslatableStringsDefinition`;
    const from = relativeImport(dotPruviousPath, fullPath);
    tsStandard[i ? "newLine" : "newDecl"](`import { default as ${importName} } from '${from}'`);
    standardStructure[fileParts[0]] ||= {};
    standardStructure[fileParts[0]][fileParts[1]] = importName;
    i++;
  }
  tsStandard.newDecl("export const standardTranslatableStringsDefinition = {");
  for (const [domain, languages] of Object.entries(standardStructure)) {
    tsStandard.newLine(`'${domain}': {`);
    for (const [language, importName] of Object.entries(languages)) {
      tsStandard.newLine(`'${language}': ${importName},`);
    }
    tsStandard.newLine("},");
  }
  tsStandard.newLine("}");
}
