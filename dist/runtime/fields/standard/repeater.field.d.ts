import type { FieldOptions, ResolvedFieldDefinition } from '#pruvious';
import type { PropType } from 'vue';
import { type FieldAdditional } from '../field.definition.js';
declare const _default: ResolvedFieldDefinition;
export default _default;
/**
 * Create a new `repeater` field in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueField<T extends Record<string, Array<any> | Boolean | Number | Object | String | null>>(options: Omit<FieldOptions['repeater'], 'subfields' | 'overrideType'> & {
    /**
     * An object of subfields that define the structure of each repeater entry.
     *
     * @example
     * ```typescript
     * {
     *   name: textField(),
     *   age: numberField({ required: true }),
     * }
     * ```
     */
    subfields: T;
    default?: Record<keyof T, any>[];
}, additional?: FieldAdditional): PropType<T[]>;
/**
 * Create a new `repeater` subfield in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueSubfield<T extends Record<string, Array<any> | Boolean | Number | Object | String | null>>(options: Omit<FieldOptions['repeater'], 'subfields' | 'overrideType'> & {
    /**
     * An object of subfields that define the structure of each repeater entry.
     *
     * @example
     * ```typescript
     * {
     *   name: textField(),
     *   age: numberField({ required: true }),
     * }
     * ```
     */
    subfields: T;
    default?: Record<keyof T, any>[];
}, additional?: FieldAdditional): T[];
