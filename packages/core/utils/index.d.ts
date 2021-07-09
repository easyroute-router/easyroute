declare function getTransitionDurations(
  transitionName: string
): { enteringDuration: number; leavingDuration: number };
declare function delay(ms: number): Promise<void>;
declare function isBrowser(): boolean;

export { getTransitionDurations, delay, isBrowser };
