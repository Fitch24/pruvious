import { type Ref } from '#imports';
interface ClickConfirmation {
    target: Element;
    id?: string;
    success?: (event?: MouseEvent) => any | Promise<any>;
    fail?: (event?: MouseEvent) => any | Promise<any>;
}
export declare const useClickConfirmation: () => Ref<ClickConfirmation | undefined>;
/**
 * Call a `success` callback if the user clicks on the `target` element twice.
 * Otherwise, call a `fail` callback.
 * The mouse cursor must be over the `target` element when the second click occurs and cannot leave the element.
 */
export declare function confirmClick(options: ClickConfirmation): Promise<void>;
export {};
