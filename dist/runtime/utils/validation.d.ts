interface StringValidationOptions {
    subject: string;
    prop: string;
    value: any;
    path: string;
    examples?: string[];
}
export declare function validateString(options: StringValidationOptions): boolean;
export declare function validateSlug(options: StringValidationOptions): boolean;
export declare function validateSafeSlug(options: StringValidationOptions): boolean;
export declare function validatePascalCase(options: StringValidationOptions): boolean;
export declare function validateDefaultExport(subjects: string, useFn: string, file: any, path: string): boolean;
export declare function queueErrorAndReturn(message: string, ...args: string[]): false;
export {};
