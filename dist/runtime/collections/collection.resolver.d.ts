import type { ResolvedCollectionDefinition } from './collection.definition.js';
export interface ResolvedCollection {
    definition: ResolvedCollectionDefinition;
    source: string;
    isStandard: boolean;
}
export declare function resolveCollections(): {
    records: Record<string, ResolvedCollection>;
    errors: number;
};
export declare function clearCachedCollection(path: string): void;
export declare function getStandardCollectionNames(): string[];
