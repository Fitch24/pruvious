import { type Ref } from '#imports';
import type { BlockName, CollectionName, Field, ResolvedCollectionDefinition, Slot } from '#pruvious';
import type { LocationQueryValue } from '#vue-router';
import type { NuxtApp } from 'nuxt/app';
import type { NavigateToOptions } from 'nuxt/dist/app/composables/router';
import type { RouteLocationNormalized } from 'vue-router';
import type { CollectionFieldAdditional } from '../../fields/field.definition.js';
import type { ModuleOptions } from '../../module-types.js';
export type DashboardCollectionFields = Record<string, Required<Pick<Field, 'options' | 'type'>> & {
    additional: Pick<CollectionFieldAdditional, 'conditionalLogic'> & Required<Pick<CollectionFieldAdditional, 'emptyLabel' | 'hidden' | 'immutable' | 'protected'>>;
    default: any;
}>;
export type SimpleCollection = Pick<ResolvedCollectionDefinition, 'apiRoutes' | 'contentBuilder' | 'label' | 'mode' | 'name' | 'publicPages' | 'translatable'> & {
    canDuplicate: boolean;
    dashboard: Omit<ResolvedCollectionDefinition['dashboard'], 'icon'> & {
        icon: string;
    };
    fields: DashboardCollectionFields;
    search: boolean;
};
export interface PruviousDashboard {
    /**
     * Resolved block metadata.
     */
    blocks: Record<string, BlockMeta>;
    /**
     * The name of the currently active collection in the dashboard.
     */
    collection: CollectionName | null;
    /**
     * The collections that are visible to the current user.
     */
    collections: Record<string, SimpleCollection>;
    /**
     * Indicates whether the dashboard state has been initialized.
     */
    initialized: boolean;
    /**
     * Indicates whether the CMS is installed by checking for the presence of an admin user.
     */
    installed: boolean;
    /**
     * Indicates whether the cache is active.
     */
    isCacheActive: boolean;
    /**
     * Links displayed beneath forms on authentication screens within the dashboard.
     */
    legalLinks: Required<ModuleOptions['dashboard']>['legalLinks'];
    /**
     * Indicates whether the dashboard metadata has been retrieved from the server.
     */
    loaded: boolean;
    /**
     * The dashboard menu items.
     */
    menu: {
        collection?: CollectionName;
        icon: string;
        label: string;
        path: string;
        priority: number;
    }[];
    /**
     * A normalized array of route parameters after the `dashboard.prefix`.
     *
     * Example: For the URL http://localhost:3000/dashboard/collections/users/1, the `routeParams` will be `['users', '1']`
     */
    routeParams: string[];
    /**
     * Indicates whether the dashboard metadata should be refreshed.
     */
    refresh: boolean;
}
export interface BlockMeta {
    name: BlockName;
    label: string;
    icon: string;
    fields: Record<string, Field>;
    description: string;
    slots: Record<string, Slot>;
}
/**
 * The current Pruvious dashboard state.
 */
export declare const usePruviousDashboard: () => Ref<PruviousDashboard>;
/**
 * Update the Pruvious dashboard state on route and authentication changes.
 *
 * Call this function within the `<script setup>` of the dashboard page.
 */
export declare function updatePruviousDashboard(route: RouteLocationNormalized): Promise<void>;
/**
 * Dynamically register Nuxt plugins.
 */
export declare function registerDynamicPruviousDashboardPlugins(nuxtApp: NuxtApp): void;
/**
 * Navigate to a dashboard `path` (excluding the `dashboardPrefix`).
 *
 * @example
 * ```typescript
 * navigateToPruviousDashboardPath('/collections', 'users', 1)
 * // Navigates to: '/dashboard/collections/users/1'
 * ```
 */
export declare function navigateToPruviousDashboardPath(path: string | number | (string | number)[], options?: (NavigateToOptions & {
    to?: LocationQueryValue | LocationQueryValue[];
}) | undefined, route?: RouteLocationNormalized): string | false | void | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric | Promise<false | void | import("vue-router").NavigationFailure>;
