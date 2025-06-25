import { type BlockName, type CastedBlockData, type LayoutName } from '#pruvious';
import { type SimpleCollection } from '../../composables/dashboard/dashboard.js';
import { BlockTreeItem } from './block-tree-item.js';
export interface BlocksRepeaterItem {
    block: CastedBlockData;
}
export declare class BlockTree {
    blocks: Record<string, BlockTreeItem>;
    allowedBlocks: BlockName[];
    allowedRootBlocks: BlockName[];
    slotLabelCache: Record<string, string>;
    allowedChildBlocksInSlotCache: Record<string, BlockName[]>;
    data: BlocksRepeaterItem[];
    layout: LayoutName | null;
    errors: Record<string, string>;
    collection: SimpleCollection;
    blocksField: string;
    constructor(blockData: BlocksRepeaterItem[], collection: SimpleCollection, errors: Record<string, string>, layout?: LayoutName | null);
    setData(data: BlocksRepeaterItem[]): void;
    setLayout(layout: LayoutName | null): void;
    setErrors(errors: Record<string, string>): void;
    clearErrors(): void;
    addBlock(blockName: BlockName, index?: number): string;
    duplicateBlock(blockKey: string): BlockTreeItem;
    deleteBlock(blockKey: string): void;
    mutateBlockKeysAfterIndex(index: number, offset: number, keyPrefix: string): void;
    moveBlock(fromKey: string, toKey: string): Promise<string>;
    moveBlockUp(blockKey: string): Promise<string>;
    moveBlockDown(blockKey: string): Promise<string>;
    fingerprint(blockKey: string): string | null;
    getParentBlock(key: string): BlockTreeItem | null;
    getAllowedParentBlocks(key: string): "Preset"[];
    private resolveErrors;
    private resolveAllowedBlocks;
    private walkBlockData;
}
