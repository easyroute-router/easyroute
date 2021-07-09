import { RouteInfoData, RouteMatchData } from '../../types';
import { parseQuery } from './parseQuery';
import { getPathParams } from './getPathParams';

export function createRouteObject(
  matchedRoutes: RouteMatchData[],
  url: string
): RouteInfoData | null {
  const currentMatched = matchedRoutes.filter(Boolean)[0];
  if (!currentMatched)
    return {
      params: {},
      query: {},
      fullPath: ''
    };
  const [pathString, queryString]: string[] = url.split('?');
  return {
    params: getPathParams(currentMatched, pathString),
    query: parseQuery(queryString),
    name: currentMatched.name,
    fullPath: url,
    meta: currentMatched.meta ?? {}
  };
}
