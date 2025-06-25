import type { FieldValidatorContext } from '../fields/field.definition.js';
/**
 * Validate if the provided input value meets the required conditions based on its type.
 *
 * Note: A type validator (e.g., `booleanValidator`, `stringValidator`, etc.) should be called after
 * `requiredValidator` to ensure accurate error messaging.
 *
 * @throws Throws an error if the validation fails.
 *
 * @example
 * ```typescript
 * // Array type examples
 * requiredValidator({ value: [1, 2, 3] })   // OK - Non-empty array
 * requiredValidator({ value: [] })          // Throws - Empty array
 *
 * // Boolean type examples
 * requiredValidator({ value: true })        // OK - Boolean true
 * requiredValidator({ value: false })       // Throws - Boolean false
 *
 * // Number type examples
 * requiredValidator({ value: 0 })           // OK - A real number
 * requiredValidator({ value: NaN })         // Throws - Not a real number
 *
 * // Object type examples
 * requiredValidator({ value: {} })          // OK - A normal object
 * requiredValidator({ value: null })        // Throws - A null-prototype object
 *
 * // String type examples
 * requiredValidator({ value: 'Hello' })     // OK - Non-empty string
 * requiredValidator({ value: '' })          // Throws - Empty string
 *
 * // Undefined type example
 * requiredValidator({ value: undefined })   // Throws - Undefined
 * ```
 */
export declare function requiredValidator(context: Pick<FieldValidatorContext, '__' | 'language' | 'value'>, customErrorMessage?: string): void;
