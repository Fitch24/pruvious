import type { ResolvedJobDefinition } from './job.definition.js';
export interface ResolvedJob {
    definition: ResolvedJobDefinition<any>;
    source: string;
    isStandard: boolean;
}
export declare function resolveJobs(): {
    records: Record<string, ResolvedJob>;
    errors: number;
};
export declare function clearCachedJob(path: string): void;
