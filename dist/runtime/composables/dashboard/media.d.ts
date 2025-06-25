import { type Ref } from '#imports';
import type { CastedFieldType, CreateInput } from '#pruvious';
import { type MediaDirectoryTreeItem } from '../../utils/dashboard/media-directory.js';
import { MediaSelection } from '../../utils/dashboard/media-selection.js';
export interface MediaData {
    directories: MediaDirectory[];
    uploads: MediaUpload[];
}
export interface MediaDirectory {
    name: string;
    path: string;
}
export interface MediaMoveTargetDirectory extends MediaDirectory {
    children: MediaMoveTargetDirectory[];
    disabled: boolean;
}
export interface MediaLibraryPopupOptions {
    allowedTypes?: string[] | Record<string, true>;
    directory?: string;
    minHeight?: number;
    minWidth?: number;
    pickCallback?: PickCallback;
}
export type MediaUpload = CastedFieldType['uploads'] & {
    extension: string;
    isImage: boolean;
};
export type PickCallback = (upload: CastedFieldType['uploads']) => any | Promise<any>;
/**
 * The upload dialog (`<input type="file">`) observable.
 */
export declare const useUploadDialog: () => Ref<{
    accept: string | undefined;
    directory: string;
}>;
/**
 * The media library popup observable.
 */
export declare const useMediaLibraryPopup: () => Ref<MediaLibraryPopupOptions | null>;
/**
 * The edit media upload popup observable.
 */
export declare const useMediaUploadPopup: () => Ref<{
    upload: CastedFieldType['uploads'];
} | null>;
/**
 * The create/rename media directory popup observable.
 */
export declare const useMediaDirectoryPopup: () => Ref<{
    action: 'create';
    parentDirectory: string;
} | {
    action: 'rename';
    directory: string;
} | null>;
/**
 * Counter for media clear events.
 */
export declare const useMediaClear: () => Ref<number>;
/**
 * Counter for media update events.
 */
export declare const useMediaUpdated: () => Ref<number>;
/**
 * The last opened media directory.
 */
export declare const useLastMediaDirectory: () => Ref<string>;
/**
 * The media directory tree.
 */
export declare const useMediaDirectories: () => Ref<MediaDirectoryTreeItem>;
/**
 * Open the upload dialog (`<input type="file">`) from any component within the base layout.
 * Allowed file types can be specified as an array of file extensions (e.g., `['jpg', 'png']`).
 * If no file types are specified, all files are allowed.
 */
export declare function openUploadDialog(directory: string, accept?: string[]): void;
/**
 * Open the media library popup from any component within the base layout and pick a file.
 *
 * Options:
 * - `pickCallback` - A callback function will be called with the picked file as the first argument.
 * - `allowedTypes` - Allowed media types can be specified as file extensions or mime types (e.g., `['image/jpeg', 'png']`).
 * - `minWidth` - The minimum allowed image width in pixels.
 * - `minHeight` - The minimum allowed image height in pixels.
 */
export declare function openMediaLibraryPopup(options?: MediaLibraryPopupOptions): void;
/**
 * Close the media library popup from any component within the base layout.
 */
export declare function closeMediaLibraryPopup(): void;
/**
 * Open the edit media upload popup from any component within the base layout.
 */
export declare function editMediaUpload(upload: CastedFieldType['uploads']): void;
/**
 * Open the create media directory popup from any component within the base layout.
 */
export declare function createMediaDirectory(parentDirectory: string): void;
/**
 * Open the rename media directory popup from any component within the base layout.
 */
export declare function renameMediaDirectory(directory: string): void;
/**
 * Upload one or more files to the server.
 */
export declare function upload(input: CreateInput['uploads'] | CreateInput['uploads'][]): Promise<number>;
/**
 * Move a media selection to a new directory.
 */
export declare function moveSelection(selection: MediaSelection, to: string): Promise<boolean>;
export declare function fetchDirectories(): Promise<void>;
