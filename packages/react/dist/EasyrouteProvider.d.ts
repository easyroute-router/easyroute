import { ReactElement } from 'react';
import Router from '@easyroute/core';
interface EasyrouteProviderProps {
    router: Router;
    children?: ReactElement;
}
declare function EasyrouteProvider(props: EasyrouteProviderProps): ReactElement;
export { EasyrouteProvider };
