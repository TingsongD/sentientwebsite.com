import { useLocation } from 'react-router-dom'
import { getPageMeta } from '../routeMetadata'
import { PageMeta } from './PageMeta'

export function RouteMeta() {
  const { pathname } = useLocation()
  return <PageMeta {...getPageMeta(pathname)} />
}
