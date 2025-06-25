import type { ResolvedField } from '../fields/field.resolver.js';
import { CodeGenerator } from '../utils/code-generator.js';
import { type ResolvedCollection } from './collection.resolver.js';
export declare function generateCollections(collections: Record<string, ResolvedCollection>, fields: Record<string, ResolvedField>, ts: CodeGenerator, tsServer: CodeGenerator, tsStandard: CodeGenerator, tsDashboard: CodeGenerator): void;
