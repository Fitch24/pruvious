import { CodeGenerator } from '../utils/code-generator.js';
import type { ResolvedJob } from './job.resolver.js';
export declare function generateJobs(jobs: Record<string, ResolvedJob>, ts: CodeGenerator, tsServer: CodeGenerator): void;
