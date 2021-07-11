import { delay } from '../delay';

export default async function componentChangeWithTransition(
  component,
  currentRoute,
  transition,
  classCallback,
  componentCallback,
  router,
  transitionData
) {
  classCallback(`${transition}-leave-active ${transition}-leave-to`);
  await delay(transitionData.leavingDuration + 10);
  classCallback(
    `${transition}-leave-active ${transition}-leave-to ${transition}-leave`
  );
  const hooksArray = [...router.transitionOutHooks];
  if (currentRoute.transitionOut) hooksArray.push(currentRoute.transitionOut);
  await router.runHooksArray(
    hooksArray,
    router.currentRouteData.getValue,
    router.currentRouteFromData.getValue,
    'transition'
  );
  await delay(5);
  classCallback(`${transition}-enter`);
  classCallback(`${transition}-enter-active`);
  componentCallback(component);
  classCallback(`${transition}-enter-active ${transition}-enter-to`);
  await delay(transitionData.enteringDuration + 10);
  classCallback('');
}
