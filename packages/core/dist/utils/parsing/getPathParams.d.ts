import { RouteMatchData } from '../../types';
export declare function getPathParams(matchedRoute: RouteMatchData, url: string): {
    [key: string]: string;
};
