import { type PopulatedFieldType, type ResolvedCollectionDefinition } from '#pruvious';
import { H3Event } from 'h3';
import type { PruviousPage } from '../composables/page.js';
/**
 * Create SEO for a page-like collection record.
 */
export declare function seo(collection: ResolvedCollectionDefinition, page: Record<string, any>, event: H3Event): Promise<{
    props: Pick<PruviousPage, 'title' | 'description' | 'htmlAttrs' | 'meta' | 'link' | 'script'>;
    settings: PopulatedFieldType['seo'];
}>;
