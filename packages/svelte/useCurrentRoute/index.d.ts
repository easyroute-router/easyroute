export default useCurrentRoute;
declare function useCurrentRoute(): {
  getValue: any;
  subscribe: (listener: (value: any) => void) => () => void;
  set: (value: any) => void;
};
