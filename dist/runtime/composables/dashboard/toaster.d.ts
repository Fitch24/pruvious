import { type Ref } from '#imports';
export interface ToasterItem {
    message: string;
    type?: 'success' | 'error' | 'info';
    afterRouteChange?: boolean;
}
/**
 * The current Pruvious toaster state.
 */
export declare const usePruviousToaster: () => Ref<Required<ToasterItem> | null>;
/**
 * Show a toaster message.
 */
export declare function pruviousToasterShow(item: ToasterItem): void;
