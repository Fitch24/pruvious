import type { TranslatableStringPattern, TranslatableStringsDefinition } from './translatable-strings.definition.js';
export interface ResolvedTranslatableStrings {
    definition: Required<TranslatableStringsDefinition>;
    source: string;
    isStandard: boolean;
}
export declare function resolveTranslatableStrings(): {
    records: Record<string, ResolvedTranslatableStrings>;
    errors: number;
};
export declare function validateTranslatableStrings(strings: Record<string, string | TranslatableStringPattern>, path: string): boolean;
export declare function clearCachedTranslatableStrings(path: string): void;
