import type { CastedFieldType, FieldOptions, PopulatedFieldType, SelectableFieldName } from '#pruvious';
import type { PropType } from 'vue';
import type { PickFields } from '../../collections/query-builder.js';
import { type FieldAdditional } from '../field.definition.js';
declare const _default: import("#pruvious").ResolvedFieldDefinition;
export default _default;
/**
 * Create a new `file` field in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueField<ReturnableFieldName extends SelectableFieldName['uploads'] = 'directory' | 'filename', Populate extends boolean = false>(options?: FieldOptions['file'] & {
    fields?: PickFields<SelectableFieldName['uploads'], ReturnableFieldName>;
    populate?: Populate;
}, additional?: FieldAdditional): PropType<Populate extends true ? Pick<PopulatedFieldType["uploads"], ReturnableFieldName & keyof PopulatedFieldType["uploads"]> | null : Pick<CastedFieldType["uploads"], ReturnableFieldName & keyof CastedFieldType["uploads"]> | null>;
/**
 * Create a new `file` subfield in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueSubfield<ReturnableFieldName extends SelectableFieldName['uploads'] = 'directory' | 'filename', Populate extends boolean = false>(options?: FieldOptions['file'] & {
    fields?: PickFields<SelectableFieldName['uploads'], ReturnableFieldName>;
    populate?: Populate;
}, additional?: FieldAdditional): Populate extends true ? Pick<PopulatedFieldType["uploads"], ReturnableFieldName & keyof PopulatedFieldType["uploads"]> | null : Pick<CastedFieldType["uploads"], ReturnableFieldName & keyof CastedFieldType["uploads"]> | null;
