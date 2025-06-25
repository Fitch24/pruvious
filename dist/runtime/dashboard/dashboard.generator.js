import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { relativeDotPruviousImport, relativeImport } from "../utils/fs.js";
import { slugify } from "../utils/slugify.js";
import { camelCase } from "../utils/string.js";
export function generateDashboardPages(dashboardPages, ts, tsServer, tsDashboard) {
  const dashboardPagesArray = Object.values(dashboardPages);
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const definitionPath = resolveModulePath("./runtime/dashboard/dashboard.definition");
  ts.newDecl(
    `import type { DashboardPageDefinition, ResolvedDashboardPageDefinition } from '${relativeImport(
      dotPruviousPath,
      definitionPath
    )}'`
  ).newLine("export { type DashboardPageDefinition, type ResolvedDashboardPageDefinition }");
  ts.newLine(`import { defineDashboardPage } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(
    "export { defineDashboardPage }"
  );
  tsDashboard.newDecl(`export const dashboardPageComponentImports = {`);
  for (const { definition, source } of dashboardPagesArray) {
    tsDashboard.newLine(
      `'${definition.path}': () => import('${relativeDotPruviousImport(resolveAppPath(definition.vueComponent))}'),`
    );
  }
  tsDashboard.newLine(`}`);
  for (const { definition, source } of dashboardPagesArray) {
    const from = relativeImport(dotPruviousPath, source);
    tsServer.newDecl(
      `import { default as ${camelCase(slugify(definition.path))}DashboardPageDefinition } from '${from}'`
    );
    tsServer.newLine(`export { ${camelCase(slugify(definition.path))}DashboardPageDefinition }`);
  }
  tsServer.newDecl("export const dashboardPages = {");
  for (const { definition } of dashboardPagesArray) {
    tsServer.newLine(`'${definition.path}': ${camelCase(slugify(definition.path))}DashboardPageDefinition,`);
  }
  tsServer.newLine("}");
}
