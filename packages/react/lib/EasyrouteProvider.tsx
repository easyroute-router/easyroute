import React, { ReactElement } from 'react';
import { EasyrouteContext } from './EasyrouteContext';
import Router from '@easyroute/core';

interface EasyrouteProviderProps {
  router: Router;
  children?: ReactElement;
}

function EasyrouteProvider(props: EasyrouteProviderProps): ReactElement {
  return (
    <EasyrouteContext.Provider
      value={{ router: props.router, nestingDepth: 0 }}
      {...props}
    />
  );
}

export { EasyrouteProvider };
