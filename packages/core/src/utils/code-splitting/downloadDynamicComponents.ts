import { checkAsyncAndDownload } from './checkAsyncAndDownload';
import { RouteMatchData } from '../../types';

export async function downloadDynamicComponents(
  matchedRoutes: RouteMatchData[]
) {
  const nonDynamic = matchedRoutes.map(async (route) => {
    if (route.component) {
      route.component = await checkAsyncAndDownload(route.component);
    }
    if (route.components) {
      for await (const component of Object.entries(route.components)) {
        const [key, value] = component;
        route.components[key] = await checkAsyncAndDownload(value);
      }
    }
    return route;
  });
  return await Promise.all(nonDynamic);
}
