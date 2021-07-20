/// <reference types="react" />
import Router from '@easyroute/core';
export interface EasyrouteContextValue {
    router?: Router;
    nestingDepth?: number;
}
export declare const EasyrouteContext: import("react").Context<EasyrouteContextValue>;
