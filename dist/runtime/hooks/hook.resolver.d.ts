import type { HookDefinition } from './hook.definition.js';
export interface ResolvedHook {
    definition: Required<HookDefinition>;
    source: string;
    isStandard: boolean;
}
export declare function resolveHooks(): {
    records: Record<string, ResolvedHook>;
    errors: number;
};
export declare function clearCachedHook(path: string): void;
