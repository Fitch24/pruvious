/**
 * Convert a `value` string to camel case.
 *
 * @example
 * ```typescript
 * camelCase('foo-bar') // 'fooBar'
 * ```
 */
export declare function camelCase(value: string): string;
/**
 * Uppercase the first letter of a string `value`.
 *
 * @example
 * ```typescript
 * capitalize('foo')            // 'Foo'
 * capitalize('foo Bar')        // 'Foo bar'
 * capitalize('foo Bar', false) // 'Foo Bar'
 * ```
 */
export declare function capitalize(value: string, lowercaseRest?: boolean): string;
/**
 * Extract keywords from a given `value` by splitting and lowercasing them into separate words.
 *
 * @example
 * ```typescript
 * extractKeywords('foo bar')    // ['foo', 'bar']
 * extractKeywords(' Foo  BAR ') // ['foo', 'bar']
 * ```
 */
export declare function extractKeywords(value: string): string[];
/**
 * Check whether a given `character` is alphanumeric (either a letter or a digit).
 *
 * @example
 * ```typescript
 * isAlphanumeric('A') // true
 * isAlphanumeric('1') // true
 * isAlphanumeric('?') // false
 * ```
 */
export declare function isAlphanumeric(character: string): boolean;
/**
 * Check if a string `value` consist of alphanumeric characters where each word starts with an uppercase letter
 * and has no spaces or special characters.
 *
 * @example
 * ```typescript
 * isPascalCase('Foo')    // true
 * isPascalCase('FooBar') // true
 * isPascalCase('foo')    // false
 * isPascalCase('fooBar') // false
 * isPascalCase('123')    // false
 * ```
 */
export declare function isPascalCase(value: any): boolean;
/**
 * Check if a string `value` contains only lowercase alphanumeric characters and hyphens.
 *
 * Additionally, ensure that it begins with a letter, ends with an alphanumeric character,
 * and does not contain two consecutive hyphens.
 *
 * @example
 * ```typescript
 * isSafeSlug('foo')     // true
 * isSafeSlug('foo-bar') // true
 * isSafeSlug('Foo')     // false
 * isSafeSlug('fooBar')  // false
 * isSafeSlug('123')     // false
 * ```
 */
export declare function isSafeSlug(value: any): boolean;
/**
 * Check if a string `value` contains only lowercase alphanumeric characters and hyphens.
 *
 * Additionally, ensure that it starts and ends with an alphanumeric character,
 * and does not contain two consecutive hyphens.
 *
 * @example
 * ```typescript
 * isSlug('foo')     // true
 * isSlug('foo-bar') // true
 * isSlug('123')     // true
 * isSlug('Foo')     // false
 * isSlug('fooBar')  // false
 * ```
 */
export declare function isSlug(value: any): boolean;
/**
 * Check if a `value` is a string.
 *
 * @example
 * ```typescript
 * isString('') // true
 * isString(1)  // false
 * ```
 */
export declare const isString: (value: any) => value is string;
/**
 * Check if a string `value` is a valid URL.
 *
 * @example
 * isUrl('http://foo.bar') // true
 * isUrl('foo.bar')        // false
 */
export declare function isUrl(value: string): boolean;
/**
 * Check if a string `value` is a valid URL pathname.
 * If `allowRelative` is `true`, also allow relative paths.
 *
 * @example
 * ```typescript
 * isUrlPath('/foo')      // true
 * isUrlPath('foo')       // false
 * isUrlPath('foo', true) // true
 * ```
 */
export declare function isUrlPath(value: string, allowRelative?: boolean): boolean;
/**
 * Create a normalized API route based on the given route `parts`.
 *
 * @example
 * ```typescript
 * joinRouteParts('foo', 'bar') // '/foo/bar'
 * joinRouteParts('/foo/', '', 'bar/') // '/foo/bar'
 * joinRouteParts('foo', 'bar//baz') // '/foo/bar/baz'
 * ```
 */
export declare function joinRouteParts(...parts: string[]): string;
/**
 * Convert a `value` string to kebab case.
 *
 * @example
 * ```typescript
 * kebabCase('foo_bar') // 'foo-bar'
 * ```
 */
export declare function kebabCase(value: string): string;
/**
 * Convert a `value` string to pascal case.
 *
 * @example
 * ```typescript
 * pascalCase('foo-bar') // 'FooBar'
 * ```
 */
export declare function pascalCase(value: string): string;
/**
 * Resolve the path prefix for a given `language` for a page-like `collection`.
 */
export declare function resolveCollectionPathPrefix(collection: Record<string, any>, language: string, primaryLanguage: string): string;
/**
 * Create a URL path that includes the given `language`.
 *
 * @example
 * ```typescript
 * setTranslationPrefix('/foo', 'de') // '/de/foo'
 * ```
 */
export declare function setTranslationPrefix(path: string, language: string, supportedLanguages: string[]): string;
/**
 * Get the translation prefix from a given `path`.
 * If the path does not contain a translation prefix, return `null`.
 *
 * @example
 * ```typescript
 * getTranslationPrefix('/de/foo', ['de', 'en']) // 'de'
 * getTranslationPrefix('/foo', ['de', 'en'])    // null
 * ```
 */
export declare function getTranslationPrefix(path: string, supportedLanguages: string[]): string | null;
/**
 * Remove accents from a given `value`.
 *
 * @example
 * ```typescript
 * removeAccents('áéíóú') // 'aeiou'
 * ```
 */
export declare function removeAccents(value: string): string;
/**
 * Convert a `value` string to snake case.
 *
 * @example
 * ```typescript
 * snakeCase('foo-bar') // 'foo_bar'
 * ```
 */
export declare function snakeCase(value: string): string;
/**
 * Convert a string `value` to title case.
 *
 * @example
 * ```typescript
 * titleCase('foo-bar') // 'Foo Bar'
 * titleCase('foo-bar', false) // 'Foo bar'
 * ```
 */
export declare function titleCase(value: any, capitalizeAll?: boolean): string;
/**
 * Transform a `value` to a string.
 */
export declare function stringify(value: any): string;
/**
 * Lowercase the first letter of a string `value`.
 *
 * @example
 * ```typescript
 * uncapitalize('Foo') // 'foo'
 * ```
 */
export declare function uncapitalize(value: string): string;
