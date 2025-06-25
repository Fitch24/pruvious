import type { CollectionFieldName, CollectionName } from '#pruvious';
import { H3Event } from 'h3';
interface Options {
    /**
     * Custom error messages.
     */
    customErrorMessages?: {
        /**
         * A custom error message displayed when the request body contains a nonexistent field.
         *
         * @default "The field '$field' does not exist"
         */
        nonExistentField?: string;
        /**
         * A custom error message displayed when the request body format is not a regular object.
         *
         * @default 'The request body must be an object with key-value pairs'
         */
        notObject?: string;
        /**
         * A custom error message displayed when the request body format is not a regular object nor an array.
         *
         * @default 'The request body must be either an object with key-value pairs or an array containing key-value objects'
         */
        notObjectOrArray?: string;
    };
    /**
     * Specifies the current request `operation` that defines the parsing logic for the request body.
     *
     * If the `operation` parameter is not provided, it will be resolved based on the current HTTP method:
     * - `POST` - Create operation
     * - `PATCH` - Update operation
     */
    operation?: 'create' | 'update';
    /**
     * Represents the current request body.
     *
     * If not specified, the `body` will be automatically resolved from the current `event`.
     */
    body?: Record<string, any> | Record<string, any>[];
}
/**
 * Parse the request body and retrieve an object with resolved (but not validated) input `data` for a specified `collection`.
 * Additionally, the returned object contains a list of `errors` found while resolving the input, such as when nonexistent
 * fields are provided.
 *
 * The function automatically extracts the current request body from the `event` argument.
 * You can modify this behavior by customizing the `options` argument.
 *
 * @example
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   const { data, errors } = await readInputData(event, 'products')
 *
 *   // Example: POST http://localhost:3000/api/collections/products
 *   console.log(data)
 *   // Output: { name: 'Product name', price: 10 }
 * })
 * ```
 */
export declare function readInputData<T extends CollectionName>(event: H3Event, collection: T, options?: Options): Promise<{
    /**
     * Key-value pairs or an array of key-value pairs where keys represent existing field names in the associated collection,
     * and values represent corresponding input field values.
     *
     * @example
     * ```typescript
     * export default defineEventHandler(async (event) => {
     *   const { data } = await readInputData(event, 'products')
     *   return query('products').create(data)
     * })
     * ```
     */
    data: T extends 'uploads' ? Partial<Record<CollectionFieldName[T], any> & {
        $file: File;
    }> | Partial<Record<CollectionFieldName[T], any> & {
        $file: File;
    }>[] : Partial<Record<CollectionFieldName[T], any>> | Partial<Record<CollectionFieldName[T], any>>[];
    /**
     * Array of error messages generated during input data reading.
     *
     * @example
     * ```typescript
     * export default defineEventHandler(async (event) => {
     *   const { errors } = await readInputData(event, 'products')
     *
     *   if (errors.length) {
     *     setResponseStatus(event, 400)
     *     return errors.join('\n')
     *   }
     * })
     * ```
     */
    errors: string[];
}>;
/**
 * Read the request body from a given `event`.
 */
export declare function pruviousReadBody(event: H3Event): Promise<Record<string, any> | Record<string, any>[]>;
export {};
