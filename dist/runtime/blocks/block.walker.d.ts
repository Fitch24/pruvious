import type { BlockInputData, CastedBlockData } from '#pruvious';
/**
 * Recursively walks through an array of blocks.
 */
export declare function walkBlocks(blocks: {
    block: BlockInputData | CastedBlockData;
}[], options?: {
    populatePresets?: boolean;
    fullPresetPath?: boolean;
    pathPrefix?: string;
    freezePaths?: boolean;
    isRootPresetBlock?: boolean;
    isNestedPresetBlock?: boolean;
}): AsyncIterableIterator<{
    block: BlockInputData | CastedBlockData;
    path: string;
    isRootPresetBlock: boolean;
    isNestedPresetBlock: boolean;
}>;
