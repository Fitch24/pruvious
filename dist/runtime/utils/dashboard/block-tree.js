import { defaultFieldValues } from "#pruvious/dashboard";
import { layouts } from "#pruvious/layouts";
import { usePruviousDashboard } from "../../composables/dashboard/dashboard.js";
import { sortNatural } from "../../utils/array.js";
import { isDefined } from "../../utils/common.js";
import { deepClone, getProperty } from "../../utils/object.js";
import { BlockTreeItem } from "./block-tree-item.js";
export class BlockTree {
  blocks = {};
  allowedBlocks = [];
  allowedRootBlocks = [];
  slotLabelCache = {};
  allowedChildBlocksInSlotCache = {};
  data;
  layout = null;
  errors = {};
  collection;
  blocksField;
  constructor(blockData, collection, errors, layout = null) {
    this.collection = collection;
    this.blocksField = this.collection.contentBuilder.blocksField;
    this.layout = layout;
    this.resolveAllowedBlocks();
    this.setData(blockData);
    this.setErrors(errors);
  }
  setData(data) {
    this.blocks = {};
    this.data = data;
    for (const { item, key } of this.walkBlockData(data, this.blocksField)) {
      this.blocks[key] = new BlockTreeItem(item, key, this);
    }
    this.resolveErrors();
  }
  setLayout(layout) {
    this.layout = layout;
    this.resolveAllowedBlocks();
    for (const block of Object.values(this.blocks)) {
      for (const slot of Object.values(block.slots)) {
        slot.resolveAllowedChildBlocksInSlot();
      }
    }
    this.setData(this.data);
  }
  setErrors(errors) {
    this.errors = errors;
    this.resolveErrors();
  }
  clearErrors() {
    this.errors = {};
    this.resolveErrors();
  }
  addBlock(blockName, index) {
    const dashboard = usePruviousDashboard();
    const key = `${this.blocksField}.${index ?? this.data.length}`;
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
    if (isDefined(index)) {
      this.mutateBlockKeysAfterIndex(index - 1, 1, this.blocksField);
      this.data.splice(index, 0, newBlock);
    } else {
      this.data.push(newBlock);
    }
    this.blocks[key] = new BlockTreeItem(newBlock, key, this);
    return key;
  }
  duplicateBlock(blockKey) {
    const duplicate = deepClone(this.blocks[blockKey].item);
    const keyPrefix = blockKey.split(".").slice(0, -1).join(".");
    const oldIndex = Number(blockKey.split(".").pop());
    const parent = getProperty({ [this.blocksField]: this.data }, keyPrefix);
    const newKey = `${keyPrefix}.${oldIndex + 1}`;
    this.mutateBlockKeysAfterIndex(oldIndex, 1, keyPrefix);
    parent.splice(oldIndex + 1, 0, duplicate);
    this.blocks[newKey] = new BlockTreeItem(duplicate, newKey, this);
    return this.blocks[newKey];
  }
  deleteBlock(blockKey) {
    const block = this.blocks[blockKey];
    if (block) {
      const index = Number(blockKey.split(".").pop());
      const prefix = blockKey.split(".").slice(0, -1).join(".");
      const parent = getProperty({ [this.blocksField]: this.data }, prefix);
      parent.splice(index, 1);
      for (const key of Object.keys(this.blocks)) {
        if (key === blockKey || key.startsWith(`${blockKey}.`)) {
          delete this.blocks[key];
        }
      }
      this.mutateBlockKeysAfterIndex(index, -1, blockKey.split(".").slice(0, -1).join("."));
    }
  }
  mutateBlockKeysAfterIndex(index, offset, keyPrefix) {
    const keys = sortNatural(Object.keys(this.blocks).filter((key) => key.startsWith(`${keyPrefix}.`)));
    if (offset > 0) {
      keys.reverse();
    }
    for (const key of keys) {
      const keyIndex = Number(key.replace(`${keyPrefix}.`, "").split(".").shift());
      if (keyIndex > index) {
        const newKey = key.replace(`${keyPrefix}.${keyIndex}`, `${keyPrefix}.${keyIndex + offset}`);
        this.blocks[newKey] = this.blocks[key].setKey(newKey);
        delete this.blocks[key];
        this.errors = Object.fromEntries(
          Object.entries(this.errors).map(([key2, value]) => [
            key2.startsWith(`${keyPrefix}.${keyIndex}.`) ? key2.replace(`${keyPrefix}.${keyIndex}.`, `${keyPrefix}.${keyIndex + offset}.`) : key2 === `${keyPrefix}.${keyIndex}` ? `${keyPrefix}.${keyIndex + offset}` : key2,
            value
          ])
        );
      }
    }
    this.resolveErrors();
  }
  async moveBlock(fromKey, toKey) {
    const fromPrefix = fromKey.split(".").slice(0, -1).join(".");
    const toPrefix = toKey.split(".").slice(0, -1).join(".");
    const fromIndex = Number(fromKey.split(".").pop());
    const toIndex = Number(toKey.split(".").pop());
    const fromParent = getProperty({ [this.blocksField]: this.data }, fromPrefix);
    const toParent = getProperty({ [this.blocksField]: this.data }, toPrefix);
    const block = fromParent[fromIndex];
    fromParent.splice(fromIndex, 1);
    toParent.splice(toIndex, 0, block);
    this.clearErrors();
    this.setData(this.data);
    if (fromPrefix !== toPrefix && toPrefix.startsWith(fromPrefix)) {
      const toTmpIndex = Number(toPrefix.replace(fromPrefix, "").slice(1).split(".").shift());
      if (fromIndex < toTmpIndex) {
        return toPrefix.replace(`${fromPrefix}.${toTmpIndex}`, `${fromPrefix}.${toTmpIndex - 1}`) + `.${toIndex}`;
      }
    }
    return toKey;
  }
  async moveBlockUp(blockKey) {
    const index = Number(blockKey.split(".").pop());
    if (index > 0) {
      const prefix = blockKey.split(".").slice(0, -1).join(".");
      await this.moveBlock(blockKey, `${prefix}.${index - 1}`);
      return `${prefix}.${index - 1}`;
    }
    return blockKey;
  }
  async moveBlockDown(blockKey) {
    const index = Number(blockKey.split(".").pop());
    const prefix = blockKey.split(".").slice(0, -1).join(".");
    const parent = getProperty({ [this.blocksField]: this.data }, prefix);
    if (index < parent.length - 1) {
      await this.moveBlock(blockKey, `${prefix}.${index + 1}`);
      return `${prefix}.${index + 1}`;
    }
    return blockKey;
  }
  fingerprint(blockKey) {
    const block = this.blocks[blockKey];
    if (block) {
      const keyParts = blockKey.split(".");
      const fingerprint = [];
      for (const [i, part] of keyParts.entries()) {
        fingerprint.push(part);
        if ((+part).toString() === part) {
          const _block = this.blocks[keyParts.slice(0, i).join(".") + `.${part}`];
          if (_block) {
            fingerprint.push(_block.item.block.name);
            for (const child of Object.values(_block.slots)) {
              const children = getProperty(
                { [this.blocksField]: this.data },
                keyParts.slice(0, i).join(".") + `.${part}.block.slots.${child.slotName}`
              ) ?? [];
              if (children.length) {
                fingerprint.push(`[${child.slotName}:${children.map(({ block: block2 }) => block2.name).join(",")}]`);
              } else {
                fingerprint.push(`[${child.slotName}]`);
              }
            }
          } else {
            return null;
          }
        }
      }
      return fingerprint.join(".");
    }
    return null;
  }
  getParentBlock(key) {
    const keyParts = key.split(".");
    const parentKey = keyParts.slice(0, -1).join(".").replace(/\.block\.slots\.[^.]+$/, "");
    const parent = this.blocks[parentKey];
    return parent ?? null;
  }
  getAllowedParentBlocks(key) {
    const keyParts = key.split(".");
    const parentKey = keyParts.slice(0, -1).join(".").replace(/\.block\.slots\.[^.]+$/, "");
    const parent = this.blocks[parentKey];
    if (parent) {
      const slotName = keyParts[keyParts.length - 2];
      return parent.slots[slotName].allowedBlocks;
    }
    return this.allowedRootBlocks;
  }
  resolveErrors() {
    for (const block of Object.values(this.blocks)) {
      block.errorCount = Object.keys(this.errors).filter((key) => {
        const startsWith = key.startsWith(`${block.key}.`);
        if (startsWith) {
          const matchesOtherBlock = Object.keys(this.blocks).some((otherKey) => {
            return otherKey !== block.key && key.startsWith(`${otherKey}.`);
          });
          if (matchesOtherBlock) {
            const rest = key.replace(block.key, "");
            const blockOcc = (rest.match(/\.block\./g) || []).length;
            return blockOcc < 2;
          } else {
            return true;
          }
        }
        return false;
      }).length;
      block.errorMessage = this.errors[block.key] ?? null;
      if (block.errorMessage) {
        block.errorCount++;
      }
    }
  }
  resolveAllowedBlocks() {
    const dashboard = usePruviousDashboard();
    const allBlocks = Object.keys(dashboard.value.blocks);
    const layout = this.layout ? layouts[this.layout] : null;
    const cb = this.collection.contentBuilder;
    const collectionAllowedBlocks = !cb.allowedBlocks || cb.allowedBlocks === "*" ? allBlocks : cb.allowedBlocks;
    const collectionAllowedRootBlocks = !cb.rootBlocks || cb.rootBlocks === "*" ? allBlocks : cb.rootBlocks;
    const layoutAllowedBlocks = !layout?.allowedBlocks || layout.allowedBlocks === "*" ? allBlocks : layout.allowedBlocks;
    const layoutAllowedRootBlocks = !layout?.allowedRootBlocks || layout.allowedRootBlocks === "*" ? allBlocks : layout.allowedRootBlocks;
    const combined = [collectionAllowedBlocks, layoutAllowedBlocks];
    const combinedRoot = [...combined, collectionAllowedRootBlocks, layoutAllowedRootBlocks];
    this.allowedBlocks = combined.reduce((prev, curr) => prev.filter((block) => curr.includes(block)));
    this.allowedRootBlocks = combinedRoot.reduce((prev, curr) => prev.filter((block) => curr.includes(block)));
    this.allowedChildBlocksInSlotCache = {};
  }
  *walkBlockData(data, keyPrefix = "") {
    for (const [i, item] of data.entries()) {
      for (const [slotName, slot] of Object.entries(item.block.slots ?? {})) {
        yield* this.walkBlockData(
          slot,
          keyPrefix ? `${keyPrefix}.${i}.block.slots.${slotName}` : `${i}.block.slots.${slotName}`
        );
      }
      yield { item, key: keyPrefix ? `${keyPrefix}.${i}` : `${i}` };
    }
  }
}
