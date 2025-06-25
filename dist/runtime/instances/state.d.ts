import type { RuntimeConfig } from '@nuxt/schema';
import type { ModuleOptions } from '../module-types.js';
type OptionName = Pick<ModuleOptions, 'api' | 'catchAllPages' | 'customCapabilities' | 'dashboard' | 'database' | 'jobs' | 'jwt' | 'language' | 'migration' | 'pageCache' | 'redis' | 'singleCollectionsTable' | 'standardCollections' | 'standardFields' | 'standardHooks' | 'standardJobs' | 'standardMiddleware' | 'standardTranslatableStrings' | 'uploads'> & {
    baseUrl: string;
    layers: string[];
    uploadsDir: string;
};
export declare const intervals: NodeJS.Timer[];
export declare function bootingFinished(): void;
export declare function isBooting(): boolean;
export declare function cacheModuleOptions(runtimeConfig: RuntimeConfig): void;
export declare function cacheLayerPaths(layers: string[]): void;
export declare function getModuleOption<T extends keyof OptionName>(option: T): Required<OptionName[T]>;
export declare function getModuleOptions(): Record<"redis" | "baseUrl" | "customCapabilities" | "singleCollectionsTable" | "standardCollections" | "standardFields" | "standardHooks" | "standardJobs" | "standardMiddleware" | "standardTranslatableStrings" | "uploads" | "api" | "catchAllPages" | "dashboard" | "database" | "jobs" | "jwt" | "language" | "migration" | "pageCache" | "layers" | "uploadsDir", any>;
export {};
