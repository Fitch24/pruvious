import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { CodeGenerator } from "../utils/code-generator.js";
import { relativeImport, removeExcept, write } from "../utils/fs.js";
import { camelCase } from "../utils/string.js";
import { unifyLiteralStrings } from "../utils/typescript.js";
export function generateLayouts(layouts, ts) {
  const layoutsArray = Object.values(layouts);
  const tsLayouts = new CodeGenerator();
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const definitionPath = resolveModulePath("./runtime/layouts/layout.definition");
  ts.newDecl(`import type { LayoutDefinition } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(
    "export { type LayoutDefinition }"
  );
  ts.newDecl(`import { defineLayout } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(
    "export { defineLayout }"
  );
  ts.newDecl(`export type LayoutName = ${unifyLiteralStrings(...Object.keys(layouts))}`);
  removeExcept(resolveAppPath("./.pruvious/layouts"), [
    ...layoutsArray.map(({ definition }) => `${definition.name}.ts`),
    "index.ts"
  ]);
  for (const { definition, code } of layoutsArray) {
    write(resolveAppPath("./.pruvious/layouts", `${definition.name}.ts`), code);
  }
  for (const { definition } of layoutsArray) {
    tsLayouts.newLine(`import { default as ${camelCase(definition.name)}Layout } from './${definition.name}'`);
  }
  tsLayouts.newDecl("export const layouts = {");
  for (const { definition } of layoutsArray) {
    tsLayouts.newLine(`'${definition.name}': ${camelCase(definition.name)}Layout,`);
  }
  tsLayouts.newLine("}");
  write(resolveAppPath("./.pruvious/layouts/index.ts"), tsLayouts.getContent());
}
