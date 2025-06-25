/**
 * Convert the input value to a boolean or retain the original value if it does not match any boolean-like representation.
 *
 * @example
 * ```typescript
 * booleanishSanitizer({ value: 1 })       // true
 * booleanishSanitizer({ value: 'false' }) // false
 * booleanishSanitizer({ value: 'YES' })   // true
 * booleanishSanitizer({ value: -1 })      // -1
 * ```
 */
export declare function booleanishSanitizer(context: {
    value: any;
}): any;
