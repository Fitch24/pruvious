import type { FieldOptions, ResolvedFieldDefinition } from '#pruvious';
export declare function resolveCollectionFieldOptions<T extends keyof FieldOptions>(cacheKey: string, field: T, name: string, options: Record<string, any>, fields: Record<string, ResolvedFieldDefinition>): Required<FieldOptions[T]>;
export declare function resolveFieldOptions<T extends keyof FieldOptions>(field: T, name: string, options: Record<string, any>, fields: Record<string, ResolvedFieldDefinition>): Required<FieldOptions[T]>;
