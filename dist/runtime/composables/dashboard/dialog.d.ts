import { type Ref } from '#imports';
export interface PruviousDialog {
    message: string;
    resolveLabel: string;
    rejectLabel: string;
}
/**
 * The current dialog.
 */
export declare const usePruviousDialog: () => Ref<PruviousDialog | null>;
/**
 * Show a dialog popup.
 */
export declare function pruviousDialog(message: string, labels?: {
    resolve?: string;
    reject?: string;
}): Promise<boolean>;
