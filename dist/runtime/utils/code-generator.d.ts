export interface Import {
    imported: string;
    local: string;
    isType: boolean;
}
export declare class CodeGenerator {
    private content;
    private indent;
    private trimStartIndent;
    newLine(content?: string): this;
    newDecl(content: string): this;
    add(content: string): this;
    addCode(code: string[]): this;
    getContent(): string;
    private trim;
    private resolveBrackets;
    clear(): this;
}
