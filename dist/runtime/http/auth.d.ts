import type { AuthUser } from '#pruvious';
import { type H3Event } from 'h3';
export interface TokenData {
    /**
     * The ID of the user to whom the token is issued.
     */
    userId: number;
    /**
     * The timestamp (in seconds since the Unix epoch) indicating when the token was issued.
     */
    iat: number;
    /**
     * The timestamp (in seconds since the Unix epoch) indicating the expiration date of the token.
     */
    exp: number;
}
/**
 * Delete expired tokens from the internal database table `_tokens`.
 *
 * @returns The number of deleted tokens.
 */
export declare function cleanExpiredTokens(): Promise<number>;
/**
 * Check if a token exists in the cache or the internal '_tokens' database table.
 * If found, return the token data, or `null` if not found.
 */
export declare function fetchToken(token: string): Promise<(TokenData & {
    token: string;
}) | null>;
/**
 * Get the `Bearer` token from the `Authorization` request header.
 *
 * If no token is available, an empty string is returned.
 */
export declare function getBearerToken(event: H3Event): string;
/**
 * Generate a new JSON Web Token (JWT) for a user with the given `userId`.
 *
 * The `expiresIn` parameter is expressed in seconds or a string describing a time span (e.g., 60, '2 minutes', '10h', '7d').
 *
 * @example
 * ```typescript
 * generateToken(1, '4 hours')
 * ```
 */
export declare function generateToken(userId: number, expiresIn: string | number): string;
/**
 * Delete a specific token from the database and cache.
 *
 * @returns `true` if the token is successfully deleted, `false` if not.
 */
export declare function removeToken(token: string): Promise<boolean>;
/**
 * Delete all stored tokens associated with a `userId`.
 *
 * @returns The number of deleted tokens.
 */
export declare function removeUserTokens(userId: number, except?: string): Promise<number>;
/**
 * Store a token into the internal database table `_tokens` and cache if possible.
 */
export declare function storeToken(token: string): Promise<void>;
/**
 * Verify a JSON Web Token (JWT) and return an object with the verification results.
 *
 * @returns An object with the verification results, including the following properties:
 * - `isValid` (boolean) - Indicates whether the token is valid or not.
 * - `user` (AuthUser|null) - The user record if the token is valid, or `null` if not.
 * - `tokenData` (TokenData|null) - The data extracted from the JWT if the token is valid, or `null` if not.
 *
 * @example
 * ```typescript
 * const { isValid, user, tokenData } = await verifyToken(token)
 * ```
 */
export declare function verifyToken(token: string): Promise<{
    isValid: true;
    user: AuthUser;
    tokenData: TokenData;
} | {
    isValid: false;
    user: null;
    tokenData: null;
}>;
