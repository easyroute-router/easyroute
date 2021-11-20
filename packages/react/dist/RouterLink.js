import React, { useCallback, useContext } from 'react';
import { EasyrouteContext } from './EasyrouteContext';
export const RouterLink = (props) => {
    const { router } = useContext(EasyrouteContext);
    const replace = props.replace !== undefined ? props.replace : false;
    const routerNavigate = useCallback((evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (!router) {
            throw new Error('[Easyroute] Router instance not found in RouterLink');
        }
        const resultPath = props.to[0] === '/' ? props.to : `/${props.to}`;
        const method = replace ? router.replace : router.push;
        method(resultPath).catch((err) => console.error(err));
    }, []);
    return (React.createElement("a", { className: 'router-link' + 'className', href: props.to, onClick: routerNavigate }, props.children));
};
