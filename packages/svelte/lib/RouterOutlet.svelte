<script>
    import {setContext, getContext, onDestroy} from 'svelte';
    import {getTransitionDurations} from '@easyroute/core/utils/getTransitionDurations';
    import {isBrowser} from '@easyroute/core/utils/isBrowser';
    import componentChangeWithTransition from '@easyroute/core/utils/componentChangeWithTransition';

    export let transition = null, forceRemount = false, name = 'default';

    const SSR_CONTEXT = !isBrowser();
    const context = getContext('easyrouteContext');
    const depth = context ? context.depth + 1 || 0 : 0;
    const router = context ? context.router : null;
    const transitionData = SSR_CONTEXT ?
        null :
        transition ?
            getTransitionDurations(transition) :
            null;
    let prevRouteId = null;
    let currentComponent = null;
    let transitionClassName = '';
    let firstRouteResolved = SSR_CONTEXT;

    if (!router) {
        throw new Error('[Easyroute] RouterOutlet: no router instance found. Did you forget to wrap your ' +
            'root component with <EasyrouteProvider>?');
    }

    const currentMatched = router.currentMatched;
    setContext('easyrouteContext', {depth, router});

    async function changeComponent(component, currentRoute) {
        if (prevRouteId === currentRoute.id && !forceRemount) return;
        if (!transitionData) {
            currentComponent = component;
        } else {
            await componentChangeWithTransition(
                component,
                currentRoute,
                transition,
                tcn => transitionClassName = tcn,
                c => currentComponent = c,
                router,
                transitionData
            );
        }
        prevRouteId = currentRoute.id;
    }

    async function pickRoute(routes) {
        const currentRoute = routes.find(route => route.nestingDepth === depth);
        if (currentRoute) {
            let component;
            if (name === 'default') component = currentRoute.component || currentRoute.components.default;
            else component = currentRoute.components ? currentRoute.components[name] : null;
            await changeComponent(component, currentRoute);
            firstRouteResolved = true;
        } else {
            changeComponent(null, `${Date.now()}-nonexistent-route`);
        }
    }

    SSR_CONTEXT && pickRoute(router.currentMatched.getValue);

    $: pickRoute($currentMatched);
</script>

<div class={'easyroute-outlet ' + $$restProps.class + ' ' + transitionClassName}>
    {#if firstRouteResolved}
        <svelte:component this={currentComponent} router={router}/>
    {/if}
</div>
