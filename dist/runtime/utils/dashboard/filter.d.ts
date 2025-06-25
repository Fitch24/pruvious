import type { SupportedLanguage } from '#pruvious';
import { QueryStringParams } from './query-string-params.js';
export declare class Filter extends QueryStringParams {
    isActive: import("vue").Ref<boolean, boolean>;
    updated: import("vue").Ref<number, number>;
    private defaultLanguage;
    constructor(queryString?: string);
    fromString(queryString: string, checkUpdated?: boolean): this;
    setDefaultLanguage(language: SupportedLanguage | null, updateWhere?: boolean): this;
    where(options: Record<string, any>): this;
    resetWhere(): this;
    clear(): this;
    clone(): Filter;
    protected checkActive(): void;
    protected checkUpdated(): () => void;
}
