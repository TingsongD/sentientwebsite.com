import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router does not reset scroll on navigation. Scroll to top on path changes,
 * but leave hash navigation to the page that owns the target section.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
