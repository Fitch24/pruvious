import { type CollectionFieldName, type CollectionName, type CollectionSearchStructure, type MultiCollectionName, type SingleCollectionName, type Sortable, type SupportedLanguage } from '#pruvious';
import { H3Event } from 'h3';
import type { QueryObject } from 'ufo';
import type { ResolvedCollectionDefinition } from './collection.definition.js';
export type QueryStringParams<T extends CollectionName> = MultiQueryStringParams<T & MultiCollectionName> & SingleQueryStringParams<T & SingleCollectionName>;
interface BaseQueryStringParams<T extends CollectionName> {
    /**
     * Specifies whether the query results will be returned with casted or populated field values.
     * This parameter accepts a booleanish value.
     *
     * By default, the query builder returns the casted field values without populating related data.
     *
     * @default false
     *
     * @example
     * ```typescript
     * '?populate=true' // true
     * '?populate=1'    // true
     * '?populate=no'   // false
     * ```
     */
    populate: boolean;
    /**
     * Specifies the `fields` to be selected and returned from the query.
     * Use a wildcard (`*`) to select all fields.
     *
     * By default, all collection fields are selected.
     *
     * @example
     * ```typescript
     * '?select=foo,bar'        // ['foo', 'bar']
     * '?select=foo&select=bar' // ['foo', 'bar']
     * '?select=*'              // ['foo', 'bar', 'baz', ...]
     * '?select='               // []
     * ```
     */
    select: CollectionFieldName[T][];
}
export interface MultiQueryStringParams<T extends MultiCollectionName> extends BaseQueryStringParams<T> {
    /**
     * Specifies how to group the query results based on a specific collection field.
     *
     * @default []
     */
    group: CollectionFieldName[T][];
    /**
     * Specifies the maximum number of records to be returned by the query.
     *
     * @default undefined
     */
    limit: number | undefined;
    /**
     * Specifies the offset (starting position) for the query results.
     *
     * @default undefined
     */
    offset: number | undefined;
    /**
     * Specifies the sorting order for the query results based on specific collection fields.
     *
     * By default, the sorting is done in ascending order (`asc`).
     *
     * @default []
     *
     * @example
     * ```typescript
     * '?order=foo'                // [['foo', 'ASC NULLS LAST']]
     * '?order=foo:desc'           // [['foo', 'DESC NULLS LAST']]
     * '?order=foo,bar:desc'       // [['foo', 'ASC NULLS LAST'], ['bar', 'DESC NULLS LAST']]
     * '?order=foo&order=bar:desc' // [['foo', 'ASC NULLS LAST'], ['bar', 'DESC NULLS LAST']]
     * ```
     */
    order: [Sortable[T], 'ASC NULLS LAST' | 'DESC NULLS LAST'][];
    /**
     * Specifies all filtering conditions in the query.
     *
     * @default { [Op.and]: [] }
     *
     * @example
     * ```typescript
     * '?where=foo[eq][bar]' // foo = 'bar'
     * '?where=foo[eq][bar],baz[gt][0]' // foo = 'bar' AND baz > 0
     * '?where=foo[eq][bar]&where=baz[gt][0]' // foo = 'bar' AND baz > 0
     * '?where=[foo[eq][bar],baz[gt][0]]' // foo = 'bar' AND baz > 0
     * '?where=every:[foo[eq][bar],baz[gt][0]]' // foo = 'bar' AND baz > 0
     * '?where=some:[baz[gt][0],baz[eq][null]]' // baz > 0 OR baz IS NULL
     * '?where=foo[=][bar],some:[baz[>][0],baz[=][null]]' // foo = 'bar' AND (baz > 0 OR baz IS NULL)
     * ```
     */
    where: Record<any, any>;
    /**
     * A key-value object where the key represents the search structure key and the value the search keywords.
     *
     * @default {}
     *
     * @example
     * ```typescript
     * { default: 'foo bar' }
     * ```
     */
    search: Partial<Record<CollectionSearchStructure[T] & string, string[]>>;
}
export interface SingleQueryStringParams<T extends SingleCollectionName> extends BaseQueryStringParams<T> {
    /**
     * The language code of a supported language in the CMS.
     *
     * Defaults to the language code of the primary language.
     */
    language: SupportedLanguage;
}
export declare const defaultMultiQueryStringParams: Readonly<MultiQueryStringParams<MultiCollectionName>>;
export declare const defaultSingleQueryStringParams: Readonly<SingleQueryStringParams<SingleCollectionName>>;
interface Options {
    /**
     * Custom error messages.
     */
    customErrorMessages?: {
        /**
         * A custom error message displayed when the `select` query parameter is empty.
         *
         * @default "At least one field must be included in the 'select' parameter"
         */
        emptySelect?: string;
        /**
         * A custom error message displayed when an operator in the `where` query parameter is incompatible.
         *
         * @default "Cannot use operator '$operator' on field '$field'"
         */
        incompatibleWhereOperator?: string;
        /**
         * A custom error message displayed when a value in the `where` query parameter is incompatible.
         *
         * @default "Cannot use value '$value' for operation '$operation' on field '$field'"
         */
        incompatibleWhereValue?: string;
        /**
         * A custom error message displayed when the `language` query parameter contains an unsupported language code.
         *
         * @default "The language code '$language' is not supported"
         */
        invalidLanguage?: string;
        /**
         * A custom error message displayed when the `order` direction cannot be resolved.
         *
         * @default "The order direction '$direction' is not valid"
         */
        invalidOrderDirection?: string;
        /**
         * A custom error message displayed when the `where` query parameter cannot be resolved.
         *
         * @default "The 'where' parameter is not valid"
         */
        invalidWhere?: string;
        /**
         * A custom error message displayed when an operator in the `where` query parameter is not valid.
         *
         * @default "The operator '$operator' is not valid"
         */
        invalidWhereOperator?: string;
        /**
         * A custom error message displayed when the `limit` query parameter is not a non-negative integer.
         *
         * @default "The 'limit' parameter must be a non-negative integer"
         */
        limitNotNonNegativeInteger?: string;
        /**
         * A custom error message displayed when a query parameter contains a nonexistent field.
         *
         * @default "The field '$field' does not exist"
         */
        nonExistentField?: string;
        /**
         * A custom error message displayed when a nonexistent search structure key is provided.
         *
         * @default "The search structure '$structure' does not exist"
         */
        nonExistentSearchStructure?: string;
        /**
         * A custom error message displayed when the collection is not searchable.
         *
         * @default 'This collection is not searchable'
         */
        notSearchable?: string;
        /**
         * A custom error message displayed when the `offset` query parameter is not a non-negative integer.
         *
         * @default "The 'offset' parameter must be a non-negative integer"
         */
        offsetNotNonNegativeInteger?: string;
        /**
         * A custom error message displayed when the `page` parameter is not a positive integer.
         *
         * @default "The 'page' parameter must be a positive integer"
         */
        pageNotPositiveInteger?: string;
        /**
         * A custom error message displayed when the `page` and `offset` query parameters are used simultaneously.
         *
         * @default "Using both 'page' and 'offset' parameters simultaneously is not permitted"
         */
        pageUsedWithOffset?: string;
        /**
         * A custom error message displayed when the `page` parameter is used without specifying `perPage` or `limit`.
         *
         * @default "The 'page' parameter requires either 'perPage' or 'limit' to be present"
         */
        pageWithoutPerPageOrLimit?: string;
        /**
         * A custom error message displayed when the `perPage` query parameters is not a positive integer.
         *
         * @default "The 'perPage' parameter must be a positive integer"
         */
        perPageNotPositiveInteger?: string;
        /**
         * A custom error message displayed when the `perPage` and `limit` query parameters are used simultaneously.
         *
         * @default "Using both 'perPage' and 'limit' parameters simultaneously is not permitted"
         */
        perPageUsedWithLimit?: string;
        /**
         * A custom error message displayed when the `populate` query parameter is not a booleanish value.
         *
         * @default "The 'populate' parameter must be a booleanish value"
         */
        populateNotBooleanish?: string;
        /**
         * A custom error message displayed when a query parameter contains a protected field.
         *
         * @default "The field '$field' cannot be queried"
         */
        protectedField?: string;
    };
    /**
     * Specifies the current request `operation` that defines the parsing logic for the query string parameters.
     *
     * If the `operation` parameter is not provided, it will be resolved based on the current HTTP method:
     * - `POST` - Create operation
     * - `GET` - Read operation
     * - `PATCH` - Update operation
     * - `DELETE` - Delete operation
     */
    operation?: 'create' | 'read' | 'update' | 'delete';
    /**
     * Represents the current query object, parsed using the `getQuery` utility.
     *
     * If not specified, the `queryObject` will be automatically resolved from the current `event`.
     */
    queryObject?: QueryObject;
}
/**
 * Parse the query string parameters and return an object with resolved and validated query string `params` for a specified `collection`.
 * Additionally, the returned object contains a list of `errors` found while validating the input query object.
 *
 * The function automatically reads the current query string parameters from the `event` argument.
 * You can override this behavior by customizing the `options` argument.
 *
 * @example
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   const { params, errors } = getQueryStringParams(event, 'products')
 *
 *   // Example: GET http://localhost:3000/api/collections/products?select=id,name&populate=true
 *   console.log(params)
 *   // Output: { select: ['id', 'name'], ..., populate: true }
 * })
 * ```
 */
export declare function getQueryStringParams<T extends CollectionName>(event: H3Event, collection: T | ResolvedCollectionDefinition, options?: Options): {
    /**
     * Parsed query string parameters, ready for use with a collection's query builder.
     *
     * @example
     * ```typescript
     * export default defineEventHandler(async (event) => {
     *   const { params } = getQueryStringParams(event, 'products')
     *   return query('products').applyQueryStringParams(params).all()
     * })
     * ```
     */
    params: QueryStringParams<T>;
    /**
     * Array of error messages generated during query string parameter parsing.
     *
     * @example
     * ```typescript
     * export default defineEventHandler(async (event) => {
     *   const { errors } = getQueryStringParams(event, 'products')
     *
     *   if (errors.length) {
     *     setResponseStatus(event, 400)
     *     return errors.join('\n')
     *   }
     * })
     * ```
     */
    errors: string[];
};
export {};
