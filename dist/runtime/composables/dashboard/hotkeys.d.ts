export type HotkeyAction = 'close' | 'copy' | 'cut' | 'delete' | 'duplicate' | 'moveDown' | 'moveUp' | 'paste' | 'redo' | 'save' | 'undo';
export declare const platform: any;
export declare const isMac: boolean;
export declare const metaKey: string;
export declare const hotkeys: {
    close: string;
    copy: string;
    cut: string;
    delete: string;
    duplicate: string;
    moveDown: string;
    moveUp: string;
    paste: string;
    redo: string;
    save: string;
    undo: string;
};
export declare function cmdPlus(letter: string, event: KeyboardEvent): boolean;
/**
 * Get the hotkey action from a keyboard event.
 */
export declare function getHotkeyAction(event: KeyboardEvent): HotkeyAction | null;
