import { CodeGenerator } from '../utils/code-generator.js';
import type { ResolvedHook } from './hook.resolver.js';
export declare function generateHooks(hooks: Record<string, ResolvedHook>, ts: CodeGenerator, tsServer: CodeGenerator): void;
