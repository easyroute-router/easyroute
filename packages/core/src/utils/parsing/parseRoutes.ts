import { RouteMatchData } from '../../types';

function getRoutesTreeChain(
  allRoutes: RouteMatchData[],
  currentRoute: RouteMatchData
) {
  if (!currentRoute) return [];
  const tree: RouteMatchData[] = [currentRoute];
  let currentSeekingId: string | null = currentRoute.parentId;
  do {
    const seed = allRoutes.find(
      (seedRoute) => seedRoute.id === currentSeekingId
    );
    seed && tree.push(seed);
    currentSeekingId = seed?.parentId ?? null;
  } while (currentSeekingId);
  return tree;
}

export function parseRoutes(routes: RouteMatchData[], url: string) {
  const allMatched: RouteMatchData[] = [];
  const usedIds: string[] = [];
  const usedDepths: number[] = [];
  routes.forEach((route) => {
    if (route.regexpPath.test(url)) {
      allMatched.push(...getRoutesTreeChain(routes, route));
    }
  });
  return allMatched
    .filter((route) => {
      if (
        !usedIds.includes(route.id) &&
        !usedDepths.includes(route.nestingDepth)
      ) {
        usedIds.push(route.id);
        usedDepths.push(route.nestingDepth);
        return true;
      }
      return false;
    })
    .sort((a, b) => b.nestingDepth - a.nestingDepth);
}
