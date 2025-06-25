import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input is defined.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * presentValidator({ value: 'foo' })     // OK
 * presentValidator({ value: null })      // OK
 * presentValidator({ value: undefined }) // Throws
 * ```
 */
export declare function presentValidator(context: {
    __?: FieldValidatorContext['__'];
    language?: FieldValidatorContext['language'];
    value: any;
}, customErrorMessage?: string): void;
