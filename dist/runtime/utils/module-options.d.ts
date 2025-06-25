import type { RuntimeConfig } from '@nuxt/schema';
/**
 * Apply environment variables starting with `NUXT_PRUVIOUS_` and `NUXT_PUBLIC_PRUVIOUS_` to module options during an early phase.
 * Additionally, resolve specific module options.
 */
export declare function patchModuleOptions(runtimeConfig: RuntimeConfig): void;
