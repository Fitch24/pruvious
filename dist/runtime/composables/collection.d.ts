import type { FetchableFieldName, PopulatedFieldType, PublicReadCollectionName, SingleCollectionName } from '#pruvious';
import type { PickFields } from '../collections/query-builder.js';
/**
 * Retrieves data from a public single-entry collection.
 *
 * The colection must have the `mode` property set to `'single'` and the `apiRoutes.read` property set to `'public'`.
 *
 * @param collection The name of the collection.
 * @param fields The fields to fetch. If not specified, all fields will be fetched.
 * @param cache Whether to cache the response. If set to a number, the response will be cached for the specified number of seconds. Defaults to `true` (cache forever).
 */
export declare function getCollectionData<C extends SingleCollectionName & PublicReadCollectionName, F extends FetchableFieldName[C] = FetchableFieldName[C]>(collection: C, fields?: PickFields<FetchableFieldName[C], F> | '*', cache?: boolean | number): Promise<Pick<PopulatedFieldType[C], F & keyof PopulatedFieldType[C]>>;
