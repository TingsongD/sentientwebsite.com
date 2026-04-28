import { Helmet } from 'react-helmet-async'
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_META_TITLE,
  SITE_NAME,
} from '../constants'
import { getCanonicalUrl, getFullTitle } from '../routeMetadata'

type PageMetaProps = {
  title?: string
  description?: string
  canonicalPath?: string
  imageUrl?: string
  absoluteTitle?: boolean
  noindex?: boolean
}

export function PageMeta({
  title = DEFAULT_META_TITLE,
  description = DEFAULT_META_DESCRIPTION,
  canonicalPath = '/',
  imageUrl = DEFAULT_OG_IMAGE_URL,
  absoluteTitle = false,
  noindex = false,
}: PageMetaProps) {
  const fullTitle = getFullTitle({ title, absoluteTitle })
  const url = getCanonicalUrl(canonicalPath)

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}
