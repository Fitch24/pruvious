/**
 * Get a unique string for a specified `prefix`.
 *
 * @example
 * ```typescript
 * pruviousUnique('foo') // 'foo'
 * pruviousUnique('foo') // 'foo-1'
 * pruviousUnique('foo') // 'foo-2'
 * pruviousUnique('bar') // 'bar'
 * ```
 */
export declare function pruviousUnique(prefix: string): string;
