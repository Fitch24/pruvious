import type { CastedFieldType, FieldOptions, MultiCollectionName, PopulatedFieldType, SelectableFieldName } from '#pruvious';
import type { PropType } from 'vue';
import type { PickFields } from '../../collections/query-builder.js';
import { type FieldAdditional } from '../field.definition.js';
declare const _default: import("#pruvious").ResolvedFieldDefinition;
export default _default;
/**
 * Create a new `record` field in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueField<CollectionName extends MultiCollectionName, ReturnableFieldName extends SelectableFieldName[CollectionName] = 'id', Populate extends boolean = false>(options: FieldOptions['record'] & {
    collection: CollectionName;
    fields?: PickFields<SelectableFieldName[CollectionName], ReturnableFieldName>;
    populate?: Populate;
}, additional?: FieldAdditional): PropType<Populate extends true ? Pick<PopulatedFieldType[CollectionName], ReturnableFieldName & keyof PopulatedFieldType[CollectionName]> | null : Pick<CastedFieldType[CollectionName], ReturnableFieldName & keyof CastedFieldType[CollectionName]> | null>;
/**
 * Create a new `record` subfield in a Vue block component.
 *
 * @param options - The field options.
 * @param additional - Additional field configurations.
 *
 * @returns The **populated** field type used to annotate a Vue `prop`.
 *
 * @see https://pruvious.com/docs/creating-blocks
 */
export declare function vueSubfield<CollectionName extends MultiCollectionName, ReturnableFieldName extends SelectableFieldName[CollectionName] = 'id', Populate extends boolean = false>(options: FieldOptions['record'] & {
    collection: CollectionName;
    fields?: PickFields<SelectableFieldName[CollectionName], ReturnableFieldName>;
    populate?: Populate;
}, additional?: FieldAdditional): Populate extends true ? Pick<PopulatedFieldType[CollectionName], ReturnableFieldName & keyof PopulatedFieldType[CollectionName]> | null : Pick<CastedFieldType[CollectionName], ReturnableFieldName & keyof CastedFieldType[CollectionName]> | null;
