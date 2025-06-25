import { type Ref } from '#imports';
import type { PublicTranslatableStringsDomain, SupportedLanguage, TranslatableStringsDomain, TranslatableStringsInput, TranslatableStringsTextKey } from '#pruvious';
import type { TranslatableStringsDefinition } from '../translatable-strings/translatable-strings.definition.js';
/**
 * Cached translatable strings.
 */
export declare const useTranslatableStrings: () => Ref<Partial<Record<TranslatableStringsDomain, Record<string, {
    strings: TranslatableStringsDefinition['strings'] | 'pending';
    cache: Record<string, string>;
}>>>>;
/**
 * Fetch and display translated `text` from the specified `domain` in the current language.
 * This function is designed for **Vue** applications.
 * For server-side use, import the same-named function from `#pruvious/server`.
 *
 * The current language is stored in the browser's local storage.
 * If the translation is not found in the current language, a fallback in the primary language is provided.
 *
 * @see https://pruvious.com/docs/translatable-strings
 *
 * @example
 * ```typescript
 * __('blog', 'Displayed: $count $entries', { count: 1 }) // 'Displayed: 1 post
 * __('blog', 'Displayed: $count $entries', { count: 2 }) // 'Displayed: 2 posts
 * ```
 */
export declare function __<D extends PublicTranslatableStringsDomain, K extends TranslatableStringsTextKey[D]>(domain: D, text: K): string;
export declare function __<D extends PublicTranslatableStringsDomain, K extends keyof TranslatableStringsInput[D]>(domain: D, text: K, input: TranslatableStringsInput[D][K & keyof TranslatableStringsInput[D]]): string;
/**
 * Fetch and display translated `text` from the `default` domain in the current language.
 * This function is designed for **Vue** applications.
 * For server-side use, import the same-named function from `#pruvious/server`.
 *
 * The current language is stored in the browser's local storage.
 * If the translation is not found in the current language, a fallback in the primary language is provided.
 *
 * @see https://pruvious.com/docs/translatable-strings
 *
 * @example
 * ```typescript
 * _('Welcome, $name', { name: 'Padawan' })
 *
 * // Same as:
 * __('default', 'Welcome, $name', { name: 'Padawan' })
 * ```
 */
export declare function _<K extends TranslatableStringsTextKey['default']>(text: K): string;
export declare function _<K extends keyof TranslatableStringsInput['default']>(text: K, input: TranslatableStringsInput['default'][K & keyof TranslatableStringsInput['default']]): string;
/**
 * Loads translatable strings for a specified `domain` (defaults to `default`).
 * If `language` is not provided, it is automatically detected.
 *
 * @see https://previous.com/docs/translatable-strings
 */
export declare function loadTranslatableStrings(domain?: PublicTranslatableStringsDomain | PublicTranslatableStringsDomain[], language?: SupportedLanguage): Promise<void>;
