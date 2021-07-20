import React from 'react';
import { EasyrouteContext } from './EasyrouteContext';
function EasyrouteProvider(props) {
    return (React.createElement(EasyrouteContext.Provider, Object.assign({ value: { router: props.router, nestingDepth: 0 } }, props)));
}
export { EasyrouteProvider };
