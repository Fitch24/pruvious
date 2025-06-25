import { type Ref } from 'vue';
export declare class History {
    undosRemaining: Ref<number>;
    redosRemaining: Ref<number>;
    isDirty: Ref<boolean>;
    original: Ref<Record<string, any>>;
    private states;
    private initialState;
    private index;
    constructor(record?: Record<string, any>);
    add(record: Record<string, any>, force?: boolean): Omit<Record<string, any>, "createdAt" | "updatedAt">;
    setInitialState(record: Record<string, any>): void;
    undo(): Record<string, any> | null;
    redo(): Record<string, any> | null;
    reset(): this;
    private refresh;
}
