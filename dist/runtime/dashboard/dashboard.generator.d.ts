import { CodeGenerator } from '../utils/code-generator.js';
import type { ResolvedDashboardPage } from './dashboard.resolver.js';
export declare function generateDashboardPages(dashboardPages: Record<string, ResolvedDashboardPage>, ts: CodeGenerator, tsServer: CodeGenerator, tsDashboard: CodeGenerator): void;
