import { query } from "../collections/query.js";
import { mergeDefaults } from "../utils/object.js";
export async function* walkBlocks(blocks, options = {}) {
  const resolvedOptions = mergeDefaults(options, {
    populatePresets: true,
    fullPresetPath: false,
    pathPrefix: "",
    freezePaths: false
  });
  for (const [i, { block }] of blocks.entries()) {
    if (block.name === "Preset") {
      if (resolvedOptions.populatePresets) {
        const preset = await query("presets").select({ blocks: true }).where("id", block.fields.preset).first();
        if (preset) {
          yield* walkBlocks(preset.blocks, {
            ...resolvedOptions,
            pathPrefix: resolvedOptions.freezePaths ? resolvedOptions.pathPrefix : resolvedOptions.pathPrefix ? `${resolvedOptions.pathPrefix}.${i}` : `${i}`,
            freezePaths: !resolvedOptions.fullPresetPath,
            isRootPresetBlock: true,
            isNestedPresetBlock: !!resolvedOptions.isRootPresetBlock
          });
        }
      }
    } else {
      for (const [slotName, slot] of Object.entries(block.slots ?? {})) {
        yield* walkBlocks(slot, {
          ...resolvedOptions,
          pathPrefix: resolvedOptions.freezePaths ? resolvedOptions.pathPrefix : resolvedOptions.pathPrefix ? `${resolvedOptions.pathPrefix}.${i}.slots.${slotName}` : `${i}.slots.${slotName}`,
          isNestedPresetBlock: !!resolvedOptions.isRootPresetBlock
        });
      }
      const path = resolvedOptions.freezePaths ? resolvedOptions.pathPrefix : resolvedOptions.pathPrefix ? `${resolvedOptions.pathPrefix}.${i}` : `${i}`;
      yield {
        block,
        path,
        isRootPresetBlock: !!resolvedOptions.isRootPresetBlock,
        isNestedPresetBlock: !!resolvedOptions.isNestedPresetBlock
      };
    }
  }
}
