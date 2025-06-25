import { type Ref } from '#imports';
import type { AuthUser, CreateInput } from '#pruvious';
interface PruviousAuth {
    /**
     * Indicates whether the user is logged in.
     */
    isLoggedIn: boolean;
    /**
     * The ID of the currently logged-in user or `null` if the user is not authenticated.
     * The user is resolved from the JSON Web Token from the browser's local storage.
     */
    userId: number | null;
}
/**
 * The current Pruvious authentication state.
 */
export declare const useAuth: () => Ref<PruviousAuth>;
/**
 * Logs the user in with the given credentials.
 *
 * @returns The login response from the server.
 */
export declare function login(email: string, password: string, remember?: boolean): Promise<import("../utils/fetch").PruviousFetchResponse<string>>;
/**
 * Logs the user out from the current session.
 */
export declare function logout(): Promise<void>;
/**
 * Logs the user out from all sessions.
 *
 * @returns The number of sessions that were logged out.
 */
export declare function logoutAll(): Promise<number>;
/**
 * Logs the user out from all sessions except the current one.
 *
 * @returns The number of sessions that were logged out.
 */
export declare function logoutOtherSessions(): Promise<number>;
/**
 * Renews the current JSON Web Token.
 *
 * @returns The response from the server.
 */
export declare function renewToken(): Promise<import("../utils/fetch").PruviousFetchResponse<string>>;
/**
 * Fetches the current user profile.
 */
export declare function getUserProfile(): Promise<AuthUser | null>;
/**
 * Updates the current user profile.
 *
 * Note: The user must have the `update-profile` capability to be able to update their profile.
 *
 * @returns The response from the server.
 */
export declare function updateUserProfile(user: Partial<Omit<CreateInput['users'], 'capabilities' | 'email' | 'isActive' | 'isAdmin' | 'role'>>): Promise<import("../utils/fetch").PruviousFetchResponse<unknown>>;
export {};
