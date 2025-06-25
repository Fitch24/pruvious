import { type Ref } from '#imports';
export interface PruviousToken {
    /**
     * The JSON Web Token.
     */
    token: string;
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
 * The current JSON Web Token, including the token string, user ID, issue timestamp, and expiration timestamp.
 * Returns `null` if no token is available.
 */
export declare const useToken: () => Ref<PruviousToken | null>;
/**
 * Read the raw JSON Web Token from the local storage.
 */
export declare function getRawToken(): string | null;
/**
 * Read the JSON Web Token from the local storage.
 */
export declare function getToken(): PruviousToken | null;
/**
 * Delete the JSON Web Token from the local storage.
 */
export declare function removeToken(): void;
/**
 * Store the JSON Web Token in local storage.
 */
export declare function setToken(token: string): void;
