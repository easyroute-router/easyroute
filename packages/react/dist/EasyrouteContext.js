import { createContext } from 'react';
export const EasyrouteContext = createContext({
    router: undefined,
    nestingDepth: 0
});
