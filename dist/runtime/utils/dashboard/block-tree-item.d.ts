import type { BlocksRepeaterItem, BlockTree } from './block-tree.js';
import { BlockTreeItemSlot } from './block-tree-item-slot.js';
export declare class BlockTreeItem {
    item: BlocksRepeaterItem;
    key: string;
    tree: BlockTree;
    errorCount: number;
    errorMessage: string | null;
    parentKey: string;
    slots: Record<string, BlockTreeItemSlot>;
    constructor(item: BlocksRepeaterItem, key: string, tree: BlockTree);
    setKey(key: string): this;
}
