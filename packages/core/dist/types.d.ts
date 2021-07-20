/**
 * Data to define route
 */
export interface RouteDefineData {
    path: string;
    component?: RouteComponent;
    components?: {
        [key: string]: RouteComponent;
    };
    name?: string;
    meta?: Record<string, unknown>;
    beforeEnter?: BeforeRouterHook;
    transitionOut?: BeforeRouterHook;
    children?: RouteDefineData[];
}
/**
 * Parsed route data
 */
export interface RouteMatchData extends RouteDefineData {
    nestingDepth: number;
    id: string;
    parentId: string;
    regexpPath: RegExp;
    pathKeys: string[];
}
/**
 * Data to send into currentRoute and hooks
 */
export interface RouteInfoData {
    fullPath: string;
    params: {
        [key: string]: string;
    };
    query: ParsedQueryObject;
    name?: string;
    meta?: Record<string, unknown>;
}
/**
 * Misc declarations
 */
export declare type RouteComponent = any;
export declare type NextCallback = (arg?: boolean | string) => void;
export declare type ParsedQueryObject = {
    [key: string]: string | string[] | null;
};
export declare type RouterMode = 'hash' | 'history' | 'silent';
export declare type RouterSettings = {
    mode: any;
    routes: RouteDefineData[];
    base?: string;
    omitTrailingSlash?: boolean;
};
export declare type BeforeRouterHook = (to: RouteInfoData, from: RouteInfoData | null, next: NextCallback) => void | Promise<void>;
export declare type AfterRouterHook = (to: RouteInfoData, from: RouteInfoData | null) => void | Promise<void>;
export declare type HookCommand = boolean | string;
export declare type ObservableListener<T> = (value: T) => void;
