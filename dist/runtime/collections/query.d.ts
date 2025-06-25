import { type MultiCollectionName, type SingleCollectionName, type SupportedLanguage, type UploadsCollectionName } from '#pruvious';
import type { QueryOptions, QueryOptionsWithType, QueryTypes } from 'sequelize';
import type { QueryBuilderInstance } from '../utility-types.js';
/**
 * Construct a `QueryBuilder` for multi-entry collections.
 *
 * @see https://pruvious.com/docs/query-builder
 */
export declare function query<T extends Exclude<MultiCollectionName, UploadsCollectionName>>(collection: T, contextLanguage?: SupportedLanguage): QueryBuilderInstance<T>;
/**
 * Construct a `SingleQueryBuilder` for single-entry collections.
 *
 * @see https://pruvious.com/docs/query-builder
 */
export declare function query<T extends SingleCollectionName>(collection: T, contextLanguage?: SupportedLanguage): QueryBuilderInstance<T>;
/**
 * Construct a `UploadsQueryBuilder` for the uploads collection.
 *
 * @see https://pruvious.com/docs/query-builder
 */
export declare function query<T extends UploadsCollectionName>(collection: T, contextLanguage?: SupportedLanguage): QueryBuilderInstance<T>;
/**
 * Execute a custom SQL query against the database.
 *
 * @param sql - The SQL query string to be executed.
 * @param replacements - An optional object of escaped replacements used to substitute placeholders in the SQL query.
 *
 * @returns A Promise that resolves to either the query results (SELECT only) or the number of affected rows.
 *
 * @see https://pruvious.com/docs/query-builder
 *
 * @example
 * ```typescript
 * await rawQuery('SELECT * FROM products WHERE price BETWEEN :min AND :max', { min: 20, max: 50 })
 * // Output: { results: [{ id: 1, name: 'Product A', price: 25 }, ...], metadata: {} }
 * ```
 */
export declare function rawQuery(sql: string, replacements?: Record<string, any>, options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>): Promise<{
    results: any;
    metadata: any;
}>;
