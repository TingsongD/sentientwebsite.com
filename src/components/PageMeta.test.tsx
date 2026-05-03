import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  getPageMeta,
  renderPageHead,
  type PageMetaData,
} from '../routeMetadata'
import { PageMeta } from './PageMeta'

function getTag(head: string, tagName: string, attrName: string, attrValue: string) {
  const tags = head.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) || []
  return tags.find((tag) => tag.includes(`${attrName}="${attrValue}"`)) || ''
}

function getAttr(tag: string, attrName: string) {
  return tag.match(new RegExp(`${attrName}="([^"]*)"`))?.[1] || null
}

function getTitle(head: string) {
  return head.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || null
}

function headSignature(head: string) {
  return {
    title: getTitle(head),
    description: getAttr(getTag(head, 'meta', 'name', 'description'), 'content'),
    canonical: getAttr(getTag(head, 'link', 'rel', 'canonical'), 'href'),
    robots: getAttr(getTag(head, 'meta', 'name', 'robots'), 'content'),
    ogTitle: getAttr(getTag(head, 'meta', 'property', 'og:title'), 'content'),
    ogDescription: getAttr(getTag(head, 'meta', 'property', 'og:description'), 'content'),
    ogUrl: getAttr(getTag(head, 'meta', 'property', 'og:url'), 'content'),
    ogImage: getAttr(getTag(head, 'meta', 'property', 'og:image'), 'content'),
    twitterTitle: getAttr(getTag(head, 'meta', 'name', 'twitter:title'), 'content'),
    twitterDescription: getAttr(
      getTag(head, 'meta', 'name', 'twitter:description'),
      'content',
    ),
    twitterImage: getAttr(getTag(head, 'meta', 'name', 'twitter:image'), 'content'),
  }
}

function renderHelmetHead(meta: PageMetaData) {
  return renderToString(<PageMeta {...meta} />)
}

describe('PageMeta', () => {
  it('matches prerender head metadata for representative routes', () => {
    const routes = [
      '/pricing',
      '/blog/phase-1-live-now',
      '/solutions/saas',
      '/unknown-path',
    ]

    for (const route of routes) {
      const meta = getPageMeta(route)
      expect(headSignature(renderHelmetHead(meta)), route).toEqual(
        headSignature(renderPageHead(meta)),
      )
    }
  })
})
