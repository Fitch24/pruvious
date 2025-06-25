import { type Ref } from '#imports';
import type { AuthUser } from '#pruvious';
/**
 * The current logged in user.
 */
export declare const useUser: () => Ref<AuthUser | null>;
