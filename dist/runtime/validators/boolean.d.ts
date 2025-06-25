import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input value is a boolean.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * booleanValidator({ value: true }) // OK
 * booleanValidator({ value: null }) // Throws
 * booleanValidator({ value: 1 })    // Throws
 * ```
 */
export declare function booleanValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a boolean or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * booleanOrNullValidator({ value: true }) // OK
 * booleanOrNullValidator({ value: null }) // OK
 * booleanOrNullValidator({ value: 1 })    // Throws
 * ```
 */
export declare function booleanOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
