import type { CastedFieldType, MultiCollectionName } from '#pruvious';
import type { QueryBuilderInstance } from '../utility-types.js';
/**
 * Fetch a subset of records from a multi-entry collection based on the provided query and operation.
 * The original query remains unaltered, and the field values of the returned records are not populated.
 * Optionally, you can provide `cache` data to optimize retrieval within collection and field guards.
 */
export declare function fetchSubsetRecords<CollectionName extends MultiCollectionName>(query: QueryBuilderInstance<CollectionName>, operation: 'create' | 'read' | 'update' | 'delete', cache?: {
    data: Record<string, any>;
    key: string;
}): Promise<CastedFieldType[CollectionName][]>;
