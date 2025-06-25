import { CodeGenerator } from '../utils/code-generator.js';
import type { ResolvedTranslatableStrings } from './translatable-strings.resolver.js';
export declare function generateTranslatableStrings(translatableStrings: Record<string, ResolvedTranslatableStrings>, ts: CodeGenerator, tsServer: CodeGenerator, tsStandard: CodeGenerator): void;
