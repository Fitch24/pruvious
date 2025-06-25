/**
 * Get the number of decimal places in a number.
 *
 * @example
 * ```typescript
 * countDecimals(1)    // 0
 * countDecimals(1.5)  // 1
 * countDecimals(1.25) // 2
 * ```
 */
export declare function countDecimals(value: number): number;
/**
 * Check if a `value` is an integer.
 *
 * @example
 * ```typescript
 * isInteger(1) // true
 * isInteger(0) // true
 * isInteger(-1) // true
 * isInteger(1.5) // false
 * isInteger('1') // false
 * ```
 */
export declare function isInteger(value: any): value is number;
/**
 * Check if a `value` is a number.
 *
 * @example
 * ```typescript
 * isNumber(1)        // true
 * isNumber(NaN)      // true
 * isNumber(Infinity) // true
 * isNumber('1')      // false
 * ```
 */
export declare const isNumber: (value: any) => value is number;
/**
 * Check if a `value` is a positive integer.
 *
 * @example
 * ```typescript
 * isPositiveInteger(1) // true
 * isPositiveInteger(0) // false
 * isPositiveInteger(-1) // false
 * isPositiveInteger(1.5) // false
 * isPositiveInteger('1') // false
 * ```
 */
export declare function isPositiveInteger(value: any): value is number;
/**
 * Check if a `value` is a real number.
 *
 * @example
 * ```typescript
 * isRealNumber(1) // true
 * isRealNumber('1') // false
 * isRealNumber(NaN) // false
 * ```
 */
export declare function isRealNumber(value: any): value is number;
