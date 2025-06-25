import { type CollectionName, type SupportedLanguage } from '#pruvious';
declare const _default: import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<string | {
    fields: Pick<any, string>;
    link: {
        rel: string;
        type?: string;
        href: string;
        hreflang?: string;
    }[];
    description: string;
    title: string;
    meta: {
        name?: string;
        property?: string;
        content: string;
    }[];
    htmlAttrs: Record<string, string>;
    script: {
        tagPosition?: "bodyClose" | "bodyOpen" | "head";
        type: string;
        src?: string;
        innerHTML?: string;
    }[];
    id: any;
    path: string;
    url: string;
    collection: CollectionName;
    blocks: any;
    language: any;
    translations: Record<SupportedLanguage, string | null>;
    layout: any;
    publishDate: any;
    createdAt: any;
    updatedAt: any;
}>>;
export default _default;
