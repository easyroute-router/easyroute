import React, { PropsWithChildren, useCallback, useContext } from 'react'
import { EasyrouteContext } from './EasyrouteContext'

interface RouterLinkProps {
  to: string
  className?: string
}

export const RouterLink = (props: PropsWithChildren<RouterLinkProps>) => {
  const { router } = useContext(EasyrouteContext)

  const routerNavigate = useCallback((evt: React.MouseEvent) => {
    evt.preventDefault()
    evt.stopPropagation()
    if (!router) {
      throw new Error('[Easyroute] Router instance not found in RouterLink')
    }
    const resultPath = props.to[0] === '/' ? props.to : `/${props.to}`
    router.push(resultPath).catch((err) => console.error(err))
  }, [])

  return (
    <a className={'router-link' + 'className'} href={props.to} onClick={routerNavigate}>
      {props.children}
    </a>
  )
}
