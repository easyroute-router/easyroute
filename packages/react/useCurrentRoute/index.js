import { useContext, useEffect, useRef, useState } from 'react';
import { EasyrouteContext } from '../dist/EasyrouteContext';

export default function useCurrentRoute() {
  const { router } = useContext(EasyrouteContext);
  if (!router) {
    throw new Error(
      '[Easyroute] useCurrentRoute called outside easyroute context'
    );
  }
  const [, _rerender] = useState();
  const currentRouteValue = useRef(router.currentRouteData.getValue);
  const rerender = () => _rerender({});

  useEffect(() => {
    const unsubscribe = router.currentRouteData.subscribe((value) => {
      currentRouteValue.current = value;
      rerender();
    });
    return () => unsubscribe();
  }, []);

  return currentRouteValue.current;
}
