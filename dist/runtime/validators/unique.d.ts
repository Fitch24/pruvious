import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided field value is unique within the collection.
 *
 * This validation is performed during create and update operations, and it is capable of simultaneously processing multiple records.
 */
export declare function uniqueValidator(context: FieldValidatorContext, customErrorMessage?: string): Promise<void>;
