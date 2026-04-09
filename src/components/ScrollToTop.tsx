import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router does not reset scroll on navigation. On pathname (or non-home) changes,
 * scroll to top. Skip when landing on home with a hash — HomePage scrolls to that section.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (pathname === '/' && hash) {
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
