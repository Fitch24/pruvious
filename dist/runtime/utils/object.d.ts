import { type DeepMerge } from '@antfu/utils';
/**
 * Delete all entries of an `object`.
 *
 * @example
 * ```typescript
 * clearObject({ foo: 'bar' }) // {}
 * ```
 */
export declare function clearObject<T extends Record<string, any>>(object: T): T;
/**
 * Create a deep clone of an `object`.
 *
 * Note: It does not clone functions.
 *
 * @example
 * ```typescript
 * const original = { foo: { bar: 1 } }
 * const clone = deepClone(original)
 * console.log(clone) // { foo: { bar: 1 } }
 * console.log(original === clone) // false
 * ```
 */
export declare function deepClone<T extends Record<string, any>>(object: T): T;
/**
 * Perform a deep merge of objects.
 *
 * The first argument is the `target` object, and the rest are the `sources`.
 * The `target` object will be mutated and returned.
 *
 * @example
 * ```typescript
 * deepMerge({ foo: { bar: 1 } }, { foo: { baz: 2 } })
 * // Output: { foo: { bar: 1, baz: 2 } }
 * ```
 */
export declare const deepMerge: <T extends object = object, S extends object = T>(target: T, ...sources: S[]) => DeepMerge<T, S>;
/**
 * Delete an `object` property at the given `path`.
 *
 * @example
 * ```typescript
 * deleteProperty({ foo: { bar: 'baz' }}, 'foo.bar') // true
 * deleteProperty({ foo: ['bar', 'baz']}, 'foo.1')   // true
 * deleteProperty({ foo: { bar: 'baz' }}, 'bar')     // false
 * ```
 */
export declare function deleteProperty(object: Record<string, any>, path: string): any;
/**
 * Get the value of an `object` property at the given `path`.
 *
 * @example
 * ```typescript
 * getProperty({ foo: { bar: 'baz' }}, 'foo.bar') // 'baz'
 * getProperty({ foo: ['bar', 'baz']}, 'foo.1')   // 'baz'
 * getProperty({ foo: { bar: 'baz' }}, 'bar')     // undefined
 * ```
 */
export declare function getProperty<T extends any>(object: Record<string, any>, path: string): T;
/**
 * Verify if an `object` includes the given `key`.
 *
 * @example
 * ```typescript
 * isKeyOf({ foo: 'bar' }, 'foo') // true
 * isKeyOf({ foo: 'bar' }, 'bar') // false
 * ```
 */
export declare function isKeyOf<T extends object>(object: T, key: keyof any): key is keyof T;
/**
 * Check if a `value` is a normal object.
 *
 * @example
 * ```typescript
 * isObject({})   // true
 * isObject([])   // false
 * isObject(null) // false
 * ```
 */
export declare const isObject: <T extends object>(value: any) => value is T;
/**
 * Recursively assign default properties with priority given to leftmost arguments.
 *
 * Note: This is a customized `defu` merger that avoids merging arrays.
 *
 * @see https://github.com/unjs/defu
 *
 * @example
 * ```typescript
 * mergeDefaults({ foo: { bar: 1 } }, { foo: { baz: 2 } })
 * // Output: { foo: { bar: 1, baz: 2} }
 * ```
 */
export declare const mergeDefaults: <Source extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}, Defaults extends Array<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} | (number | boolean | any[] | Record<never, any> | null | undefined)>>(source: Source, ...defaults: Defaults) => import("defu").Defu<Source, Defaults>;
/**
 * Create a new subset object by omitting the specified `keys`.
 *
 * @example
 * ```typescript
 * objectOmit({ foo: 'bar', baz: 'qux' }, ['baz']) // { foo: 'bar' }
 * ```
 */
export declare function objectOmit<O extends object, T extends keyof O>(object: O, keys: T[]): Omit<O, T>;
/**
 * Create a new subset object with the specified `keys`.
 *
 * @example
 * ```typescript
 * objectPick({ foo: 'bar', baz: 'qux' }, ['foo']) // { foo: 'bar' }
 * ```
 */
export declare const objectPick: <O extends object, T extends keyof O>(object: O, keys: T[]) => Pick<O, T>;
/**
 * Set an `object` property at the given `path` to the given `value`.
 *
 * @example
 * ```typescript
 * setProperty({ foo: {}}, 'foo.bar', { bar: 'baz' }) // { foo: { bar: 'baz' } }
 * setProperty({ foo: ['bar']}, 'foo.1', 'baz)        // { foo: ['bar', 'baz'] }
 * ```
 */
export declare function setProperty<T extends Record<string, any>>(object: T, path: string, value: any): T;
/**
 * Convert property names of an `object` to snake case.
 *
 * Note: This function mutates the original object.
 *
 * @example
 * ```typescript
 * snakeCasePropNames({ fooBar: 'baz' }) // { foo_bar: 'baz' }
 * ```
 */
export declare function snakeCasePropNames(object: object): object;
/**
 * Creates a new object with symbol keys converted to string keys, while keeping the original `object` unchanged.
 *
 * @example
 * ```typescript
 * stringifySymbols({ [Op.and]: [] }) // { 'Symbol(and)': [] }
 * ```
 */
export declare function stringifySymbols(object: object): object;
/**
 * A generator function that walks through the properties of an `object` and yields key-value pairs.
 */
export declare function walkObject(object: object): IterableIterator<{
    key: number | string | symbol;
    value: any;
    parent: object;
}>;
