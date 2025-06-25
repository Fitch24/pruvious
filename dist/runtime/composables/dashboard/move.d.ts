import { type Ref } from '#imports';
export declare const useDragImageLabel: () => Ref<string>;
export declare const useIsMoving: () => Ref<boolean>;
export declare function startMoving(options: {
    dragImageLabel: string;
}): void;
export declare function stopMoving(): void;
