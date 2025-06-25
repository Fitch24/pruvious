import { type Ref } from '#imports';
import type { SupportedLanguage } from '#pruvious';
/**
 * Code representing the currently active language in the app.
 */
export declare const useLanguage: () => Ref<SupportedLanguage | null>;
/**
 * Retrieve the currently active language code for the Nuxt app.
 */
export declare function getLanguage(): SupportedLanguage;
/**
 * Set the active language code for the Nuxt app.
 *
 * @returns A promise resolving to `true` on success, `false` otherwise.
 */
export declare function setLanguage(languageCode: SupportedLanguage, options?: {
    /**
     * Controls whether translatable strings are reloaded upon language change.
     * This fetches missing strings for each domain in use, which can also be done manually with `loadTranslatableStrings()`.
     *
     * @default true
     */
    reloadTranslatableStrings?: boolean;
}): Promise<boolean>;
/**
 * Retrieve the preferred language code for the Nuxt app.
 *
 * Server side:
 * - Begins with checking the `Accept-Language` header.
 * - Falls back to the primary language if not resolved.
 *
 * On client side:
 * - Starts by checking the stored language option in local storage.
 * - If absent, attempts to determine it from `navigator.language`.
 * - Falls back to the primary language if no match with supported CMS languages.
 */
export declare function resolveLanguage(): SupportedLanguage;
