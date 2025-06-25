import { type Ref } from '#imports';
import type { History } from '../../utils/dashboard/history.js';
export declare const useUnsavedChanges: () => Ref<History | null>;
export declare function watchUnsavedChanges(history: History): void;
