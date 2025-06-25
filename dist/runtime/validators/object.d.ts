import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input value is a normal object.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * objectValidator({ value: true }) // OK
 * objectValidator({ value: null }) // Throws
 * objectValidator({ value: 1 })    // Throws
 * ```
 */
export declare function objectValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a normal object or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * objectOrNullValidator({ value: true }) // OK
 * objectOrNullValidator({ value: null }) // OK
 * objectOrNullValidator({ value: 1 })    // Throws
 * ```
 */
export declare function objectOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
