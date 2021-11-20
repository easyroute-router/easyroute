import React, { PropsWithChildren, useCallback, useContext } from 'react';
import { EasyrouteContext } from './EasyrouteContext';

interface RouterLinkProps {
  to: string;
  className?: string;
  replace?: boolean;
}

export const RouterLink = (props: PropsWithChildren<RouterLinkProps>) => {
  const { router } = useContext(EasyrouteContext);
  const replace = props.replace !== undefined ? props.replace : false;

  const routerNavigate = useCallback((evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (!router) {
      throw new Error('[Easyroute] Router instance not found in RouterLink');
    }
    const resultPath = props.to[0] === '/' ? props.to : `/${props.to}`;
    const method = replace ? router.replace : router.push;
    method(resultPath).catch((err: unknown) => console.error(err));
  }, []);

  return (
    <a
      className={'router-link' + 'className'}
      href={props.to}
      onClick={routerNavigate}
    >
      {props.children}
    </a>
  );
};
