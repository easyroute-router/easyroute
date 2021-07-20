import { createContext } from 'react';
import Router from '@easyroute/core';

export interface EasyrouteContextValue {
  router?: Router;
  nestingDepth?: number;
}

export const EasyrouteContext = createContext<EasyrouteContextValue>({
  router: undefined,
  nestingDepth: 0
});
