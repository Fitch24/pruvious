import { type Ref } from '#imports';
import type { AuthUser, CreateInput, Field, SupportedLanguage } from '#pruvious';
import type { NitroFetchOptions } from 'nitropack';
import type { PruviousPage } from '../composables/page.js';
import type { TranslatableStringsDefinition } from '../translatable-strings/translatable-strings.definition.js';
export type PruviousFetchResponse<T extends any> = {
    /**
     * Represents the success state of the fetch request.
     */
    success: true;
    /**
     * The response code.
     */
    code: number;
    /**
     * The response data.
     */
    data: T;
} | {
    /**
     * Represents the success state of the fetch request.
     */
    success: false;
    /**
     * The response code.
     */
    code: number;
    /**
     * Contains the response error, which can be either a string message or a key-value object.
     * If it's an object, the keys typically represent field names, and the values are error messages.
     */
    error: string | Record<string, string>;
};
export type PruviousApiPath = 'clear-cache.post' | 'dashboard.get' | 'install.post' | 'installed.get' | 'login.post' | 'logout.post' | 'logout-all.post' | 'logout-others.post' | 'pages.get' | 'previews.get' | 'profile.get' | 'profile.patch' | 'renew-token.post' | 'translatable-strings.get';
export type PruviousFetchOptions = Omit<NitroFetchOptions<any>, 'body' | 'params' | 'query'> & {
    /**
     * Subpath to add to the API route.
     */
    subpath?: string;
    /**
     * Whether to dispatch the following events on the `window` object:
     *
     * - `pruvious-fetch-start`
     * - `pruvious-fetch-unauthorized`
     * - `pruvious-fetch-error`
     * - `pruvious-fetch-end`
     */
    dispatchEvents?: boolean;
};
/**
 * Wrapper for `$fetch` for Pruvious API route requests.
 *
 * @example
 * ```typescript
 * const response = await pruviousFetch('login.post', { email: '...', password: '...' })
 *
 * if (response.success) {
 *   console.log(response.data)
 * } else {
 *   console.log(response.error)
 * }
 * ```
 */
export declare function pruviousFetch<Data = {
    fields: Record<Field['type'], string>;
}>(path: 'clear-cache.post', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = {
    fields: Record<Field['type'], string>;
}>(path: 'dashboard.get', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = string>(path: 'install.post', options: {
    body: {
        firstName?: string | Ref<string>;
        lastName?: string | Ref<string>;
        email: string | Ref<string>;
        password: string | Ref<string>;
    };
} & PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = boolean>(path: 'installed.get', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = string>(path: 'login.post', options: {
    body: {
        email: string | Ref<string>;
        password: string | Ref<string>;
        remember?: boolean | Ref<boolean>;
    };
} & PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = undefined>(path: 'logout.post', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = number>(path: 'logout-all.post', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = number>(path: 'logout-others.post', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = PruviousPage>(path: 'pages.get', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = PruviousPage>(path: 'previews.get', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = AuthUser>(path: 'profile.get', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = AuthUser>(path: 'profile.patch', options: {
    body: Omit<CreateInput['users'], 'capabilities' | 'email' | 'isActive' | 'isAdmin' | 'role'>;
} & PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = string>(path: 'renew-token.post', options?: PruviousFetchOptions): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data = TranslatableStringsDefinition['strings']>(path: 'translatable-strings.get', options?: PruviousFetchOptions & {
    query: {
        language: SupportedLanguage;
    };
}): Promise<PruviousFetchResponse<Data>>;
export declare function pruviousFetch<Data>(path: string, options?: PruviousFetchOptions & NitroFetchOptions<any>): Promise<PruviousFetchResponse<Data>>;
/**
 * Generates API route paths for various endpoints.
 *
 * @example
 * ```typescript
 * pruviousApiPath('login.post') // Output: '/api/login'
 * ```
 */
export declare function pruviousApiPath(base: 'clear-cache.post' | 'dashboard.get' | 'install.post' | 'installed.get' | 'login.post' | 'logout.post' | 'logout-all.post' | 'logout-others.post' | 'pages.get' | 'previews.get' | 'profile.get' | 'profile.patch' | 'renew-token.post' | 'translatable-strings.get' | string): string;
