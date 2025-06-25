import type { WatchEvent } from '@nuxt/schema';
/**
 * Regenerate the contents of the `.pruvious` directory.
 *
 * Logging is enabled by default.
 *
 * The `penalty` parameter adds time in milliseconds to the resulting generation time.
 *
 * @returns The log message and the time required for generating the contents.
 */
export declare function generateDotPruvious(log?: boolean, penalty?: number): Promise<{
    time: number;
    level: 'info' | 'success';
    message: string;
}>;
/**
 * Boot Pruvious by generating the `.pruvious` directory (twice if needed) and launching job workers.
 */
export declare function boot(): Promise<void>;
/**
 * Re-generate the contents of the dynamic `.pruvious` directory on file changes.
 */
export declare function watchPruviousFiles(event: WatchEvent, filePath: string): void;
/**
 * Validate language options, confirming the presence of at least one defined language
 * and ensuring the primary language is among the supported languages.
 */
export declare function validateLanguageOptions(): void;
/**
 * Create the `blocks` and `icons` directory in the Nuxt app if absent.
 */
export declare function createComponentDirectories(): void;
