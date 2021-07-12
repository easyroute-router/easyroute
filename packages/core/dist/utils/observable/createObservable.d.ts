import { ObservableListener } from '../../types';
export declare function createObservable<T>(initial: T): {
    readonly getValue: T;
    subscribe(listener: ObservableListener<T>): () => boolean;
    set(v: any): void;
};
