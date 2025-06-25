import { type Ref } from '#imports';
import type { MediaData, MediaUpload } from '../../composables/dashboard/media.js';
export declare class MediaSelection {
    private data;
    directories: Ref<Record<string, true>>;
    uploads: Ref<Record<number, MediaUpload>>;
    origin: Ref<{
        type: 'directory';
        directory: string;
    } | {
        type: 'upload';
        uploadId: number;
    } | null>;
    count: Ref<number>;
    type: Ref<{
        singular: string;
        plural: string;
    }>;
    currentType: Ref<string>;
    constructor(data?: MediaData);
    setData(data: MediaData): void;
    selectDirectory(directory: string, event?: MouseEvent): void;
    selectUpload(upload: MediaUpload, event?: MouseEvent): void;
    deselectDirectory(directory: string, event?: MouseEvent): void;
    deselectUpload(upload: MediaUpload, event?: MouseEvent): void;
    deselectAll(): void;
    clone(): MediaSelection;
    private refresh;
}
