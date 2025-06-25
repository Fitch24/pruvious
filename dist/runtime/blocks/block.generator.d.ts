import { type ResolvedField } from '../fields/field.resolver.js';
import { CodeGenerator } from '../utils/code-generator.js';
import { type ResolvedBlock } from './block.resolver.js';
export declare function generateBlocks(blocks: Record<string, ResolvedBlock>, ts: CodeGenerator, tsServer: CodeGenerator): void;
export declare function generateBlockTypes(blocks: Record<string, ResolvedBlock>, fields: Record<string, ResolvedField>, ts: CodeGenerator): Promise<void>;
