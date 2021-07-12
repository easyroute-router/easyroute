async function checkAsyncAndDownload(component) {
    const isAsync = /(\.then|import\(.+\)|vitePreload|_+import_+)/i.test(component.toString());
    if (!isAsync)
        return component;
    else {
        try {
            const newComponent = await component();
            return newComponent.default;
        }
        catch (e) {
            console.warn(`[Easyroute] caught an error while trying to download async component: "${e.message}"`);
            return component;
        }
    }
}

async function downloadDynamicComponents(matchedRoutes) {
    const nonDynamic = matchedRoutes.map(async (route) => {
        if (route.component) {
            route.component = await checkAsyncAndDownload(route.component);
        }
        if (route.components) {
            for await (const component of Object.entries(route.components)) {
                const [key, value] = component;
                route.components[key] = await checkAsyncAndDownload(value);
            }
        }
        return route;
    });
    return await Promise.all(nonDynamic);
}

function getRoutesTreeChain(allRoutes, currentRoute) {
    var _a;
    if (!currentRoute)
        return [];
    const tree = [currentRoute];
    let currentSeekingId = currentRoute.parentId;
    do {
        const seed = allRoutes.find((seedRoute) => seedRoute.id === currentSeekingId);
        seed && tree.push(seed);
        currentSeekingId = (_a = seed === null || seed === void 0 ? void 0 : seed.parentId) !== null && _a !== void 0 ? _a : null;
    } while (currentSeekingId);
    return tree;
}
function parseRoutes(routes, url) {
    const allMatched = [];
    const usedIds = [];
    const usedDepths = [];
    routes.forEach((route) => {
        if (route.regexpPath.test(url)) {
            allMatched.push(...getRoutesTreeChain(routes, route));
        }
    });
    return allMatched
        .filter((route) => {
        if (!usedIds.includes(route.id) &&
            !usedDepths.includes(route.nestingDepth)) {
            usedIds.push(route.id);
            usedDepths.push(route.nestingDepth);
            return true;
        }
        return false;
    })
        .sort((a, b) => b.nestingDepth - a.nestingDepth);
}

const deleteFirstSlash = (url) => url.replace(/^\//, '');

const deleteLastSlash = (url) => url.replace(/\/$/, '');

const deleteEdgeSlashes = (url) =>
  deleteFirstSlash(deleteLastSlash(url));

const generateId = () => Math.random().toString(36).substr(2, 9);

function regexparam (str, loose) {
	if (str instanceof RegExp) return { keys:false, pattern:str };
	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
	arr[0] || arr.shift();

	while (tmp = arr.shift()) {
		c = tmp[0];
		if (c === '*') {
			keys.push('wild');
			pattern += '/(.*)';
		} else if (c === ':') {
			o = tmp.indexOf('?', 1);
			ext = tmp.indexOf('.', 1);
			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
		} else {
			pattern += '/' + tmp;
		}
	}

	return {
		keys: keys,
		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
	};
}

function getMatchData(arr, parentId = null, nestingDepth = 0, parentPath = '/') {
    return arr.reduce((acc, val) => {
        var _a;
        const componentPart = (val.component && { component: val.component }) ||
            (val.components && { components: val.components });
        const path = deleteEdgeSlashes(parentPath) + '/' + deleteEdgeSlashes(val.path);
        const { pattern, keys } = regexparam(path);
        const newRoute = {
            ...val,
            ...componentPart,
            parentId,
            nestingDepth,
            path,
            id: generateId(),
            regexpPath: pattern,
            pathKeys: keys
        };
        if (Array.isArray(val.children)) {
            acc = acc.concat(getMatchData(((_a = newRoute.children) !== null && _a !== void 0 ? _a : []), newRoute.id, nestingDepth + 1, newRoute.path));
        }
        return acc.concat(newRoute);
    }, []);
}

const deleteQueryTrailingSlash = (url) => url.replace(/(\/\?)/, '?');

function constructUrl(url, base, omitTrailing = false) {
    omitTrailing &&
        url.split('?')[0].length > 1 &&
        (url = deleteQueryTrailingSlash(deleteLastSlash(url)));
    if (!base || url.includes(base))
        return url;
    return `/${deleteLastSlash(base)}/${deleteFirstSlash(url)}`;
}

function createObservable(initial) {
    const _listeners = {};
    let _value = initial;
    return {
        get getValue() {
            return _value;
        },
        subscribe(listener) {
            const id = generateId();
            _listeners[id] = listener;
            listener(_value);
            return () => delete _listeners[id];
        },
        set(v) {
            _value = v;
            Object.values(_listeners).forEach((l) => l(v));
        }
    };
}

function decode(str) {
    try {
        return decodeURIComponent(str);
    }
    catch (err) {
        console.warn(`[Easyroute] Could not decode query string: ${str}`);
    }
    return str;
}
function parseQuery(query) {
    const res = {};
    if (typeof query !== 'string')
        return res;
    query = query.trim().replace(/^(\?|#|&)/, '');
    if (!query) {
        return res;
    }
    query.split('&').forEach((param) => {
        const parts = param.replace(/\+/g, ' ').split('=');
        const key = decode(parts.shift());
        const val = parts.length > 0 ? decode(parts.join('=')) : null;
        if (res[key] === undefined) {
            res[key] = val;
        }
        else if (Array.isArray(res[key])) {
            val !== null && res[key].push(val);
        }
        else {
            if (val !== null) {
                res[key] = [res[key], val];
            }
        }
    });
    return res;
}

function getPathParams(matchedRoute, url) {
    let pathValues = matchedRoute.regexpPath.exec(url);
    if (!pathValues)
        return {};
    pathValues = pathValues.slice(1, pathValues.length);
    const urlParams = {};
    for (let pathPart = 0; pathPart < pathValues.length; pathPart++) {
        const value = pathValues[pathPart];
        const key = matchedRoute.pathKeys[pathPart];
        urlParams[String(key)] = value;
    }
    return urlParams;
}

function createRouteObject(matchedRoutes, url) {
    var _a;
    const currentMatched = matchedRoutes.filter(Boolean)[0];
    if (!currentMatched)
        return {
            params: {},
            query: {},
            fullPath: ''
        };
    const [pathString, queryString] = url.split('?');
    return {
        params: getPathParams(currentMatched, pathString),
        query: parseQuery(queryString),
        name: currentMatched.name,
        fullPath: url,
        meta: (_a = currentMatched.meta) !== null && _a !== void 0 ? _a : {}
    };
}

/**
 * @description Is current environment - browser
 * @author flexdinesh/browser-or-node
 * @returns {boolean}
 */
function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.document !== 'undefined'
  );
}

const SSR = !isBrowser();
class Router {
    constructor(settings) {
        this.settings = settings;
        this.routes = [];
        this.ignoreEvents = false;
        this.currentUrl = '';
        this.beforeEachHooks = [];
        this.afterEachHooks = [];
        this.modeName = 'hash';
        this.transitionOutHooks = [];
        this.currentMatched = createObservable([]);
        this.currentRouteData = createObservable({
            params: {},
            query: {},
            name: '',
            fullPath: ''
        });
        this.currentRouteFromData = createObservable(null);
        this.silentControl = undefined;
        if (!settings.mode) {
            throw new ReferenceError('[Easyroute] Router mode is not defined: pass a function into "settings.mode"');
        }
        this.routes = getMatchData(settings.routes);
        settings.mode.call(this);
        if (SSR && this.modeName !== 'history')
            throw new Error('[Easyroute] SSR only works with "history" router mode');
    }
    async parseRoute(url, doPushState = true) {
        url = url.replace(/^#/, '');
        const matched = parseRoutes(this.routes, url.split('?')[0]);
        if (!matched)
            return;
        const toRouteInfo = createRouteObject([matched[0]], url);
        const fromRouteInfo = createRouteObject([this.currentMatched.getValue[0]], this.currentUrl);
        const allowNext = await this.runHooksArray([
            ...this.beforeEachHooks,
            ...matched
                .map((t) => t.beforeEnter)
                .filter(Boolean)
        ], toRouteInfo, fromRouteInfo, 'before');
        if (!allowNext)
            return;
        // @ts-ignore
        this.changeUrl(constructUrl(url, this.base, this.settings.omitTrailingSlash), doPushState, toRouteInfo);
        this.currentRouteData.set(toRouteInfo);
        this.currentRouteFromData.set(fromRouteInfo);
        this.currentMatched.set(await downloadDynamicComponents(matched));
        this.runHooksArray(this.afterEachHooks, toRouteInfo, fromRouteInfo, 'after');
    }
    async executeHook(to, from, hook, type) {
        if (type === 'after')
            return hook(to, from);
        return new Promise(async (resolve) => {
            const next = (command) => {
                if (command !== null && command !== undefined) {
                    if (command === false)
                        resolve(false);
                    if (typeof command === 'string') {
                        this.parseRoute(command);
                        resolve(false);
                    }
                }
                else {
                    resolve(true);
                }
            };
            if (!hook)
                resolve(true);
            else
                await hook(to, from, next);
        });
    }
    async push(url) {
        this.ignoreEvents = true;
        await this.parseRoute(url);
    }
    back() {
        // @ts-ignore
        this.go(-1);
    }
    beforeEach(hook) {
        this.beforeEachHooks.push(hook);
    }
    afterEach(hook) {
        this.afterEachHooks.push(hook);
    }
    transitionOut(hook) {
        this.transitionOutHooks.push(hook);
    }
    async runHooksArray(hooks, to, from, type) {
        for await (const hook of hooks) {
            const allow = await this.executeHook(to, from, hook, type);
            if (!allow)
                return false;
        }
        return true;
    }
    get base() {
        if (!this.settings.base)
            return '';
        return deleteEdgeSlashes(this.settings.base) + '/';
    }
    get currentRoute() {
        return this.currentRouteData.getValue;
    }
}

export default Router;
