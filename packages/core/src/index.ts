import { downloadDynamicComponents } from './utils/code-splitting/downloadDynamicComponents';
import { parseRoutes } from './utils/parsing/parseRoutes';
import { getMatchData } from './utils/parsing/getMatchData';
import { constructUrl } from './utils/path/constructUrl';
import { createObservable } from './utils/observable/createObservable';
import {
  HookCommand,
  RouteInfoData,
  RouteMatchData,
  BeforeRouterHook,
  AfterRouterHook,
  RouterSettings,
  RouterMode
} from './types';
import { createRouteObject } from './utils/parsing/createRouteObject';
import { deleteEdgeSlashes } from '../utils/deleteEdgeSlashes';
import { isBrowser } from '../utils/isBrowser';

const SSR = !isBrowser();

export default class Router {
  private readonly routes: RouteMatchData[] = [];
  private ignoreEvents = false;
  private currentUrl = '';
  private beforeEachHooks: BeforeRouterHook[] = [];
  private afterEachHooks: AfterRouterHook[] = [];
  private modeName: RouterMode = 'hash';

  public transitionOutHooks: BeforeRouterHook[] = [];
  public currentMatched = createObservable<RouteMatchData[]>([]);
  public currentRouteData = createObservable<RouteInfoData>({
    params: {},
    query: {},
    name: '',
    fullPath: ''
  });
  public currentRouteFromData = createObservable<RouteInfoData | null>(null);
  public silentControl: any = undefined;

  constructor(private settings: RouterSettings) {
    if (!settings.mode) {
      throw new ReferenceError(
        '[Easyroute] Router mode is not defined: pass a function into "settings.mode"'
      );
    }
    this.routes = getMatchData(settings.routes);
    settings.mode.call(this);
    if (SSR && this.modeName !== 'history')
      throw new Error('[Easyroute] SSR only works with "history" router mode');
  }

  public async parseRoute(url: string, doPushState = true) {
    url = url.replace(/^#/, '');
    const matched = parseRoutes(this.routes, url.split('?')[0]);
    if (!matched) return;
    const toRouteInfo = createRouteObject([matched[0]], url);
    const fromRouteInfo = createRouteObject(
      [this.currentMatched.getValue[0]],
      this.currentUrl
    );
    const allowNext = await this.runHooksArray(
      [
        ...this.beforeEachHooks,
        ...(matched
          .map((t) => t.beforeEnter)
          .filter(Boolean) as BeforeRouterHook[])
      ],
      toRouteInfo as RouteInfoData,
      fromRouteInfo,
      'before'
    );
    if (!allowNext) return;
    // @ts-ignore
    this.changeUrl(
      constructUrl(url, this.base, this.settings.omitTrailingSlash),
      doPushState,
      toRouteInfo as RouteInfoData
    );
    this.currentRouteData.setValue(toRouteInfo);
    this.currentRouteFromData.setValue(fromRouteInfo);
    this.currentMatched.setValue(await downloadDynamicComponents(matched));
    this.runHooksArray(
      this.afterEachHooks,
      toRouteInfo as RouteInfoData,
      fromRouteInfo,
      'after'
    );
  }

  private async executeHook(
    to: RouteInfoData,
    from: RouteInfoData | null,
    hook: BeforeRouterHook | AfterRouterHook,
    type: 'after' | 'before' | 'transition'
  ) {
    if (type === 'after') return (hook as AfterRouterHook)(to, from);
    return new Promise(async (resolve) => {
      const next = (command?: HookCommand) => {
        if (command !== null && command !== undefined) {
          if (command === false) resolve(false);
          if (typeof command === 'string') {
            this.parseRoute(command);
            resolve(false);
          }
        } else {
          resolve(true);
        }
      };
      if (!hook) resolve(true);
      else await hook(to, from, next);
    });
  }

  public async push(url: string) {
    this.ignoreEvents = true;
    await this.parseRoute(url);
  }

  public back() {
    // @ts-ignore
    this.go(-1);
  }

  public beforeEach(hook: BeforeRouterHook) {
    this.beforeEachHooks.push(hook);
  }

  public afterEach(hook: AfterRouterHook) {
    this.afterEachHooks.push(hook);
  }

  public transitionOut(hook: BeforeRouterHook) {
    this.transitionOutHooks.push(hook);
  }

  public async runHooksArray(
    hooks: BeforeRouterHook[] | AfterRouterHook[],
    to: RouteInfoData,
    from: RouteInfoData | null,
    type: 'before' | 'after' | 'transition'
  ) {
    for await (const hook of hooks) {
      const allow = await this.executeHook(to, from, hook, type);
      if (!allow) return false;
    }
    return true;
  }

  get base() {
    if (!this.settings.base) return '';
    return deleteEdgeSlashes(this.settings.base) + '/';
  }

  get currentRoute() {
    return this.currentRouteData.getValue;
  }
}
