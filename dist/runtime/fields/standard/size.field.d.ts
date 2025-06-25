import { type FieldOptions, type SizeInput } from '#pruvious/preflight';
import type { PropType } from 'vue';
import { type FieldAdditional } from '../field.definition.js';
declare const _default: import("#pruvious/preflight").ResolvedFieldDefinition;
export default _default;
/**
 * Create a new `size` field in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueField<T extends string = 'width' | 'height'>(options?: FieldOptions['size'] & {
    inputs: Record<T, SizeInput>;
    default?: Record<T, {
        value: number;
        unit?: string;
    }>;
}, additional?: FieldAdditional): PropType<Record<T, {
    value: number;
    unit?: string;
}>>;
/**
 * Create a new `size` subfield in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueSubfield<T extends string = 'width' | 'height'>(options?: FieldOptions['size'] & {
    inputs: Record<T, SizeInput>;
    default?: Record<T, {
        value: number;
        unit?: string;
    }>;
}, additional?: FieldAdditional): Record<T, {
    value: number;
    unit?: string;
}>;
