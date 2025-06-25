import type { LayoutDefinition } from './layout.definition.js';
export interface ResolvedLayout {
    definition: Partial<LayoutDefinition> & {
        name: string;
    };
    source: string;
    code: string;
}
export declare function resolveLayouts(): Promise<{
    records: Record<string, ResolvedLayout>;
    errors: number;
}>;
export declare function clearCachedLayout(path: string): void;
