import { PropsWithChildren } from 'react';
import Router from '@easyroute/core';
interface RouterOutletProps {
    router?: Router;
    transition?: string;
    forceRemount?: boolean;
    className?: string;
    name?: string;
}
export declare const RouterOutlet: (props: PropsWithChildren<RouterOutletProps>) => JSX.Element;
export {};
