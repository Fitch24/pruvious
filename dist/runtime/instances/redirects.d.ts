export interface Redirect {
    code: number;
    to: string;
    forwardQueryParams: boolean;
}
export declare const redirects: Record<string, Redirect | null>;
export declare function clearRedirects(): void;
