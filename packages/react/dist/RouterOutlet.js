import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EasyrouteContext } from './EasyrouteContext';
import { getTransitionDurations } from '@easyroute/core/utils/getTransitionDurations';
import { isBrowser } from '@easyroute/core/utils/isBrowser';
import componentChangeWithTransition from '@easyroute/core/utils/componentChangeWithTransition';
const SSR_CONTEXT = !isBrowser();
export const RouterOutlet = (props) => {
    const { router, nestingDepth } = useContext(EasyrouteContext);
    const [component, setComponent] = useState('');
    const [prevRouteId, setPrevRouteId] = useState(null);
    const [transitionClassName, setTransitionClassName] = useState('');
    const name = props.name ?? 'default';
    const { forceRemount, transition, className } = props;
    const transitionData = SSR_CONTEXT
        ? null
        : props.transition
            ? getTransitionDurations(props.transition)
            : null;
    if (!router || nestingDepth === undefined) {
        throw new Error('[Easyroute] RouterOutlet: no router instance found. Did you forget to wrap your ' +
            'root component with <EasyrouteProvider>?');
    }
    const changeComponent = useCallback(async (Component, isClassComponent, currentRoute) => {
        const componentProps = {
            router,
            currentRoute: router.currentRoute
        };
        if (prevRouteId === currentRoute.id && !forceRemount)
            return;
        const distComponent = isClassComponent ? (Component.render(componentProps)) : (React.createElement(Component, Object.assign({}, componentProps)));
        if (!transitionData) {
            if (Component === '') {
                setComponent('');
            }
            else {
                setComponent(distComponent);
            }
        }
        else {
            componentChangeWithTransition(distComponent, currentRoute, transition, (c) => setTransitionClassName(c), (c) => setComponent(c), router, transitionData);
        }
        setPrevRouteId(currentRoute.id);
    }, []);
    const matchedSubscribe = useCallback(async (matchedRoutes) => {
        const componentProps = {
            router,
            currentRoute: router.currentRoute
        };
        const currentRoute = matchedRoutes.find((route) => route.nestingDepth === nestingDepth);
        if (currentRoute) {
            let componentValue;
            if (name === 'default')
                componentValue =
                    currentRoute.component || currentRoute.components?.default;
            else
                componentValue = currentRoute.components
                    ? currentRoute.components[name]
                    : null;
            if (!componentValue) {
                await changeComponent('', false, currentRoute);
                return;
            }
            const Component = componentValue;
            const isClassComponent = !!Component?.prototype?.render;
            const preparedComponent = isClassComponent
                ? new Component(componentProps)
                : Component;
            try {
                await changeComponent(preparedComponent, isClassComponent, currentRoute);
            }
            catch (e) {
                setComponent(`[Easyroute] Error changing component: ${e.message}`);
            }
        }
        else {
            setComponent('');
        }
    }, []);
    if (SSR_CONTEXT) {
        matchedSubscribe(router.currentMatched.getValue);
    }
    useEffect(() => {
        if (SSR_CONTEXT)
            return () => { };
        const unsubscribe = router.currentMatched.subscribe(matchedSubscribe);
        return () => unsubscribe();
    }, []);
    const classList = useMemo(() => {
        const classListArray = ['easyroute-outlet'];
        className && classListArray.push(className);
        transitionClassName && classListArray.push(transitionClassName);
        return classListArray.join(' ');
    }, [transitionClassName, className]);
    const componentProps = {
        router,
        currentRoute: router.currentRoute
    };
    return (React.createElement(EasyrouteContext.Provider, { value: { router, nestingDepth: nestingDepth + 1 } },
        React.createElement("div", { className: classList }, component)));
};
