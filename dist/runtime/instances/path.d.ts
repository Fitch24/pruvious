import { type Resolver } from '@nuxt/kit';
export declare function resolveAppPath(...path: string[]): string;
export declare function resolveRelativeAppPath(...path: string[]): string;
export declare function resolveLayerPath(...path: string[]): string;
export declare function resolveModulePath(...path: string[]): string;
export declare function resolveRelativeModulePath(...path: string[]): string;
export declare function initModulePathResolver(resolver: Resolver): void;
export declare function initRootDir(dir: string): void;
export declare function appPathExists(...path: string[]): boolean;
