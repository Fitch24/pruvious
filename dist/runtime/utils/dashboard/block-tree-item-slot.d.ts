import { type BlockName, type Slot } from '#pruvious';
import type { BlockTree } from './block-tree.js';
import { BlockTreeItem } from './block-tree-item.js';
export declare class BlockTreeItemSlot {
    slot: Slot;
    slotName: string;
    tree: BlockTree;
    treeItem: BlockTreeItem;
    label: string;
    allowedBlocks: BlockName[];
    constructor(slot: Slot, slotName: string, tree: BlockTree, treeItem: BlockTreeItem);
    addBlock(blockName: BlockName, index?: number): string;
    resolveAllowedChildBlocksInSlot(): "Preset"[];
    private resolveSlotLabel;
}
