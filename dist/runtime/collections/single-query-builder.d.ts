import { type CastedFieldType, type PopulatedFieldType, type SelectableFieldName, type SingleCollectionName, type SupportedLanguage, type UpdateInput } from '#pruvious';
import type { PickFields, ValidationError } from './query-builder.js';
import type { QueryStringParams } from './query-string.js';
type UpdateResult<ReturnedFieldType, ReturnableFieldName extends string & keyof ReturnedFieldType> = {
    /**
     * Indicates whether the update was successful.
     */
    success: true;
    /**
     * The updated record.
     */
    record: Pick<ReturnedFieldType, ReturnableFieldName>;
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
/**
 * Executes database queries for a single-entry `collection`.
 *
 * @see https://pruvious.com/docs/query-builder#single-entry-collections
 */
export declare class SingleQueryBuilder<CollectionName extends SingleCollectionName, ReturnableFieldName extends SelectableFieldName[CollectionName] = SelectableFieldName[CollectionName], ReturnedFieldType extends Record<keyof CastedFieldType[CollectionName], any> = CastedFieldType[CollectionName]> {
    private collection;
    private table;
    private selectedFields;
    private languageOption;
    private populateOption;
    private fallbackOption;
    protected contextLanguageOption: SupportedLanguage;
    constructor(collection: CollectionName, contextLanguage?: SupportedLanguage);
    /**
     * Apply query string parameters to the current query.
     *
     * @example
     * ```typescript
     * export default defineEventHandler((event) => {
     *   const qs = getQueryStringParams(event, 'settings')
     *
     *   if (qs.errors.length) {
     *     setResponseStatus(event, 400)
     *     return qs.errors.join('\n')
     *   }
     *
     *   return query('settings').applyQueryStringParams(qs.params).read()
     * })
     * ```
     */
    applyQueryStringParams(params: Partial<QueryStringParams<CollectionName>>): SingleQueryBuilder<CollectionName, SelectableFieldName[CollectionName], (CastedFieldType[CollectionName] | PopulatedFieldType[CollectionName] | Record<SelectableFieldName[CollectionName], undefined>) & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }>;
    /**
     * Specify the `fields` to be selected and returned from the query.
     *
     * @example
     * ```typescript
     * // Selects the 'logo' and 'copyright' fields from the 'settings' collection
     * await query('settings').select({ logo: true, copyright: true }).read()
     * // Output: { logo: ..., copyright: '...' }
     * ```
     */
    select<T extends SelectableFieldName[CollectionName]>(fields: PickFields<SelectableFieldName[CollectionName], T> | T[]): SingleQueryBuilder<CollectionName, T, ReturnedFieldType>;
    /**
     * Select all fields from the queried collection.
     *
     * @example
     * ```typescript
     * // Select all fields from the 'settings' collection
     * await query('settings').selectAll().read()
     * // Output: { field1: '...', field2: '...', ... }
     * ```
     */
    selectAll(): SingleQueryBuilder<CollectionName, SelectableFieldName[CollectionName], ReturnedFieldType>;
    /**
     * Exclude specified `fields` from the query result.
     *
     * @example
     * ```typescript
     * // Don't return the 'secret' field from the 'settings' collection
     * const product = await query('settings').deselect({ secret: true }).read()
     * console.log(product.secret)
     * // Output: undefined
     * ```
     */
    deselect<T extends ReturnableFieldName>(fields: PickFields<ReturnableFieldName, T> | T[]): SingleQueryBuilder<CollectionName, Exclude<ReturnableFieldName, T>, ReturnedFieldType>;
    /**
     * Set the language code for the query result.
     * If no language is specified or the code is invalid, the primary language is used.
     * Non-translatable collections always return results in the primary language.
     *
     * @example
     * ```typescript
     * // Select the German version of the 'settings' collection
     * await query('settings').language('de').read()
     * ```
     */
    language(code: SupportedLanguage): SingleQueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType>;
    /**
     * Retrieve the currently queried language code.
     *
     * @example
     * ```typescript
     * query('settings').getLanguage() // 'en'
     * ```
     */
    getLanguage(): SupportedLanguage;
    /**
     * Enable field population to retrieve populated field values in the query results.
     *
     * By default, the query builder returns the casted field values without populating related data.
     *
     * @example
     * ```typescript
     * // Without population:
     * await query('settings').select({ blogLandingPage: true }).read()
     * // Output: { blogLandingPage: 1 }
     *
     * // With population:
     * await query('settings').select({ blogLandingPage: true }).populate().read()
     * // Output: { blogLandingPage: { id: 1, path: '/blog' } }
     * ```
     */
    populate(): SingleQueryBuilder<CollectionName, ReturnableFieldName, PopulatedFieldType[CollectionName] & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }>;
    /**
     * Disable field population to retrieve casted values in the query results.
     *
     * By default, the query builder returns the casted field values without populating related data.
     *
     * @example
     * ```typescript
     * // Without population:
     * await populatedsettingsQuery.select({ blogLandingPage: true }).unpopulate().read()
     * // Output: { blogLandingPage: 1 }
     *
     * // With population:
     * await populatedsettingsQuery.select({ blogLandingPage: true }).read()
     * // Output: { blogLandingPage: { id: 1, path: '/blog' } }
     * ```
     */
    unpopulate(): SingleQueryBuilder<CollectionName, ReturnableFieldName, CastedFieldType[CollectionName]>;
    /**
     * Check whether the query results will be returned with casted or populated field values.
     *
     * @example
     * ```typescript
     * query('settings').getFieldValueType() // 'casted'
     * query('settings').populate().getFieldValueType() // 'populated'
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
     * await query('settings').select({ blogLandingPage: true }).read()
     * // Output: { blogLandingPage: 1 }
     *
     * // With population:
     * await query('settings').select({ blogLandingPage: true }).setFieldValueType('populated').read()
     * // Output: { blogLandingPage: { id: 1, path: '/blog' } }
     * ```
     */
    setFieldValueType(type: 'casted'): SingleQueryBuilder<CollectionName, ReturnableFieldName, CastedFieldType[CollectionName]>;
    setFieldValueType(type: 'populated'): SingleQueryBuilder<CollectionName, ReturnableFieldName, PopulatedFieldType[CollectionName] & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }>;
    setFieldValueType(type: 'casted' | 'populated'): SingleQueryBuilder<CollectionName, ReturnableFieldName, (CastedFieldType[CollectionName] | PopulatedFieldType[CollectionName]) & {
        [key in keyof CastedFieldType[CollectionName]]: unknown;
    }>;
    /**
     * Revalidate fields after fetching from the database and set their values to default if validation fails.
     * This prevents returning invalid existing data in case field or collection definitions are updated.
     *
     * By default, fallback validation is enabled.
     */
    fallback(): SingleQueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType>;
    /**
     * Disable field validation after fetching, potentially speeding up database queries.
     * Beware that this may result in invalid data if field or collection definitions change.
     *
     * By default, fallback validation is enabled.
     */
    noFallback(): SingleQueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType>;
    /**
     * Set the language for the validation messages returned by the query builder.
     *
     * By default, the language is set to the language code defined in the module option `language.primary`.
     */
    contextLanguage(language: SupportedLanguage): SingleQueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType>;
    /**
     * Get a copy of the current query builder options.
     */
    getOptions(): {
        table: string;
        selectedFields: string[];
        languageOption: "en";
        populateOption: boolean;
        fallbackOption: boolean;
        contextLanguageOption: "en";
    };
    /**
     * Create a new query builder with the same state as this one.
     */
    clone(): SingleQueryBuilder<CollectionName, ReturnableFieldName, ReturnedFieldType>;
    /**
     * Reset all query builder options to their default values.
     */
    reset(): SingleQueryBuilder<CollectionName, SelectableFieldName[CollectionName], CastedFieldType[CollectionName]>;
    /**
     * Retrieve collection data that corresponds to the current query parameters.
     *
     * @example
     * ```typescript
     * // Read the 'settings' collection
     * await query('settings').read()
     * // Output: { field1: '...', field2: '...', ... }
     * ```
     */
    read(): Promise<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Validate the `input` data.
     *
     * @returns A Promise that resolves to an object containing validation errors for fields with failed validation.
     */
    validate(input: Record<string, any>, operation: 'read' | 'update', skipFields?: string[]): Promise<ValidationError<ReturnableFieldName>>;
    /**
     * Update fields of a single-entry collection.
     *
     * @returns A Promise that resolves to an `UpdateResult` object.
     *          If successful, the updated fields will be available in the `record` property.
     *          If there are any field validation errors, they will be available in the `errors` property.
     *          The `message` property may contain an optional error message if there are issues during the database query.
     *
     * @example
     * ```typescript
     * const result = await query('settings').update({
     *   logo: 2,
     *   blogLandingPage: 15,
     *   copyright: '2077',
     * })
     *
     * if (result.success) {
     *   console.log('Updated record:', result.record)
     * } else {
     *   console.error('Update failed:', result.errors)
     * }
     * ```
     */
    update(input: UpdateInput[CollectionName]): Promise<UpdateResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    private applySequelizeWhere;
    private validateAndFallbackDataAfterFetch;
    private populateRecord;
    private prepareInput;
    private getImmutableFields;
    private getOperableFields;
    private sanitize;
    private applyConditionalLogic;
    private hasNonCachedFieldInSelect;
    private generateCacheKey;
    private storeInCache;
    private readFromCache;
    protected clearCache(): Promise<void>;
    private ensureRecord;
}
export {};
