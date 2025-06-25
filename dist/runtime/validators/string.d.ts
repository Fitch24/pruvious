import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input value is an email address.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * emailValidator({ value: 'foo@bar.baz' }) // OK
 * emailValidator({ value: 'foo@bar' })     // Throws
 * emailValidator({ value: null })          // Throws
 * ```
 */
export declare function emailValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input is a lowercase string.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * lowercaseValidator({ value: 'foo' }) // OK
 * lowercaseValidator({ value: 'Foo' }) // Throws
 * lowercaseValidator({ value: null })  // Throws
 * ```
 */
export declare function lowercaseValidator(context: Pick<FieldValidatorContext, '__' | 'language' | 'value'>, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a string.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * stringValidator({ value: '123' }) // OK
 * stringValidator({ value: null })  // Throws
 * stringValidator({ value: 123 })   // Throws
 * ```
 */
export declare function stringValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
/**
 * Validate if the provided input value is a string or `null`.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * stringOrNullValidator({ value: '123' }) // OK
 * stringOrNullValidator({ value: null })  // OK
 * stringOrNullValidator({ value: 123 })   // Throws
 * ```
 */
export declare function stringOrNullValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
