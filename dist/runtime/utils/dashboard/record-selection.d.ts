import { type Ref } from '#imports';
import type { ResolvedCollectionDefinition } from '../../collections/collection.definition.js';
import type { Filter } from './filter.js';
export type SelectionRecord = Record<string, any> & {
    id: number;
};
export declare class RecordSelection {
    private collection;
    private data;
    selected: Ref<Record<number | string, true>>;
    count: Ref<number>;
    selectedAll: Ref<boolean>;
    type: Ref<{
        singular: string;
        plural: string;
    }>;
    currentType: Ref<string>;
    private origin;
    private total;
    private allIds;
    constructor(collection: Pick<ResolvedCollectionDefinition, 'label' | 'name'>, data?: SelectionRecord[]);
    setData(data: SelectionRecord[]): this;
    setTotal(total: number): this;
    select(record: SelectionRecord | number, event?: MouseEvent): this;
    selectAllOnThisPage(): this;
    selectAll(filter: Filter): Promise<this>;
    deselect(record: SelectionRecord | number, event?: MouseEvent): this;
    deselectAll(): this;
    delete(): Promise<void>;
    clone(): RecordSelection;
    private refresh;
}
