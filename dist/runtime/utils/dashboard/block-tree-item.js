import { blocks } from "#pruvious/blocks";
import { BlockTreeItemSlot } from "./block-tree-item-slot.js";
export class BlockTreeItem {
  constructor(item, key, tree) {
    this.item = item;
    this.key = key;
    this.tree = tree;
    this.setKey(key);
    for (const [slotName, slot] of Object.entries(blocks[item.block.name].slots)) {
      this.slots[slotName] = new BlockTreeItemSlot(slot, slotName, tree, this);
      for (const [i, childBlock] of item.block.slots[slotName].entries()) {
        const childBlockKey = `${this.key}.block.slots.${slotName}.${i}`;
        tree.blocks[childBlockKey] = new BlockTreeItem(childBlock, childBlockKey, tree);
      }
    }
  }
  errorCount = 0;
  errorMessage = null;
  parentKey = "";
  slots = {};
  setKey(key) {
    this.key = key;
    this.parentKey = key.split(".").slice(0, -1).join(".");
    return this;
  }
}
