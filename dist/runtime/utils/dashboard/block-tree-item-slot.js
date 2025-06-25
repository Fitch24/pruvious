import { defaultFieldValues } from "#pruvious/dashboard";
import { usePruviousDashboard } from "../../composables/dashboard/dashboard.js";
import { __ } from "../../composables/translatable-strings.js";
import { isDefined } from "../../utils/common.js";
import { getProperty } from "../../utils/object.js";
import { titleCase } from "../../utils/string.js";
import { BlockTreeItem } from "./block-tree-item.js";
export class BlockTreeItemSlot {
  constructor(slot, slotName, tree, treeItem) {
    this.slot = slot;
    this.slotName = slotName;
    this.tree = tree;
    this.treeItem = treeItem;
    this.label = this.resolveSlotLabel();
    this.allowedBlocks = this.resolveAllowedChildBlocksInSlot();
  }
  label = "";
  allowedBlocks = [];
  addBlock(blockName, index) {
    const dashboard = usePruviousDashboard();
    const data = getProperty(
      { [this.tree.blocksField]: this.tree.data },
      `${this.treeItem.key}.block.slots.${this.slotName}`
    );
    const key = `${this.treeItem.key}.block.slots.${this.slotName}.${index ?? data.length}`;
    const newBlock = {
      block: {
        name: blockName,
        fields: {},
        slots: Object.fromEntries(Object.keys(dashboard.value.blocks[blockName].slots).map((slot) => [slot, []]))
      }
    };
    for (const [fieldName, field] of Object.entries(dashboard.value.blocks[blockName].fields)) {
      ;
      newBlock.block.fields[fieldName] = isDefined(field.options.default) ? field.options.default : defaultFieldValues[field.type];
    }
    const item = new BlockTreeItem(newBlock, key, this.tree);
    if (isDefined(index)) {
      this.tree.mutateBlockKeysAfterIndex(index - 1, 1, `${this.treeItem.key}.block.slots.${this.slotName}`);
      data.splice(index, 0, newBlock);
      this.tree.blocks[key] = item;
    } else {
      data.push(newBlock);
      this.tree.blocks[key] = item;
    }
    return key;
  }
  resolveAllowedChildBlocksInSlot() {
    const dashboard = usePruviousDashboard();
    const blockName = this.treeItem.item.block.name;
    const cacheKey = `${blockName}.${this.slotName}`;
    if (!this.tree.allowedChildBlocksInSlotCache[cacheKey]) {
      const allowedChildBlocks = !this.slot.allowedChildBlocks || this.slot.allowedChildBlocks === "*" ? Object.keys(dashboard.value.blocks) : this.slot.allowedChildBlocks;
      this.tree.allowedChildBlocksInSlotCache[cacheKey] = [this.tree.allowedBlocks, allowedChildBlocks].reduce(
        (prev, curr) => prev.filter((block) => curr.includes(block))
      );
    }
    return this.tree.allowedChildBlocksInSlotCache[cacheKey];
  }
  resolveSlotLabel() {
    if (!this.tree.slotLabelCache[this.slotName]) {
      this.tree.slotLabelCache[this.slotName] = __(
        "pruvious-dashboard",
        this.slot.label ?? titleCase(this.slotName, false)
      );
    }
    return this.tree.slotLabelCache[this.slotName];
  }
}
