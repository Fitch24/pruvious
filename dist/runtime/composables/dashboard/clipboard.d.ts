import { type Ref } from '#imports';
import type { BlocksRepeaterItem } from '../../utils/dashboard/block-tree.js';
export type PruviousClipboard = {
    pruviousClipboardType: 'block';
    payload: BlocksRepeaterItem;
};
/**
 * The current clipboard state.
 */
export declare const usePruviousClipboard: () => Ref<PruviousClipboard | null>;
/**
 * Copy something to the clipboard.
 */
export declare function copyToClipboard(type: PruviousClipboard['pruviousClipboardType'], payload: any): Promise<void>;
