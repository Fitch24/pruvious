import type { Field } from '#pruvious';
import type { CollectionFieldAdditional, ConditionalLogic, ConditionalRule } from '../fields/field.definition.js';
/**
 * Determines whether the specified `input` values meet the criteria defined by the given `conditionalLogic` of a `fieldPath`.
 * The `fieldPath` must be specified in dot notation (e.g., `fieldName`, `parent.fieldName`, `object.array[0].fieldName`, etc.).
 *
 * @throws An error if a field referenced in the conditional logic is not defined in the `input`.
 */
export declare function matchesConditionalLogic(input: Record<string, any>, fieldPath: string, conditionalLogic: ConditionalLogic | Record<string, ConditionalRule | boolean | number | string>): boolean;
/**
 * Resolves the conditional logic of a collection record using the default resolver.
 * Nested fields are supported for the `blocks` and `repeater` fields.
 */
export declare function resolveConditionalLogic(record: Record<string, any>, fields: Record<string, Pick<Field, 'options' | 'type'> & {
    additional: Pick<CollectionFieldAdditional, 'conditionalLogic'>;
}>, fieldNamePrefix?: string): Promise<Record<string, boolean>>;
