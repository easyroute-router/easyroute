import { RouteMatchData } from '../../types';

export function getPathParams(
  matchedRoute: RouteMatchData,
  url: string
): { [key: string]: string } {
  let pathValues: string[] = matchedRoute.regexpPath.exec(url) as string[];
  if (!pathValues) return {};
  pathValues = pathValues.slice(1, pathValues.length);
  const urlParams: Record<string, string> = {};
  for (let pathPart = 0; pathPart < pathValues.length; pathPart++) {
    const value = pathValues[pathPart];
    const key = matchedRoute.pathKeys[pathPart];
    urlParams[String(key)] = value;
  }
  return urlParams;
}
