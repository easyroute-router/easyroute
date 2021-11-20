import { PropsWithChildren } from 'react';
interface RouterLinkProps {
    to: string;
    className?: string;
    replace?: boolean;
}
export declare const RouterLink: (props: PropsWithChildren<RouterLinkProps>) => JSX.Element;
export {};
