import type { useRuntimeConfig } from '#imports';
export declare const imageTypes: string[];
/**
 * Get the public URL of an uploaded file.
 * When using the local drive, the URL will be an absolute path.
 */
export declare function getPublicFilePath(upload: {
    directory: string;
    filename: string;
}, runtimeConfig: ReturnType<typeof useRuntimeConfig>): string;
/**
 * Parse the upload directory name from a string.
 *
 * @example
 * ```typescript
 * parseMediaDirectoryName('/')   // ''
 * parseMediaDirectoryName('foo') // foo/'
 * ```
 */
export declare function parseMediaDirectoryName(value: string): string;
