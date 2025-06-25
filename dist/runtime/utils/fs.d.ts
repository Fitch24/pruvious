interface FileFilter {
    startsWith?: string | string[];
    startsWithout?: string | string[];
    endsWith?: string | string[];
    endsWithout?: string | string[];
}
/**
 * Recursively walks through a `directory` and yields all files that match the provided `filter`.
 */
export declare function walkDir(directory: string, filter?: FileFilter, rootDirectory?: string): IterableIterator<{
    file: string;
    directory: string;
    fullPath: string;
    relativePath: string;
}>;
/**
 * Write the specified content to a file, but only if it differs from the current content.
 */
export declare function write(file: string, content: string): void;
/**
 * Remove all files in a `directory`, except for the ones defined in the `except` parameter.
 */
export declare function removeExcept(directory: string, except: string[]): void;
/**
 * Create a relative module import path.
 */
export declare function relativeImport(fromDir: string, to: string): string;
/**
 * Create a relative `.pruvious` module import path.
 */
export declare function relativeDotPruviousImport(...modulePath: string[]): string;
export {};
