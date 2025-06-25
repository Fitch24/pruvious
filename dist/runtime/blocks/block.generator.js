import { resolveFieldPopulation } from "../fields/field.definition.js";
import { resolveAppPath, resolveModulePath } from "../instances/path.js";
import { toArray } from "../utils/array.js";
import { CodeGenerator } from "../utils/code-generator.js";
import { relativeImport, removeExcept, write } from "../utils/fs.js";
import { isString, uncapitalize } from "../utils/string.js";
import { unifyLiteralStrings } from "../utils/typescript.js";
import { resolveBlockDefinition } from "./block.resolver.js";
export function generateBlocks(blocks, ts, tsServer) {
  const blocksArray = Object.values(blocks);
  const tsBlocks = new CodeGenerator();
  const tsImports = new CodeGenerator();
  const dotPruviousPath = resolveAppPath("./.pruvious");
  const dotPruviousBlocksPath = resolveAppPath("./.pruvious/blocks");
  const definitionPath = resolveModulePath("./runtime/blocks/block.definition");
  ts.newDecl(`import type { BlockDefinition, Slot } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine(`import { defineBlock } from '${relativeImport(dotPruviousPath, definitionPath)}'`).newLine("export { type BlockDefinition, type Slot, defineBlock }");
  const walkerPath = resolveModulePath("./runtime/blocks/block.walker");
  tsServer.newDecl(`import { walkBlocks } from '${relativeImport(dotPruviousPath, walkerPath)}'`).newLine("export { walkBlocks }");
  ts.newDecl(`export type BlockName = ${unifyLiteralStrings(...Object.keys(blocks))}`);
  removeExcept(resolveAppPath("./.pruvious/blocks"), [
    ...blocksArray.map(({ definition }) => `${definition.name}.ts`),
    "index.ts",
    "imports.ts"
  ]);
  for (const { definition, code } of blocksArray) {
    write(resolveAppPath("./.pruvious/blocks", `${definition.name}.ts`), code);
  }
  for (const { definition } of blocksArray) {
    tsBlocks.newLine(`import { default as ${uncapitalize(definition.name)}Block } from './${definition.name}'`);
  }
  tsBlocks.newDecl("export const blocks = {");
  for (const { definition } of blocksArray) {
    tsBlocks.newLine(`${definition.name}: ${uncapitalize(definition.name)}Block,`);
  }
  tsBlocks.newLine("}");
  write(resolveAppPath("./.pruvious/blocks/index.ts"), tsBlocks.getContent());
  tsImports.newDecl(`// @ts-nocheck`).newLine(`import { defineAsyncComponent } from '#imports'`).newDecl(`export const blocks = {`);
  for (const { definition, source } of blocksArray) {
    const relativePath = relativeImport(dotPruviousBlocksPath, source);
    tsImports.newLine(`${definition.name}: () => defineAsyncComponent(() => import('${relativePath}')),`);
  }
  tsImports.newLine("}");
  write(resolveAppPath("./.pruvious/blocks/imports.ts"), tsImports.getContent());
}
export async function generateBlockTypes(blocks, fields, ts) {
  const definitions = [];
  const fieldsMap = Object.fromEntries(Object.entries(fields).map(([name, { definition }]) => [name, definition]));
  for (const block of Object.values(blocks)) {
    definitions.push(await resolveBlockDefinition(block));
  }
  ts.newDecl(`export type BlockInputData =`);
  if (definitions.length) {
    for (const [i, definition] of definitions.entries()) {
      ts.add(i === 0 ? ` {` : ` | {`).newLine(`/**`).newLine(` * The block name.`).newLine(` */`).newLine(`name: '${definition.name}'`).newLine().newLine(`/**`).newLine(` * The block fields.`).newLine(` */`).newLine(`fields: {`);
      for (const [fieldName, { options, type }] of Object.entries(definition.fields)) {
        const field = fields[type];
        const required = field.definition.inputMeta.required({
          definition: field.definition,
          name: fieldName,
          options
        });
        const codeComment = field.definition.inputMeta.codeComment({
          definition: field.definition,
          name: fieldName,
          options
        });
        if (codeComment && toArray(codeComment).length) {
          ts.newLine("/**");
          for (const line of toArray(codeComment)) {
            ts.newLine(` * ${line}`);
          }
          ts.newLine(" */");
        }
        const generatedType = isString(field.definition.inputMeta.type) ? field.definition.inputMeta.type : field.definition.inputMeta.type({
          definition: field.definition,
          fields: fieldsMap,
          name: fieldName,
          options
        });
        ts.newLine(`${fieldName}${required ? "" : "?"}: `);
        if (generatedType.includes("\n")) {
          for (const [i2, v] of generatedType.split("\n").entries()) {
            if (i2 === 0) {
              ts.add(v);
            } else {
              ts.newLine(v);
            }
          }
        } else {
          ts.add(generatedType);
        }
      }
      ts.newLine(`}`).newLine().newLine(`/**`).newLine(` * The block slots.`).newLine(` */`).newLine(`slots?: {`);
      for (const [slotName, { allowedChildBlocks }] of Object.entries(definition.slots ?? {})) {
        if (allowedChildBlocks && allowedChildBlocks !== "*") {
          ts.newLine(
            `'${slotName}': { block: BlockInputData & { name: ${unifyLiteralStrings(...allowedChildBlocks)} } }[],`
          );
        } else {
          ts.newLine(`'${slotName}': { block: BlockInputData }[],`);
        }
      }
      ts.newLine(`}`).newLine(`}`);
    }
  } else {
    ts.add(` never`);
  }
  ts.newDecl(`export type CastedBlockData =`);
  if (definitions.length) {
    for (const [i, definition] of definitions.entries()) {
      ts.add(i === 0 ? ` {` : ` | {`).newLine(`/**`).newLine(` * The block name.`).newLine(` */`).newLine(`name: '${definition.name}'`).newLine().newLine(`/**`).newLine(` * The block fields.`).newLine(` */`).newLine(`fields: {`);
      for (const [fieldName, { options, type }] of Object.entries(definition.fields)) {
        const field = fields[type];
        const codeComment = field.definition.inputMeta.codeComment({
          definition: field.definition,
          name: fieldName,
          options
        });
        if (codeComment && toArray(codeComment).length) {
          ts.newLine("/**");
          for (const line of toArray(codeComment)) {
            ts.newLine(` * ${line}`);
          }
          ts.newLine(" */");
        }
        const generatedType = field ? isString(field.definition.type.ts) ? field.definition.type.ts : field.definition.type.ts({ definition: field.definition, fields: fieldsMap, name: fieldName, options }) : "unknown";
        ts.newLine(`${fieldName}: `);
        if (generatedType.includes("\n")) {
          for (const [i2, v] of generatedType.split("\n").entries()) {
            if (i2 === 0) {
              ts.add(v);
            } else {
              ts.newLine(v);
            }
          }
        } else {
          ts.add(generatedType);
        }
      }
      ts.newLine(`}`).newLine().newLine(`/**`).newLine(` * The block slots.`).newLine(` */`).newLine(`slots?: {`);
      for (const [slotName, { allowedChildBlocks }] of Object.entries(definition.slots ?? {})) {
        if (allowedChildBlocks && allowedChildBlocks !== "*") {
          ts.newLine(
            `'${slotName}': { block: CastedBlockData & { name: ${unifyLiteralStrings(...allowedChildBlocks)} } }[],`
          );
        } else {
          ts.newLine(`'${slotName}': { block: CastedBlockData }[],`);
        }
      }
      ts.newLine(`}`).newLine(`}`);
    }
  } else {
    ts.add(` never`);
  }
  ts.newDecl(`export type PopulatedBlockData =`);
  if (definitions.length) {
    for (const [i, definition] of definitions.entries()) {
      ts.add(i === 0 ? ` {` : ` | {`).newLine(`/**`).newLine(` * The block name.`).newLine(` */`).newLine(`name: '${definition.name}'`).newLine().newLine(`/**`).newLine(` * The block fields.`).newLine(` */`).newLine(`fields: {`);
      for (const [fieldName, { options, type, additional }] of Object.entries(definition.fields)) {
        const field = fields[type];
        const population = additional?.population ? resolveFieldPopulation(additional.population) : field?.definition.population;
        const codeComment = field.definition.inputMeta.codeComment({
          definition: field.definition,
          name: fieldName,
          options
        });
        if (codeComment && toArray(codeComment).length) {
          ts.newLine("/**");
          for (const line of toArray(codeComment)) {
            ts.newLine(` * ${line}`);
          }
          ts.newLine(" */");
        }
        const generatedType = population ? isString(population.type.ts) ? population.type.ts : population.type.ts({ definition: field.definition, fields: fieldsMap, name: fieldName, options }) : field ? isString(field.definition.type.ts) ? field.definition.type.ts : field.definition.type.ts({ definition: field.definition, fields: fieldsMap, name: fieldName, options }) : "unknown";
        ts.newLine(`${fieldName}: `);
        if (generatedType.includes("\n")) {
          for (const [i2, v] of generatedType.split("\n").entries()) {
            if (i2 === 0) {
              ts.add(v);
            } else {
              ts.newLine(v);
            }
          }
        } else {
          ts.add(generatedType);
        }
      }
      ts.newLine(`}`).newLine().newLine(`/**`).newLine(` * The block slots.`).newLine(` */`).newLine(`slots?: {`);
      for (const [slotName, { allowedChildBlocks }] of Object.entries(definition.slots ?? {})) {
        if (allowedChildBlocks && allowedChildBlocks !== "*") {
          ts.newLine(
            `'${slotName}': { block: PopulatedBlockData & { name: ${unifyLiteralStrings(...allowedChildBlocks)} } }[],`
          );
        } else {
          ts.newLine(`'${slotName}': { block: PopulatedBlockData }[],`);
        }
      }
      ts.newLine(`}`).newLine(`}`);
    }
  } else {
    ts.add(` never`);
  }
}
