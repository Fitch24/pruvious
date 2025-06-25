import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input value is a real number.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * numberValidator({ value: 123 })   // OK
 * numberValidator({ value: 0 })     // OK
 * numberValidator({ value: null })  // Throws
 * numberValidator({ value: '123' }) // Throws
 * numberValidator({ value: NaN })   // Throws
 * ```
 */
export declare function numberValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a real number or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * numberOrNullValidator({ value: 123 })   // OK
 * numberOrNullValidator({ value: 0 })     // OK
 * numberOrNullValidator({ value: null })  // OK
 * numberOrNullValidator({ value: '123' }) // Throws
 * numberOrNullValidator({ value: NaN })   // Throws
 * ```
 */
export declare function numberOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is an integer.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * integerValidator({ value: 123 })  // OK
 * integerValidator({ value: 0 })    // OK
 * integerValidator({ value: null }) // Throws
 * integerValidator({ value: 0.25 }) // Throws
 * integerValidator({ value: NaN })  // Throws
 * ```
 */
export declare function integerValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is an integer or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * integerOrNullValidator({ value: 123 })  // OK
 * integerOrNullValidator({ value: 0 })    // OK
 * integerOrNullValidator({ value: null }) // OK
 * integerOrNullValidator({ value: 0.25 }) // Throws
 * integerOrNullValidator({ value: NaN })  // Throws
 * ```
 */
export declare function integerOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a positive integer.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * positiveIntegerValidator({ value: 123 })  // OK
 * positiveIntegerValidator({ value: 0 })    // Throws
 * positiveIntegerValidator({ value: null }) // Throws
 * positiveIntegerValidator({ value: 0.25 }) // Throws
 * positiveIntegerValidator({ value: NaN })  // Throws
 * ```
 */
export declare function positiveIntegerValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a positive integer or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * positiveIntegerOrNullValidator({ value: 123 })  // OK
 * positiveIntegerOrNullValidator({ value: null }) // OK
 * positiveIntegerOrNullValidator({ value: 0 })    // Throws
 * positiveIntegerOrNullValidator({ value: 0.25 }) // Throws
 * positiveIntegerOrNullValidator({ value: NaN })  // Throws
 * ```
 */
export declare function positiveIntegerOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
