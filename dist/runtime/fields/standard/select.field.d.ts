import type { FieldOptions } from '#pruvious';
import type { PropType } from 'vue';
import { type FieldAdditional } from '../field.definition.js';
declare const _default: import("#pruvious").ResolvedFieldDefinition;
export default _default;
/**
 * Create a new `select` field in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueField<T, S extends T>(options: Omit<FieldOptions['select'], 'overrideType'> & {
    choices: Record<T, string>;
    default?: S & string;
}, additional?: FieldAdditional): PropType<T & string>;
/**
 * Create a new `select` subfield in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueSubfield<T, S extends T>(options: Omit<FieldOptions['select'], 'overrideType'> & {
    choices: Record<T, string>;
    default?: S & string;
}, additional?: FieldAdditional): T & string;
