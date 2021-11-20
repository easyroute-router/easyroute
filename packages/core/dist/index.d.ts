import { RouteInfoData, RouteMatchData, BeforeRouterHook, AfterRouterHook, RouterSettings } from './types';
export default class Router {
    private settings;
    private readonly routes;
    private ignoreEvents;
    private currentUrl;
    private beforeEachHooks;
    private afterEachHooks;
    private modeName;
    transitionOutHooks: BeforeRouterHook[];
    currentMatched: {
        readonly getValue: RouteMatchData[];
        subscribe(listener: import("./types").ObservableListener<RouteMatchData[]>): () => boolean;
        set(v: any): void;
    };
    currentRouteData: {
        readonly getValue: RouteInfoData;
        subscribe(listener: import("./types").ObservableListener<RouteInfoData>): () => boolean;
        set(v: any): void;
    };
    currentRouteFromData: {
        readonly getValue: RouteInfoData | null;
        subscribe(listener: import("./types").ObservableListener<RouteInfoData | null>): () => boolean;
        set(v: any): void;
    };
    silentControl: any;
    constructor(settings: RouterSettings);
    parseRoute(url: string, doPushState?: boolean, replace?: boolean): Promise<void>;
    private executeHook;
    push(url: string): Promise<void>;
    replace(url: string): Promise<void>;
    go(howFar: number): void;
    back(): void;
    beforeEach(hook: BeforeRouterHook): void;
    afterEach(hook: AfterRouterHook): void;
    transitionOut(hook: BeforeRouterHook): void;
    runHooksArray(hooks: BeforeRouterHook[] | AfterRouterHook[], to: RouteInfoData, from: RouteInfoData | null, type: 'before' | 'after' | 'transition'): Promise<boolean>;
    get base(): string;
    get currentRoute(): RouteInfoData;
}
