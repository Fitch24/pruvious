/**
 * Remove duplicate values from an input array, or retain the original value if it's not an array.
 *
 * @example
 * ```typescript
 * uniqueArraySanitizer({ value: ['foo', 'foo'] }) // ['foo']
 * uniqueArraySanitizer({ value: [{}, {}] })       // [{}, {}]
 * uniqueArraySanitizer({ value: {} })             // {}
 * uniqueArraySanitizer({ value: true })           // true
 * ```
 */
export declare function uniqueArraySanitizer(context: {
    value: any;
}): any;
