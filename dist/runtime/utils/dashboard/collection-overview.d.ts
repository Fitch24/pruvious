import { type Ref } from '#imports';
import { type CastedFieldType, type CollectionName, type Field, type SupportedLanguage } from '#pruvious';
import type { ResolvedCollectionDefinition } from '../../collections/collection.definition.js';
import { Filter } from './filter.js';
import type { RecordSelection } from './record-selection.js';
export declare class CollectionOverview<T extends CollectionName> {
    private collection;
    filter: Filter;
    selection: RecordSelection;
    private language;
    data: Ref<(CastedFieldType[T] & {
        id: number;
    })[]>;
    hasDefaultColumns: Ref<boolean>;
    total: Ref<number>;
    currentPage: Ref<number>;
    lastPage: Ref<number>;
    loaded: Ref<boolean>;
    private prevQuery;
    private defaultFilter;
    constructor(collection: Pick<ResolvedCollectionDefinition, 'name' | 'translatable'> & {
        dashboard: Omit<ResolvedCollectionDefinition['dashboard'], 'icon'>;
        fields: Record<string, Pick<Field, 'options' | 'type'>>;
    }, filter: Filter, selection: RecordSelection, language: SupportedLanguage);
    updateDefaultLanguage(language: SupportedLanguage): void;
    fetchData(): Promise<void>;
    updateLocation(): Promise<void>;
    setFilterFromQueryString(queryString: string): void;
    clearFilters(): void;
    private refresh;
}
