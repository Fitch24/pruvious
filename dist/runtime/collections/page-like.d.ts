import type { BlockName, CollectionField, LayoutName, PrimaryLanguage, PruviousIcon, SupportedLanguage } from '#pruvious';
import { type MultiEntryCollectionDefinition } from './collection.definition.js';
export interface PageLikeCollectionOptions {
    /**
     * The collection name.
     */
    name: string;
    /**
     * The URL path prefix for the collection records (e.g., 'docs').
     * The prefix can be specified for each supported language separately using an object with language codes as keys.
     *
     * @default ''
     */
    pathPrefix?: string | (Record<PrimaryLanguage, string> & Partial<Record<SupportedLanguage, string>>);
    /**
     * An array of block names allowed to be used in the block builder.
     *
     * By default, all blocks are permitted.
     *
     * @default '*'
     */
    allowedBlocks?: BlockName[] | '*';
    /**
     * An array of block names allowed as top-level blocks in the block builder.
     *
     * Note: Root blocks must also be included in the `allowedBlocks` array.
     *
     * By default, all blocks are permitted as top-level blocks.
     *
     * @default '*'
     */
    rootBlocks?: BlockName[] | '*';
    /**
     * An array of layout names allowed to be used for the collection records.
     *
     * By default, all layouts are permitted.
     *
     * @default '*'
     */
    allowedLayouts?: LayoutName[] | '*';
    /**
     * Additional fields to add to the collection.
     */
    additionalFields?: Record<string, CollectionField>;
    /**
     * An array of additional fields to include in the public page response (e.g. `['createdAt', 'author', ...]`).
     * These fields will be included in the `fields` property of the response for the `pages.get` and `previews.get` API endpoints.
     *
     * @default []
     */
    additionalPublicPagesFields?: string[];
    /**
     * The lowercased label to use for the record in the dashboard.
     */
    recordLabel?: {
        singular: string;
        plural: string;
    };
    /**
     * The icon used for this collection in the dashboard.
     *
     * @default 'Note'
     */
    icon?: PruviousIcon;
}
/**
 * Create a collection definition for a page-like collection.
 */
export declare function pageLikeCollection(options: PageLikeCollectionOptions): MultiEntryCollectionDefinition;
