import type { ResolvedDashboardPageDefinition } from './dashboard.definition.js';
export interface ResolvedDashboardPage {
    definition: ResolvedDashboardPageDefinition;
    source: string;
}
export declare function resolveDashboardPages(): {
    records: Record<string, ResolvedDashboardPage>;
    errors: number;
};
export declare function clearCachedDashboardPages(path: string): void;
