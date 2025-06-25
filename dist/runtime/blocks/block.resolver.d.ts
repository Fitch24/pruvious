import type { ResolvedField } from '../fields/field.resolver.js';
import type { BlockDefinition } from './block.definition.js';
export interface ResolvedBlock {
    definition: Partial<BlockDefinition> & {
        name: string;
    };
    source: string;
    code: string;
}
export declare function resolveBlocks(fields: Record<string, ResolvedField>, skipCache?: boolean): Promise<{
    records: Record<string, ResolvedBlock>;
    errors: number;
}>;
export declare function resolveBlockDefinition(block: ResolvedBlock): Promise<BlockDefinition>;
export declare function clearCachedBlock(path: string): void;
export declare function clearAllCachedBlocks(): void;
