import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input value is an array.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * arrayValidator({ value: [] })   // OK
 * arrayValidator({ value: null }) // Throws
 * arrayValidator({ value: {} })   // Throws
 * ```
 */
export declare function arrayValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is an array or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * arrayOrNullValidator({ value: [] })   // OK
 * arrayOrNullValidator({ value: null }) // OK
 * arrayOrNullValidator({ value: {} })   // Throws
 * ```
 */
export declare function arrayOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
