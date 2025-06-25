import { type Arrayable, type Nullable } from '@antfu/utils';
export declare const collator: Intl.Collator;
/**
 * Remove all elements from an `array`.
 *
 * @example
 * ```typescript
 * clearArray(['foo']) // []
 * ```
 */
export declare function clearArray<T>(array: T[]): T[];
/**
 * Check if two arrays have identical unique values.
 *
 * @example
 * ```typescript
 * compareArrays(['foo', 'foo', 'bar'], ['bar', 'foo']) // true
 * ```
 */
export declare function compareArrays(array1: any[], array2: any[]): boolean;
/**
 * Get the unique difference between two arrays.
 *
 * @example
 * ```typescript
 * diffArrays(['foo'], ['bar', 'bar']) // ['foo', 'bar']
 * ```
 */
export declare function diffArrays<T>(array1: T[], array2: T[]): T[];
/**
 * Compute the intersection of two arrays. Duplicated values are removed from the returned array.
 *
 * @example
 * ```typescript
 * intersectArrays(['foo', 'foo', 'bar'], ['foo', 'foo']) // ['foo']
 * ```
 */
export declare function intersectArrays<T>(array1: T[], array2: T[]): T[];
/**
 * Check if a `value` is an array.
 *
 * @example
 * ```typescript
 * isObject([])   // true
 * isObject({})   // false
 * isObject(null) // false
 * ```
 */
export declare function isArray(array: any): array is any[];
/**
 * Get the last element of a non-empty array.
 *
 * @example
 * ```typescript
 * last(['foo', 'bar', 'baz']) // 'baz'
 * ```
 */
export declare function last<T>(array: T[]): T;
/**
 * Search for items in an array based on provided keywords.
 *
 * @param array The array to search.
 * @param keywords The keywords to search for. If a string is provided, it will be split into keywords. If an array is provided, it will be used as is.
 * @param props If provided, search will be performed on the specified properties of the items in the array, and items must be objects. If not provided, items themselves are treated as strings.
 *
 * @returns An array of items sorted by relevance. Relevance is calculated based on the number of occurrences of the keywords in the item/property and the position of the first occurrence.
 *
 * @example
 * ```typescript
 * searchByKeywords(['foo', 'bar'], 'FOO') // ['foo']
 * searchByKeywords([{ foo: 'foo' }, { foo: 'bar' }], 'FOO', 'foo') // [{ foo: 'foo' }]
 * ```
 */
export declare function searchByKeywords<T>(array: T[], keywords: string | string[], props?: string | string[]): T[];
/**
 * Sort an `array` in natural order.
 *
 * @example
 * ```typescript
 * sortNatural(['11', '1']) // ['1', '11']
 * ```
 */
export declare function sortNatural(array: string[]): string[];
/**
 * Sort an `array` in natural order by a `prop`.
 *
 * @example
 * ```typescript
 * sortNatural([{ foo: '11' }, { foo: '1' }]) // [{ foo: '1' }, { foo: '11' }]
 * ```
 */
export declare function sortNaturalByProp<T extends {
    [prop: string]: any;
} & Partial<Record<K, string | undefined>>, K extends keyof T>(array: T[], prop: K): T[];
/**
 * Convert `Arrayable<T>` to `Array<T>`.
 *
 * @example
 * ```typescript
 * toArray('foo') // ['foo']
 * ```
 */
export declare const toArray: <T>(array?: Nullable<Arrayable<T>>) => Array<T>;
/**
 * Get the element after `el` in an `array`.
 *
 * @example
 * ```typescript
 * next('foo', ['foo', 'bar']) // 'bar'
 * ```
 */
export declare function next<T, K extends keyof T>(el: T, array: T[], prop?: K): T | undefined;
/**
 * Get the element at index `n` of an `array`. If `n` is negative, the nth element from the end is returned.
 *
 * @example
 * ```typescript
 * nth(['foo', 'bar'], 2) // 'foo'
 * ```
 */
export declare function nth<T>(array: T[], n: number): T;
/**
 * Get the normalized index at index `n` of an `array`. If `n` is negative, the nth normalized index from the end is returned.
 *
 * @example
 * ```typescript
 * nth(['foo', 'bar'], 2) // 0
 * ```
 */
export declare function nthIndex<T>(array: T[], n: number): number;
/**
 * Get the element before `el` in an `array`.
 *
 * @example
 * ```typescript
 * prev('bar', ['foo', 'bar']) // 'foo'
 * ```
 */
export declare function prev<T, K extends keyof T>(el: T, array: T[], prop?: K): T | undefined;
/**
 * Remove duplicate values from an `array`.
 *
 * Note: This function does not mutate the input `array`.
 *
 * @example
 * ```typescript
 * uniqueArray(['foo', 'foo', 'bar']) // ['foo', 'bar']
 * uniqueArray([{}, {}]) // [{}, {}]
 * ```
 */
export declare const uniqueArray: <T>(array: T[]) => T[];
