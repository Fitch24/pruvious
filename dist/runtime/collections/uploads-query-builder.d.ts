import { type CastedFieldType, type CreateInput, type SelectableFieldName, type UpdateInput } from '#pruvious';
import { QueryBuilder, type CreateManyResult, type CreateResult, type UpdateResult, type ValidationError } from './query-builder.js';
export declare class UploadsQueryBuilder<ReturnableFieldName extends SelectableFieldName['uploads'] = SelectableFieldName['uploads'], ReturnedFieldType extends Record<keyof CastedFieldType['uploads'], any> = CastedFieldType['uploads']> extends QueryBuilder<'uploads'> {
    /**
     * Create a new 'uploads' collection record using the provided `input` data.
     * The `input` must include a special `$file` field which should be an instance of a `File` object.
     *
     * @returns A Promise that resolves to a `CreateResult` object.
     *          If the creation is successful, the `record` property will contain the created upload.
     *          If there are any field validation errors, they will be available in the `errors` property.
     *          The `message` property may contain an optional error message if there are issues during the database query.
     *
     * @example
     * ```typescript
     * const result = await query('uploads').create({
     *   directory: 'notes/',
     *   $file: new File(['foo'], 'foo.txt', { type: 'text/plain' }),
     * })
     *
     * if (result.success) {
     *   console.log('Upload was successful:', result.record)
     * } else {
     *   console.error('Upload failed:', result.errors)
     * }
     * ```
     */
    create(input: CreateInput['uploads']): Promise<CreateResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Create multiple records in the 'uploads' collection using the data provided in the `input` array.
     * Each element of `input` represents a record to be created and must include a `$file` field which
     * must be an instance of a `File` object.
     *
     * @returns A Promise that resolves to a `CreateManyResult` object.
     *          If successful, the created uploads will be available in the `records` property.
     *          If any input has validation errors, the `errors` property will contain an array of error objects at the corresponding index.
     *          If there are no errors for a particular input, the value at that index will be `null`.
     *          The `message` property may contain an optional error message for any database query issues.
     *
     * Note: If any input fails validation, no records will be created.
     *
     * @example
     * ```typescript
     * const result = await query('uploads').createMany([
     *   { $file: new File(['foo'], 'foo-1.txt', { type: 'text/plain' }) },
     *   { $file: new File(['foo'], 'foo-2.txt', { type: 'text/plain' }) },
     *   { $file: ['foo'] },
     * ])
     *
     * if (result.success) {
     *   console.log('Uploads created:', result.records)
     * } else {
     *   console.log('Errors:', result.errors) // [null, null, { $file: 'Invalid input type' }]
     * }
     * ```
     */
    createMany(input: CreateInput['uploads'][]): Promise<CreateManyResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Update the existing records in the 'uploads' collection based on the defined conditions.
     *
     * @returns A Promise that resolves to an `UpdateResult` object.
     *          If successful, the updated uploads will be available in the `records` property.
     *          If there are any field validation errors, they will be available in the `errors` property.
     *          The `message` property may contain an optional error message if there are issues during the database query.
     *
     * @example
     * ```typescript
     * // Move all uploads in the 'notes/' directory to the 'archived-notes/' directory
     * const result = await query('uploads').whereLike('directory', 'notes/%').update({
     *   directory: 'archived-notes/',
     * })
     *
     * if (result.success) {
     *   console.log('Records updated:', result.records)
     * } else {
     *   console.error('Update failed:', result.errors)
     * }
     * ```
     */
    update(input: UpdateInput['uploads']): Promise<UpdateResult<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>>;
    /**
     * Delete records from the 'uploads' collection based on the specified conditions.
     *
     * @returns A Promise that resolves to an array containing the deleted uploads.
     *
     * @example
     * ```typescript
     * // Delete all uploads in the 'archived-notes/' directory
     * await query('uploads').select({ id: true }).whereLike('directory', 'archived-notes/%').delete()
     * // Output: [{ id: 30 }, { id: 144 }, { id: 145 }]
     * ```
     */
    delete(): Promise<Pick<ReturnedFieldType, ReturnableFieldName & keyof ReturnedFieldType>[]>;
    validate(input: Record<string, any>, operation: 'create' | 'read' | 'update', allInputs?: Record<string, any>[], skipFields?: string[]): Promise<ValidationError<ReturnableFieldName>>;
    protected serializeInput(input: Record<string, any>): Record<string, any>;
    protected prepareInput<T extends Record<string, any>>(input: T, operation: 'create' | 'update'): T;
    protected getOperableFields(input: Record<string, any>, operation: 'create' | 'read' | 'update'): ("language" | "type" | "description" | "createdAt" | "id" | "updatedAt" | "translations" | "directory" | "height" | "width" | "size" | "filename")[];
    protected sanitize(input: Record<string, any>, operation: 'create' | 'update'): Promise<Record<string, any>>;
    private prepareSelection;
    private revertSelection;
    protected createThumbnail(upload: Pick<CastedFieldType['uploads'], 'id' | 'directory' | 'filename' | 'type'>): Promise<void>;
}
