import fs from "fs-extra";
import { resolveAppPath } from "../instances/path.js";
import { relativeImport } from "../utils/fs.js";
import { unifyLiteralStrings } from "../utils/typescript.js";
export async function generateIcons(ts, tsIcons) {
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const iconsPath = resolveAppPath("./icons");
  const icons = fs.existsSync(iconsPath) ? fs.readdirSync(iconsPath).filter((f) => f.endsWith(".vue")).map((f) => f.replace(/\.vue$/, "")) : [];
  ts.newDecl(`export const icons = [${icons.map((icon) => `'${icon}'`).join(", ")}]`);
  ts.newDecl(`export type Icon = ${unifyLiteralStrings(...icons)}`);
  tsIcons.newDecl(`// @ts-nocheck`).newLine(`import { defineAsyncComponent } from '#imports'`).newDecl(`export const iconImports = {`);
  for (const icon of icons) {
    const relativePath = relativeImport(dotPruviousPath, `${iconsPath}/${icon}.vue`);
    tsIcons.newLine(`'${icon}': () => defineAsyncComponent(() => import('${relativePath}')),`);
  }
  tsIcons.newLine("}");
}
