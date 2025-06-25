/**
 * Execute functions in groups, returning a group-keyed object where the key represents the group
 * where an error occurred, and the value is the error message of the first function that threw an error.
 *
 * If an error occurs in a group, subsequent functions within the same group won't be called.
 *
 * @example
 * ```typescript
 * await catchFirstErrorMessage({
 *   foo: [() => valid(), () => invalid(), () => never()],
 *   bar: [async () => await validPromise()],
 * })
 * // Output: { foo: "Message from 'invalid' function" }
 * ```
 */
export declare function catchFirstErrorMessage<T extends string>(groups: Record<T, ((...args: any[]) => any | Promise<any>)[]>): Promise<Partial<Record<T, string>>>;
/**
 * Check if a `value` is a function.
 *
 * @example
 * ```typescript
 * isFunction(() => null) // true
 * isFunction({})         // false
 * ```
 */
export declare const isFunction: <T extends Function>(value: any) => value is T;
/**
 * Pause execution for the specified `milliseconds`.
 *
 * @example
 * ```typescript
 * await sleep(50)
 * ```
 */
export declare function sleep(milliseconds: number): Promise<void>;
