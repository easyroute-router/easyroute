import { generateId } from '../misc/generateId';
import { ObservableListener } from '../../types';

export function createObservable<T>(initial: T) {
  const _listeners: Record<string, ObservableListener<T>> = {};
  let _value: T = initial;
  return {
    get getValue() {
      return _value;
    },
    subscribe(listener: ObservableListener<T>) {
      const id = generateId();
      _listeners[id] = listener;
      listener(_value);
      return () => delete _listeners[id];
    },
    set(v: any) {
      _value = v;
      Object.values(_listeners).forEach((l) => l(v));
    }
  };
}
