import type { ResolvedFieldDefinition } from './field.definition.js';
export interface ResolvedField {
    definition: ResolvedFieldDefinition;
    source: string;
    isStandard: boolean;
    hasVueField: boolean;
    hasVueSubfield: boolean;
    hasVueFieldTrap: boolean;
    hasVueFieldPreview: boolean;
}
export declare function resolveFields(): {
    records: Record<string, ResolvedField>;
    errors: number;
};
export declare function clearCachedField(path: string): void;
export declare function getStandardFieldNames(): string[];
export declare function getStandardFieldDefinitions(): Record<string, ResolvedFieldDefinition>;
