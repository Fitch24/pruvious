import { CodeGenerator } from '../utils/code-generator.js';
import type { ResolvedFieldDefinition } from './field.definition.js';
import { type ResolvedField } from './field.resolver.js';
export declare function generateFields(fields: Record<string, ResolvedField>, ts: CodeGenerator, tsServer: CodeGenerator, tsStandard: CodeGenerator, tsDashboard: CodeGenerator): void;
/**
 * Write a function that accepts predefined field `options` and returns the **populated** field `type`.
 *
 * The function name is generated from the camel-cased field `name` and `'Field'` suffix.
 * Example: video => videoField(), time-range => timeRangeField(), etc.
 *
 * The generated function is intented to be used in Vue block components to define prop types.
 *
 * See the `defineField()` function and `FieldConfig` type for more information.
 */
export declare function generateVueField(field: ResolvedFieldDefinition, ts: CodeGenerator): void;
/**
 * Write a function that accepts predefined field `options` and returns the **populated** field `type`.
 *
 * The function name is generated from the camel-cased field `name` and `'Subfield'` suffix.
 * Example: video => videoSubfield(), time-range => timeRangeSubfield(), etc.
 *
 * The generated function is intented to be used in Vue block components to define subfields in prop fields.
 *
 * See the `defineField()` function and `FieldConfig` type for more information.
 */
export declare function generateVueSubfield(field: ResolvedFieldDefinition, ts: CodeGenerator): void;
/**
 * Write a function that accepts field options and returns an object used to identify block fields.
 *
 * The function name is generated from the camel-cased field `name` and the `'FieldTrap'` suffix.
 * Example: video => videoFieldTrap(), time-range => timeRangeFieldTrap(), etc.
 *
 * Note: The generated function is intented for internal use.
 */
export declare function generateFieldTrap(field: ResolvedFieldDefinition, ts: CodeGenerator): void;
