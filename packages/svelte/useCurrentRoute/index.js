import { getContext } from 'svelte';

const useCurrentRoute = () => {
  const context = getContext('easyrouteContext');
  if (!context) throw new Error('[Easyroute] No router context found');
  return context.router.currentRouteData;
};

export default useCurrentRoute;
