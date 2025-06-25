import type { BlockName, CollectionName, ResolvedCollectionDefinition } from '#pruvious';
import type { DashboardCollectionFields } from '../composables/dashboard/dashboard.js';
declare const _default: import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<{
    blocks: {
        [k: string]: {
            name: BlockName;
            label: string;
            icon: string;
            fields: any;
            slots: Record<string, import("#pruvious").Slot>;
            description: string;
        };
    };
    collections: Record<string, Pick<ResolvedCollectionDefinition, "name" | "publicPages" | "mode" | "label" | "apiRoutes" | "contentBuilder" | "translatable"> & {
        canDuplicate: boolean;
        dashboard: Omit<ResolvedCollectionDefinition["dashboard"], "icon"> & {
            icon: string;
        };
        fields: DashboardCollectionFields;
        search: boolean;
    }>;
    isCacheActive: boolean;
    legalLinks: {
        label: string;
        url: string;
    }[];
    menu: {
        collection?: CollectionName;
        icon: string;
        label: string;
        path: string;
        priority: number;
    }[];
}>>;
export default _default;
