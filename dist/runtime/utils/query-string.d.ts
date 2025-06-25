export type Token = string | Token[];
/**
 * Encode
 */
export declare function encodeQueryString(value: any): string;
/**
 * Parse an array-like query string parameter.
 */
export declare function parseQSArray(value: any): string[] | null;
/**
 * Parse `where` clause tokens into a nested array of tokens.
 */
export declare function parseWhereTokens(tokens: Token[]): Token[];
/**
 * Tokenize a query string value into an array of tokens.
 * This can be used to parse the `where` clause of a query string.
 */
export declare function tokenize(characters: string[]): Generator<string, void, unknown>;
