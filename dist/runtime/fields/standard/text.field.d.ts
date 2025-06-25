import type { FieldOptions } from '#pruvious';
import type { PropType } from 'vue';
import { type FieldAdditional } from '../field.definition.js';
declare const _default: import("#pruvious").ResolvedFieldDefinition;
export default _default;
/**
 * Create a new `text` field in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueField(options?: Omit<FieldOptions['text'], 'overrideType'>, additional?: FieldAdditional): PropType<string>;
/**
 * Create a new `text` subfield in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueSubfield(options?: Omit<FieldOptions['text'], 'overrideType'>, additional?: FieldAdditional): string;
