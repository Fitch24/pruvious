import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { relativeImport } from "../utils/fs.js";
export function generateHooks(hooks, ts, tsServer) {
  const hooksArray = Object.values(hooks);
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const structure = {};
  for (const [i, { definition }] of hooksArray.entries()) {
    structure[definition.collection] ||= {};
    structure[definition.collection][definition.action] ||= [];
    structure[definition.collection][definition.action].push(`hookDefinition${i + 1}`);
  }
  const definitionPath = resolveModulePath("./runtime/hooks/hook.definition");
  tsServer.newDecl(
    `export { applyHooksBeforeCreate, applyHooksAfterCreate, applyHooksBeforeRead, applyHooksAfterRead, applyHooksBeforeUpdate, applyHooksAfterUpdate, applyHooksBeforeDelete, applyHooksAfterDelete, applyHooksBeforeReturnRecord } from '${relativeImport(
      dotPruviousPath,
      resolveModulePath("./runtime/hooks/hook.utils")
    )}'`
  );
  ts.newDecl(`import { defineHook } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(
    "export { defineHook }"
  );
  for (const [i, { source }] of hooksArray.entries()) {
    const from = relativeImport(dotPruviousPath, source);
    tsServer.newDecl(`import { default as hookDefinition${i + 1} } from '${from}'`);
    tsServer.newLine(`export { hookDefinition${i + 1} }`);
  }
  tsServer.newDecl("export const hooks = {");
  for (const [collection, actions] of Object.entries(structure)) {
    tsServer.newLine(`'${collection}': {`);
    for (const [action, definitions] of Object.entries(actions)) {
      tsServer.newLine(`${action}: [${definitions.join(", ")}],`);
    }
    tsServer.newLine("},");
  }
  tsServer.newLine("}");
}
