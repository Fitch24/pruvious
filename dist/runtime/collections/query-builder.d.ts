import type { CastedFieldType, CollectionFieldName, CollectionSearchStructure, CreateInput, FieldNameByType, ImmutableFieldName, MultiCollectionName, PopulatedFieldType, SearchableCollectionName, SelectableFieldName, SerializedFieldType, Sortable, SupportedLanguage, UpdateInput } from '#pruvious';
import type { WhereOptions as SequelizeWhereOptions } from 'sequelize';
import type { QueryStringParams } from './query-string.js';
export type PickFields<T extends string, S extends T> = Record<S, true> & Partial<Record<T, true>>;
export type BooleanField<T> = {
    [k in keyof T]: T[k] extends boolean ? k : never;
}[keyof T];
export type NumberField<T> = {
    [k in keyof T]: T[k] extends number ? k : never;
}[keyof T];
export type StringField<T> = {
    [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];
export type StringOrNumberField<T> = {
    [k in keyof T]: T[k] extends string | number ? k : never;
}[keyof T];
export type WithNull<T> = T | null;
export type FilterMethod = 'where' | 'whereEq' | 'whereNe' | 'whereGt' | 'whereGte' | 'whereLt' | 'whereLte' | 'whereBetween' | 'whereNotBetween' | 'whereIn' | 'whereNotIn' | 'whereRecordsIn' | 'whereRecordsNotIn' | 'whereLike' | 'whereNotLike' | 'whereILike' | 'whereNotILike' | 'some' | 'every';
type BaseMultiQueryBuilderMethod = FilterMethod | 'applyQueryStringParams' | 'select' | 'selectAll' | 'deselect' | 'some' | 'every' | 'order' | 'group' | 'offset' | 'limit' | 'populate' | 'unpopulate' | 'getFieldValueType' | 'setFieldValueType' | 'fallback' | 'noFallback' | 'contextLanguage' | 'getOptions' | 'clone' | 'clearWhere' | 'clearOrder' | 'clearGroup' | 'clearOffset' | 'clearLimit' | 'reset' | 'count' | 'exists' | 'notExists' | 'all' | 'allWithCount' | 'paginate' | 'first' | 'min' | 'max' | 'sum' | 'validate' | 'create' | 'createMany' | 'update' | 'delete';
export type MultiQueryBuilderMethod<T extends MultiCollectionName> = T extends SearchableCollectionName ? BaseMultiQueryBuilderMethod | 'search' | 'orderBySearchRelevance' | 'clearSearch' : BaseMultiQueryBuilderMethod;
export type ValidationError<ReturnableFieldName extends string> = Partial<Record<ReturnableFieldName, string>>;
export type CreateResult<ReturnedFieldType, ReturnableFieldName extends string & keyof ReturnedFieldType> = {
    /**
     * Indicates whether the record creation was successful.
     */
    success: true;
    /**
     * The created record.
     */
    record: Pick<ReturnedFieldType, ReturnableFieldName>;
} | {
    /**
     * Indicates whether the record creation was successful.
     */
    success: false;
    /**
     * A key-value object containing validation errors.
     * The keys represent the field names, and the values represent the corresponding error messages.
     */
    errors: ValidationError<ReturnableFieldName>;
    /**
     * An optional error message created during the database query.
     *
     * This message is typically rare and may occur when there's a discrepancy between the data validation process and the SQL query execution.
     * It may happen if the database has changed in the meantime and no longer meets the previous validation requirements.
     * For example, it could occur if a record being updated has been deleted, or when inserting a new record with a unique constraint.
     */
    message?: string;
};
export type CreateManyResult<ReturnedFieldType, ReturnableFieldName extends string & keyof ReturnedFieldType> = {
    /**
     * Indicates whether the records creation was successful.
     */
    success: true;
    /**
     * The created records.
     */
    records: Pick<ReturnedFieldType, ReturnableFieldName>[];
} | {
    /**
     * Indicates whether the records creation was successful.
     */
    success: false;
    /**
     * An array containing validation errors as key-value objects.
     * Each element of the array represents the corresponding input at the same index.
     * If there are no errors for a particular input, the value will be `null`.
     * Otherwise, the value will be an object with keys representing field names and values representing error messages.
     */
    errors: (ValidationError<ReturnableFieldName> | null)[];
    /**
     * An optional error message created during the database query.
     */
    message?: string;
};
export type UpdateResult<ReturnedFieldType, ReturnableFieldName extends string & keyof ReturnedFieldType> = {
    /**
     * Indicates whether the update was successful.
     */
    success: true;
    /**
     * The updated records.
     */
    records: Pick<ReturnedFieldType, ReturnableFieldName>[];
} | {
    /**
     * Indicates whether the update was successful.
     */
    success: false;
    /**
     * A key-value object containing validation errors.
     * The keys represent the field names, and the values represent the corresponding error messages.
     */
    errors: ValidationError<ReturnableFieldName>;
    /**
     * An optional error message created during the database query.
     */
    message?: string;
};
export interface PaginateResult<T> {
    /**
     * The current page.
     */
    currentPage: number;
    /**
     * The last page.
     */
    lastPage: number;
    /**
     * Number of records per page.
     */
    perPage: number;
    /**
     * List of fetched records.
     */
    records: T[];
    /**
     * Total number of queried records.
     */
    total: number;
}
/**
 * Executes database queries for a multi-entry `collection`.
 *
 * @see https://pruvious.com/docs/query-builder#multi-entry-collections
 */
export declare class QueryBuilder<CollectionName extends MultiCollectionName, ReturnableFieldName extends SelectableFieldName[CollectionName] = SelectableFieldName[CollectionName], ReturnedFieldType extends Record<keyof CastedFieldType[CollectionName], any> = CastedFieldType[CollectionName], Method extends MultiQueryBuilderMethod<CollectionName> = MultiQueryBuilderMethod<CollectionName>> {
    protected collection: CollectionName;
    protected dialect: 'postgres' | 'sqlite';
    protected table: string;
    protected selectedFields: string[];
    protected whereOptions: Record<any, any>;
    protected searchOptions: Partial<Record<CollectionSearchStructure[MultiCollectionName] & string, string[]>>;
    protected orderOptions: [Sortable[CollectionName], 'ASC NULLS LAST' | 'DESC NULLS LAST'][];
    protected groupOptions: SelectableFieldName[CollectionName][];
    protected offsetOption: number | undefined;
    protected limitOption: number | undefined;
    protected populateOption: boolean;
    protected fallbackOption: boolean;
    protected contextLanguageOption: SupportedLanguage;
    constructor(collection: CollectionName, contextLanguage?: SupportedLanguage);
    /**
     * Apply query string parameters to the current query.
     *
     * @example
     * ```typescript
     * export default defineEventHandler((event) => {
     *   const qs = getQueryStringParams(event, 'products')
     *
     *   if (qs.errors.length) {
     *     setResponseStatus(event, 400)
     *     return qs.errors.join('\n')
     *   }
     *
     *   return query('products').applyQueryStringParams(qs.params).all()
     * })
     * ```
     */
    applyQueryStringParams(params: Partial<QueryStringParams<CollectionName>>): Pick<QueryBuilder<CollectionName, SelectableFieldName[CollectionName], (CastedFieldType[CollectionName] | PopulatedFieldType[CollectionName] | Record<SelectableFieldName[CollectionName], undefined>) & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }, MultiQueryBuilderMethod<CollectionName>>, MultiQueryBuilderMethod<CollectionName>>;
    /**
     * Specify the `fields` to be selected and returned from the query.
     *
     * @example
     * ```typescript
     * // Selects the 'name' and 'price' fields from the 'products' collection
     * await query('products').select({ name: true, price: true }).first()
     * // Output: { name: '...', price: '...' }
     * ```
     */
    select<T extends SelectableFieldName[CollectionName]>(fields: PickFields<SelectableFieldName[CollectionName], T> | T[]): Pick<QueryBuilder<CollectionName, T, ReturnedFieldType, Method>, Method>;
    /**
     * Select all fields from the queried collection.
     *
     * @example
     * ```typescript
     * // Select all fields from the 'products' collection
     * await query('products').selectAll().first()
     * // Output: { field1: '...', field2: '...', ... }
     * ```
     */
    selectAll(): Pick<QueryBuilder<CollectionName, SelectableFieldName[CollectionName], ReturnedFieldType, Method>, Method>;
    /**
     * Exclude specified `fields` from the query result.
     *
     * @example
     * ```typescript
     * // Don't return the 'secret' field from the 'products' collection
     * const product = await query('products').deselect({ secret: true }).first()
     * console.log(product.secret)
     * // Output: undefined
     * ```
     */
    deselect<T extends ReturnableFieldName>(fields: PickFields<ReturnableFieldName, T> | T[]): Pick<QueryBuilder<CollectionName, Exclude<ReturnableFieldName, T>, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: status = 'active'
     * query('products').where('status', 'active')
     *
     * // Alternatives:
     * query('products').where('status', '=', 'active')
     * query('products').whereEq('status', 'active')
     * ```
     */
    where<T extends keyof SerializedFieldType[CollectionName]>(field: T, value: WithNull<SerializedFieldType[CollectionName][T]>): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: status = 'active'
     * query('products').where('status', '=', 'active')
     *
     * // Alternatives:
     * query('products').where('status', 'active')
     * query('products').whereEq('status', 'active')
     * ```
     */
    where<T extends keyof SerializedFieldType[CollectionName]>(field: T, operator: '=', value: WithNull<SerializedFieldType[CollectionName][T]>): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: discount != null
     * query('products').where('discount', '!=', null)
     *
     * // Alternative:
     * query('products').whereNe('discount', null)
     * ```
     */
    where<T extends keyof SerializedFieldType[CollectionName]>(field: T, operator: '!=', value: WithNull<SerializedFieldType[CollectionName][T]>): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price > 100
     * query('products').where('price', '>', 100)
     *
     * // Alternative:
     * query('products').whereGt('price', 100)
     * ```
     */
    where<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, operator: '>', value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price >= 100
     * query('products').where('price', '>=', 100)
     *
     * // Alternative:
     * query('products').whereGte('price', 100)
     * ```
     */
    where<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, operator: '>=', value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price < 100
     * query('products').where('price', '<', 100)
     *
     * // Alternative:
     * query('products').whereLt('price', 100)
     * ```
     */
    where<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, operator: '<', value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price <= 100
     * query('products').where('price', '<=', 100)
     *
     * // Alternative:
     * query('products').whereLte('price', 100)
     * ```
     */
    where<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, operator: '<=', value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price >= 20 and price <= 50
     * query('products').where('price', 'between', [20, 50])
     *
     * // Alternative:
     * query('products').whereBetween('price', [20, 50])
     * ```
     */
    where<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, operator: 'between', values: [SerializedFieldType[CollectionName][T], SerializedFieldType[CollectionName][T]]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price < 20 or price > 50
     * query('products').where('price', 'notBetween', [20, 50])
     *
     * // Alternative:
     * query('products').whereNotBetween('price', [20, 50])
     * ```
     */
    where<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, operator: 'notBetween', values: [SerializedFieldType[CollectionName][T], SerializedFieldType[CollectionName][T]]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: id = 1 or id = 3 or id = 5
     * query('products').where('id', 'in', [1, 3, 5])
     *
     * // Alternative:
     * query('products').whereIn('id', [1, 3, 5])
     * ```
     */
    where<T extends keyof SerializedFieldType[CollectionName]>(field: T, operator: 'in', values: SerializedFieldType[CollectionName][T][]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: id != 1 and id != 3 and id != 5
     * query('products').where('id', 'notIn', [1, 3, 5])
     *
     * // Alternative:
     * query('products').whereNotIn('id', [1, 3, 5])
     * ```
     */
    where<T extends keyof SerializedFieldType[CollectionName]>(field: T, operator: 'notIn', values: SerializedFieldType[CollectionName][T][]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name starts with 'P' (case sensitive in PostgreSQL)
     * query('products').where('name', 'like', 'P%')
     *
     * // Alternative:
     * query('products').whereLike('name', 'P%')
     * ```
     */
    where<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, operator: 'like', value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name does not start with 'P' (case sensitive in PostgreSQL)
     * query('products').where('name', 'notLike', 'P%')
     *
     * // Alternative:
     * query('products').whereNotLike('name', 'P%')
     * ```
     */
    where<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, operator: 'notLike', value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name contains 'phone' (case insensitive)
     * query('products').where('name', 'iLike', '%phone%')
     *
     * // Alternative:
     * query('products').whereILike('name', '%phone%')
     * ```
     */
    where<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, operator: 'iLike', value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name does not contain 'phone' (case insensitive)
     * query('products').where('name', 'notILike', '%phone%')
     *
     * // Alternative:
     * query('products').whereNotILike('name', '%phone%')
     * ```
     */
    where<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, operator: 'notILike', value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: status = 'active'
     * query('products').whereEq('status', 'active')
     *
     * // Alternatives:
     * query('products').where('status', 'active')
     * query('products').where('status', '=', 'active')
     * ```
     */
    whereEq<T extends keyof SerializedFieldType[CollectionName]>(field: T, value: WithNull<SerializedFieldType[CollectionName][T]>): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: discount != null
     * query('products').whereNe('discount', null)
     *
     * // Alternative:
     * query('products').where('discount', '!=', null)
     * ```
     */
    whereNe<T extends keyof SerializedFieldType[CollectionName]>(field: T, value: WithNull<SerializedFieldType[CollectionName][T]>): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price > 100
     * query('products').whereGt('price', 100)
     *
     * // Alternative:
     * query('products').where('price', '>', 100)
     * ```
     */
    whereGt<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price >= 100
     * query('products').whereGte('price', 100)
     *
     * // Alternative:
     * query('products').where('price', '>=', 100)
     * ```
     */
    whereGte<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price < 100
     * query('products').whereLt('price', 100)
     *
     * // Alternative:
     * query('products').where('price', '<', 100)
     * ```
     */
    whereLt<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price <= 100
     * query('products').whereLte('price', 100)
     *
     * // Alternative:
     * query('products').where('price', '<=', 100)
     * ```
     */
    whereLte<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, value: SerializedFieldType[CollectionName][T]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price >= 20 and price <= 50
     * query('products').whereBetween('price', [20, 50])
     *
     * // Alternative:
     * query('products').where('price', 'between', [20, 50])
     * ```
     */
    whereBetween<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, values: [SerializedFieldType[CollectionName][T], SerializedFieldType[CollectionName][T]]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: price < 20 or price > 50
     * query('products').whereNotBetween('price', [20, 50])
     *
     * // Alternative:
     * query('products').where('price', 'notBetween', [20, 50])
     * ```
     */
    whereNotBetween<T extends StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T, values: [SerializedFieldType[CollectionName][T], SerializedFieldType[CollectionName][T]]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: id = 1 or id = 3 or id = 5
     * query('products').whereIn('id', [1, 3, 5])
     *
     * // Alternative:
     * query('products').where('id', 'in', [1, 3, 5])
     * ```
     */
    whereIn<T extends keyof SerializedFieldType[CollectionName]>(field: T, values: SerializedFieldType[CollectionName][T][]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: id != 1 and id != 3 and id != 5
     * query('products').whereNotIn('id', [1, 3, 5])
     *
     * // Alternative:
     * query('products').where('id', 'notIn', [1, 3, 5])
     * ```
     */
    whereNotIn<T extends keyof SerializedFieldType[CollectionName]>(field: T, values: SerializedFieldType[CollectionName][T][]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific `records` field in the database query.
     *
     * @example
     * ```typescript
     * // Select products with `tags` that contain the record with ID 1
     * query('products').whereRecordsIn('tags', 1)
     * ```
     */
    whereRecordsIn<T extends FieldNameByType[CollectionName]['records']>(field: T, id: number): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific `records` field in the database query.
     *
     * @example
     * ```typescript
     * // Select products with `tags` containing records of IDs 1, 2, or 3
     * query('products').whereRecordsIn('tags', [1, 2, 3])
     * query('products').whereRecordsIn('tags', [1, 2, 3], 'some')
     *
     * // Select products with `tags` containing all records of IDs 1, 2, and 3
     * query('products').whereRecordsIn('tags', [1, 2, 3], 'every')
     * ```
     */
    whereRecordsIn<T extends FieldNameByType[CollectionName]['records']>(field: T, id: number[], logic?: 'every' | 'some'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific `records` field in the database query.
     *
     * @example
     * ```typescript
     * // Select products with `tags` that do not contain the record with ID 4
     * query('products').whereRecordsNotIn('tags', 4)
     * ```
     */
    whereRecordsNotIn<T extends FieldNameByType[CollectionName]['records']>(field: T, id: number): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific `records` field in the database query.
     *
     * @example
     * ```typescript
     * // Select products with tags not containing any of the records with IDs 4, 5, or 6
     * query('products').whereRecordsNotIn('tags', [4, 5, 6])
     * query('products').whereRecordsNotIn('tags', [4, 5, 6], 'some')
     *
     * // Select products with `tags` not containing records of IDs 4, 5, and 6
     * query('products').whereRecordsNotIn('tags', [4, 5, 6], 'every')
     * ```
     */
    whereRecordsNotIn<T extends FieldNameByType[CollectionName]['records']>(field: T, id: number[], logic?: 'every' | 'some'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name starts with 'P' (case sensitive in PostgreSQL)
     * query('products').whereLike('name', 'P%')
     *
     * // Alternative:
     * query('products').where('name', 'like', 'P%')
     * ```
     */
    whereLike<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name does not start with 'P' (case sensitive in PostgreSQL)
     * query('products').whereNotLike('name', 'P%')
     *
     * // Alternative:
     * query('products').where('name', 'notLike', 'P%')
     * ```
     */
    whereNotLike<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name contains 'phone' (case insensitive)
     * query('products').whereILike('name', '%phone%')
     *
     * // Alternative:
     * query('products').where('name', 'iLike', '%phone%')
     * ```
     */
    whereILike<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Specify a filtering condition for a specific field in the database query.
     *
     * @example
     * ```typescript
     * // Apply a filtering condition: name does not contain 'phone' (case insensitive)
     * query('products').whereNotILike('name', '%phone%')
     *
     * // Alternative:
     * query('products').where('name', 'notILike', '%phone%')
     * ```
     */
    whereNotILike<T extends StringField<SerializedFieldType[CollectionName]>>(field: T, value: string): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Apply a logical OR to a set of filtering conditions on the query.
     * At least one of the conditions must be satisfied for a record to be included in the result.
     *
     * @example
     * ```typescript
     * // Apply logical OR: (price < 100) OR (discount >= 0.5)
     * query('products').some(
     *   (products) => products.where('price', '<', 100),
     *   (products) => products.where('discount', '>=', 0.5),
     * )
     * ```
     */
    some(...filters: [
        (filter: Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, FilterMethod>, FilterMethod>) => any,
        ...((filter: Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, FilterMethod>, FilterMethod>) => any)[]
    ]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Apply a logical AND to a set of filtering conditions on the query.
     * All the conditions must be satisfied for a record to be included in the result.
     *
     * Note: This method is redundant since all chained filter operations are implicitly combined using logical AND.
     *
     * @example
     * ```typescript
     * // Apply logical AND: (price > 100) AND (discount >= 0.1)
     * query('products').every(
     *   (products) => products.where('price', '>', 100),
     *   (products) => products.where('status', '>=', 0.1),
     * )
     * ```
     */
    every(...filters: [
        (filter: Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, FilterMethod>, FilterMethod>) => any,
        ...((filter: Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, FilterMethod>, FilterMethod>) => any)[]
    ]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Perform a search in the queried collection based on the specified `keywords` and search `structure`.
     *
     * Note: The `keywords` are case insensitive.
     *
     * @example
     * ```typescript
     * // Find 'products' by a specific keyword.
     * // The `search` structures are defined in the collection definition.
     * await query('products').search('NVMe SSD').first()
     * // Output: { field1: '...', field2: '...', ... }
     * ```
     */
    search(keywords: string, structure?: CollectionSearchStructure[CollectionName]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Set the sorting order for query results based on search relevance within a specific search `structure`.
     * By default, the sorting is in ascending order (`asc`), showing the most relevant results first.
     *
     * You can chain multiple `order` calls to apply multiple sorting criteria.
     * The sorting will be applied in the order they are called.
     *
     * @example
     * ```typescript
     * // Search products in the 'products' collection, sorted by relevance and price (ascending)
     * await query('products').search('NVMe SSD').orderBySearchRelevance().order('price').all()
     *
     * // Alternative:
     * await query('products').search('NVMe SSD').order(':default').order('price').all()
     * ```
     */
    orderBySearchRelevance(structure?: CollectionSearchStructure[CollectionName], direction?: 'asc' | 'desc'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Set a sorting order for the query results based on a specific collection field.
     * By default, the sorting is done in ascending order (`asc`).
     *
     * You can chain multiple `order` calls to apply multiple sorting criteria.
     * The sorting will be applied in the order they are called.
     *
     * If the `field` argument starts with a colon (`:`), it is considered a search structure key.
     * For example, `order(':default')` is equivalent to calling the `orderBySearchRelevance()` method.
     *
     * @example
     * ```typescript
     * // Fetch all products from the 'products' collection, sorted by their price in ascending order
     * await query('products').order('price').all()
     *
     * // Fetch the most expensive products first, sorted by their price in descending order
     * await query('products').order('price', 'desc').all()
     * ```
     */
    order(field: Sortable[CollectionName], direction?: 'asc' | 'desc'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Group the query results based on a specific collection field.
     *
     * You can chain multiple `group` calls to apply multiple grouping criteria.
     * The grouping will be applied in the order they are called.
     *
     * @example
     * ```typescript
     * // Fetch all products from the 'products' collection, grouped by their category
     * await query('products').select({ category: true }).group('category').all()
     * ```
     */
    group(field: SelectableFieldName[CollectionName]): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Set the offset (starting position) for the query results.
     *
     * @example
     * ```typescript
     * // Fetch the second page of products with 10 products per page from the 'products' collection
     * const records = await query('products').limit(10).offset(10).all()
     *
     * // Alternative:
     * const { records } = await query('products').paginate(2, 10)
     * ```
     */
    offset(offset: number): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Set the maximum number of records to be returned by the query.
     *
     * @example
     * ```typescript
     * // Fetch the first 10 products from the 'products' collection
     * const records = await query('products').limit(10).all()
     *
     * // Alternative:
     * const { records } = await query('products').paginate(1, 10)
     * ```
     */
    limit(limit: number): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Enable field population to retrieve populated field values in the query results.
     *
     * By default, the query builder returns the casted field values without populating related data.
     *
     * @example
     * ```typescript
     * // Without population:
     * await query('products').select({ category: true }).first()
     * // Output: { category: 1 }
     *
     * // With population:
     * await query('products').select({ category: true }).populate().first()
     * // Output: { category: { id: 1, name: 'Electronics' } }
     * ```
     */
    populate(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, PopulatedFieldType[CollectionName] & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }, Method>, Method>;
    /**
     * Disable field population to retrieve casted values in the query results.
     *
     * By default, the query builder returns the casted field values without populating related data.
     *
     * @example
     * ```typescript
     * // Without population:
     * await populatedProductsQuery.select({ category: true }).unpopulate().first()
     * // Output: { category: 1 }
     *
     * // With population:
     * await populatedProductsQuery.select({ category: true }).first()
     * // Output: { category: { id: 1, name: 'Electronics' } }
     * ```
     */
    unpopulate(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, CastedFieldType[CollectionName], Method>, Method>;
    /**
     * Check whether the query results will be returned with casted or populated field values.
     *
     * @example
     * ```typescript
     * query('products').getFieldValueType() // 'casted'
     * query('products').populate().getFieldValueType() // 'populated'
     * ```
     */
    getFieldValueType(): 'casted' | 'populated';
    /**
     * Specify whether the query results will be returned with casted or populated field values.
     *
     * By default, the query builder returns the casted field values without populating related data.
     *
     * @example
     * ```typescript
     * // Without population:
     * await query('products').select({ category: true }).first()
     * // Output: { category: 1 }
     *
     * // With population:
     * await query('products').select({ category: true }).setFieldValueType('populated').first()
     * // Output: { category: { id: 1, name: 'Electronics' } }
     * ```
     */
    setFieldValueType(type: 'casted'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, CastedFieldType[CollectionName], Method>, Method>;
    setFieldValueType(type: 'populated'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, PopulatedFieldType[CollectionName] & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }, Method>, Method>;
    setFieldValueType(type: 'casted' | 'populated'): Pick<QueryBuilder<CollectionName, ReturnableFieldName, (CastedFieldType[CollectionName] | PopulatedFieldType[CollectionName]) & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }, Method>, Method>;
    /**
     * Revalidate fields after fetching from the database and set their values to default if validation fails.
     * This prevents returning invalid existing data in case field or collection definitions are updated.
     *
     * By default, fallback validation is enabled.
     */
    fallback(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Disable field validation after fetching, potentially speeding up database queries.
     * Beware that this may result in invalid data if field or collection definitions change.
     *
     * By default, fallback validation is enabled.
     */
    noFallback(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Set the language for the validation messages returned by the query builder.
     *
     * By default, the language is set to the language code defined in the module option `language.primary`.
     */
    contextLanguage(language: SupportedLanguage): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Get a copy of the current query builder options.
     */
    getOptions(): {
        table: string;
        selectedFields: string[];
        whereOptions: Record<any, any>;
        searchOptions: Partial<Record<string, string[]>>;
        orderOptions: [Sortable[CollectionName], "ASC NULLS LAST" | "DESC NULLS LAST"][];
        groupOptions: SelectableFieldName[CollectionName][];
        offsetOption: number | undefined;
        limitOption: number | undefined;
        populateOption: boolean;
        fallbackOption: boolean;
        contextLanguageOption: "en";
    };
    /**
     * Create a new query builder with the same state as this one.
     */
    clone(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset the current `WHERE` clause options of the query.
     */
    clearWhere(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset the current search options of the query.
     */
    clearSearch(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset the current `ORDER BY` clause options of the query.
     */
    clearOrder(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset the current `GROUP BY` clause options of the query.
     */
    clearGroup(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset the current `OFFSET` clause option of the query.
     */
    clearOffset(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset the current `LIMIT` clause option of the query.
     */
    clearLimit(): Pick<QueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType, Method>, Method>;
    /**
     * Reset all query builder options to their default values.
     */
    reset(): Pick<QueryBuilder<CollectionName, SelectableFieldName[CollectionName], CastedFieldType[CollectionName], MultiQueryBuilderMethod<CollectionName>>, MultiQueryBuilderMethod<CollectionName>>;
    /**
     * Retrieve the number of records in the queried collection.
     *
     * @example
     * ```typescript
     * // Get the number of records in the 'products' collection
     * await query('products').count()
     * // Output: 1337
     * ```
     */
    count(): Promise<number>;
    /**
     * Check whether there is at least one record that matches the current query.
     *
     * @example
     * ```typescript
     * // Check if there are products with prices greater than 100
     * await query('products').whereGt('price', 100).exists()
     * // Output: true
     * ```
     */
    exists(): Promise<boolean>;
    /**
     * Check whether there are no records that match the current query.
     *
     * @example
     * ```typescript
     * // Check if there are no products with zero prices
     * await query('products').where('price', 0).notExists()
     * // Output: true
     * ```
     */
    notExists(): Promise<boolean>;
    /**
     * Fetch all records from the queried collection.
     *
     * @example
     * ```typescript
     * // Fetch all records from the 'products' collection
     * await query('products').all()
     * // Output: [{ field1: '...', field2: '...', ... }, { field1: '...', field2: '...', ... }, ...]
     * ```
     */
    all(): Promise<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>[]>;
    /**
     * Retrieve all records from the queried collection along with the total count of records.
     *
     * @example
     * ```typescript
     * // Fetch the first 2 records from the 'products' collection with count
     * await query('products').limit(2).allWithCount()
     * // Output: { count: 1337, records: [{ field1: '...', field2: '...', ... }, { field1: '...', field2: '...', ... }] }
     * ```
     */
    allWithCount(): Promise<{
        /**
         * Total number of queried records.
         */
        count: number;
        /**
         * List of fetched records.
         */
        records: Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>[];
    }>;
    /**
     * Retrieve a specific page of records along with pagination-related information.
     *
     * @example
     * ```typescript
     * // Fetch the first page with 10 records per page from the 'products' collection
     * await query('products').paginate(1, 10)
     * // Output: { currentPage: 1, lastPage: 134, perPage: 10, records: [...], total: 1337 }
     * ```
     */
    paginate(page: number, perPage: number): Promise<PaginateResult<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>>;
    /**
     * Fetch the first record from the queried collection.
     *
     * @example
     * ```typescript
     * // Fetch the first record from the 'products' collection
     * await query('products').first()
     * // Output: { field1: '...', field2: '...', ... }
     * ```
     */
    first(): Promise<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType> | null>;
    /**
     * Retrieve the minimum value of a specific field in the queried collection.
     *
     * @example
     * ```typescript
     * // Find the minimum price among products
     * await query('products').min('price')
     * // Output: 0.36
     * ```
     */
    min<T extends SelectableFieldName[CollectionName] & StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T): Promise<SerializedFieldType[CollectionName][T] | null>;
    /**
     * Retrieve the maximum value of a specific field in the queried collection.
     *
     * @example
     * ```typescript
     * // Find the maximum price among products
     * await query('products').max('price')
     * // Output: 9001
     * ```
     */
    max<T extends SelectableFieldName[CollectionName] & StringOrNumberField<SerializedFieldType[CollectionName]>>(field: T): Promise<SerializedFieldType[CollectionName][T] | null>;
    /**
     * Retrieve the sum of a specific numeric field in the queried collection.
     *
     * @example
     * ```typescript
     * // Calculate the total quantity of all products
     * await query('products').sum('quantity')
     * // Output: 5417
     * ```
     */
    sum<T extends SelectableFieldName[CollectionName] & NumberField<SerializedFieldType[CollectionName]>>(field: T): Promise<number>;
    /**
     * Validate the `input` data of a record.
     *
     * @returns A Promise that resolves to an object containing validation errors for fields with failed validation.
     */
    validate(input: Record<string, any>, operation: 'create' | 'read' | 'update', allInputs?: Record<string, any>[], skipFields?: string[]): Promise<ValidationError<ReturnableFieldName>>;
    /**
     * Create a new record in the queried collection with the provided `input` data.
     *
     * @returns A Promise that resolves to a `CreateResult` object.
     *          If the creation is successful, the `record` property will contain the created record.
     *          If there are any field validation errors, they will be available in the `errors` property.
     *          The `message` property may contain an optional error message if there are issues during the database query.
     *
     * @example
     * ```typescript
     * const result = await query('products').create({
     *   name: 'Magical Wand',
     *   price: 19.99,
     *   category: 2,
     *   description: 'A powerful wand for all your wizarding needs!',
     * })
     *
     * if (result.success) {
     *   console.log('Product created successfully:', result.record)
     * } else {
     *   console.error('Product creation failed:', result.errors)
     * }
     * ```
     */
    create(input: CreateInput[CollectionName]): Promise<CreateResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Create multiple records in the collection based on the provided `input` array.
     * Each `input` element corresponds to a record to be created.
     *
     * @returns A Promise that resolves to a `CreateManyResult` object.
     *          If successful, the created records will be available in the `records` property.
     *          If any input has validation errors, the `errors` property will contain an array of error objects at the corresponding index.
     *          If there are no errors for a particular input, the value at that index will be `null`.
     *          The `message` property may contain an optional error message for any database query issues.
     *
     * Note: If any input fails validation, no records will be created.
     *
     * @example
     * ```typescript
     * const result = await query('products').createMany([
     *   { name: 'Product 1', price: 10 },
     *   { name: 'Product 2', price: 20 },
     *   { name: 'Product 3', price: 'Invalid Price' }, // <- Error
     * ])
     *
     * if (result.success) {
     *   console.log('Records created:', result.records)
     * } else {
     *   console.log('Errors:', result.errors) // [null, null, { price: 'Invalid input type' }]
     * }
     * ```
     */
    createMany(input: CreateInput[CollectionName][]): Promise<CreateManyResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Update existing records in the queried collection based on the specified conditions.
     *
     * @returns A Promise that resolves to an `UpdateResult` object.
     *          If successful, the updated records will be available in the `records` property.
     *          If there are any field validation errors, they will be available in the `errors` property.
     *          The `message` property may contain an optional error message if there are issues during the database query.
     *
     * @example
     * ```typescript
     * const result = await query('products').where('id', 47).update({
     *   name: 'Updated Product',
     *   price: 15,
     *   category: 3,
     *   description: 'This product has been updated!',
     * })
     *
     * if (result.success) {
     *   console.log('Records updated:', result.records)
     * } else {
     *   console.error('Update failed:', result.errors)
     * }
     * ```
     */
    update(input: UpdateInput[CollectionName]): Promise<UpdateResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Delete records from the queried collection based on the specified conditions.
     *
     * @returns A Promise that resolves to an array containing the deleted records.
     *
     * @example
     * ```typescript
     * await query('products').select({ id: true }).where('category', 5).delete()
     * // Output: [{ id: 30 }, { id: 144 }, { id: 145 }]
     * ```
     */
    delete(): Promise<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>[]>;
    protected applySequelizeOptions(pick?: ('attributes' | 'group' | 'limit' | 'offset' | 'order' | 'where')[]): Promise<Partial<{
        attributes: string[];
        group: string[];
        limit: number | undefined;
        offset: number | undefined;
        order: [string, string][];
        where: SequelizeWhereOptions<any>;
    }>>;
    protected addFilter(filter: Record<any, any>, to?: Record<any, any>): void;
    protected serializeInput(input: Record<string, any>): Record<string, any>;
    protected buildSearchKeywords(id: number): Promise<void>;
    protected castRecord(record: Record<string, any>): void;
    protected validateAndFallbackRecordsAfterCreate(record: Record<string, any>, allRecords?: Record<string, any>[]): Promise<void>;
    protected validateAndFallbackRecordsAfterFetch(record: Record<string, any>, allRecords?: Record<string, any>[]): Promise<void>;
    protected populateRecord(record: Record<string, any>): Promise<void>;
    protected fillNonTranslatableFields(input: Record<string, any>, translations: string): Promise<void>;
    protected syncNonTranslatableFields(sanitized: Record<string, any>): Promise<number[]>;
    protected prepareInput<T extends Record<string, any>>(input: T, operation: 'create' | 'update'): T;
    protected getImmutableFields(): ImmutableFieldName[CollectionName][];
    protected getOperableFields(input: Record<string, any>, operation: 'create' | 'read' | 'update'): CollectionFieldName[CollectionName][];
    protected sanitize(input: Record<string, any>, operation: 'create' | 'update'): Promise<Record<string, any>>;
    protected applyConditionalLogic(sanitized: Record<string, any>): {
        errors: Record<string, string>;
        failed: string[];
    };
    protected updateOrDelete(operation: 'update' | 'delete', callback: (buildSearchKeywordsRecordIds: number[]) => any | Promise<any>, buildSearchKeywordsRecordIds?: number[]): Promise<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>[]>;
    protected hasNonCachedFieldInSelectOrderOrGroup(): boolean;
    protected hasNonCachedFieldInWhere(): boolean;
    protected generateCacheKey(method: 'all' | 'allWithCount' | 'paginate' | 'first' | 'min' | 'max' | 'sum'): string;
    protected storeInCache(key: string, value: any, start: number): Promise<void>;
    protected readFromCache(key: string): Promise<any>;
    protected clearCache(operation: 'onCreate' | 'onUpdate' | 'onDelete'): Promise<void>;
}
export {};
