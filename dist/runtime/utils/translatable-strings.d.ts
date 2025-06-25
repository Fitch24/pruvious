import type { TranslatableStringsDefinition } from '../translatable-strings/translatable-strings.definition.js';
export interface TranslatableStringPatternToken {
    value: string;
    type: 'literal' | 'placeholder';
}
/**
 * Extracts alphanumeric placeholders following the dollar sign (`$`) from a translatable string pattern.
 *
 * To use a literal dollar sign, escape it with another dollar sign (e.g., `$$notPlaceholder`).
 *
 * @see https://pruvious.com/docs/translatable-strings
 *
 * @example
 * ```typescript
 * extractPlaceholders('foo $bar baz')  // ['bar']
 * extractPlaceholders('foo $$bar baz') // []
 * ```
 */
export declare function extractPlaceholders(pattern: string): string[];
/**
 * Replaces placeholders in a given `text` pattern with corresponding replacements or `input` values.
 *
 * @see https://pruvious.com/docs/translatable-strings
 *
 * @example
 * ```typescript
 * const strings: TranslatableStringsDefinition['strings'] = ...
 * replacePlaceholders('foo $bar', strings, { bar: 'baz' } }) // 'foo baz'
 * ```
 */
export declare function replacePlaceholders(text: string, strings: TranslatableStringsDefinition['strings'], input?: Record<string, boolean | number | string>): string;
/**
 * Tokenize placeholders from a translatable string pattern.
 *
 * @see https://pruvious.com/docs/translatable-strings
 *
 * @example
 * ```typescript
 * tokenizePlaceholders('foo $bar')
 * // [{ value: 'foo ', type: 'literal' }, { value: 'bar', type: 'placeholder' }]
 *
 * tokenizePlaceholders('foo $$bar')
 * // [{ value: 'foo $bar', type: 'literal' }]
 * ```
 */
export declare function tokenizePlaceholders(pattern: string): TranslatableStringPatternToken[];
