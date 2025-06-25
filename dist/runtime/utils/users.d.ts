import type { AuthUser, UserCapability } from '#pruvious';
/**
 * Generate a key-value object by combining capabilities from both the `user` and their assigned role.
 * Each capability is represented as a key, and set to `true`.
 *
 * @example
 * ```typescript
 * getCapabilities(user) // Example: { 'collection-products-read': true }
 * ```
 */
export declare function getCapabilities(user: AuthUser | null): Partial<Record<UserCapability, true>>;
/**
 * Check if the `user` has the specified `capability`.
 *
 * Optionally, you can also check for multiple capabilities at once.
 *
 * @example
 * ```typescript
 * hasCapability(user, 'collection-products-read') // true
 * hasCapability(user, 'collection-products-read', 'access-dashboard') // true
 * ```
 */
export declare function hasCapability(user: AuthUser | null, capability: UserCapability, ...capabilities: UserCapability[]): boolean;
