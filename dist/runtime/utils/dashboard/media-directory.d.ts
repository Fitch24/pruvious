export type MediaDirectoryTreeItem = Record<string, {
    children: MediaDirectoryTreeItem;
}>;
/**
 * Add one or more media directories to the media directory tree.
 */
export declare function addMediaDirectories(directories: string | string[], tree: MediaDirectoryTreeItem): MediaDirectoryTreeItem;
/**
 * Delete one or more media directories from the media directory tree.
 */
export declare function deleteMediaDirectories(directories: string | string[], tree: MediaDirectoryTreeItem): MediaDirectoryTreeItem;
/**
 * List a media directory item from the tree.
 */
export declare function listMediaDirectory(directory: string, tree: MediaDirectoryTreeItem): MediaDirectoryTreeItem | null;
/**
 * Get a media directory item from the tree.
 */
export declare function listMediaDirectoryWithPath(directory: string, tree: MediaDirectoryTreeItem): {
    name: string;
    path: string;
}[] | null;
/**
 * Move a media directory in the media directory tree.
 */
export declare function moveMediaDirectory(source: string, dest: string, tree: MediaDirectoryTreeItem): MediaDirectoryTreeItem;
/**
 * Rename a media directory in the media directory tree.
 */
export declare function renameMediaDirectory(from: string, to: string, tree: MediaDirectoryTreeItem): MediaDirectoryTreeItem;
