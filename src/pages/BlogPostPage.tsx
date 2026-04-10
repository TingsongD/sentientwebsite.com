import { Link, Navigate, useParams } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'
import { BLOG_POSTS, isBlogSlug } from '../data/blogPosts'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso + 'T12:00:00'))
  } catch {
    return iso
  }
}

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!isBlogSlug(slug)) {
    return <Navigate to="/blog" replace />
  }

  const post = BLOG_POSTS[slug]

  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          {post.eyebrow}
        </p>
        <time
          dateTime={post.date}
          className="font-mono text-[12px] uppercase tracking-wide text-cream/50"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="font-grotesk mt-4 text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          {post.title}
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/50 pl-4 text-[13px] uppercase leading-relaxed text-cream/65 sm:text-[15px]">
          {post.excerpt}
        </p>

        <div className="mt-12 space-y-6 font-mono text-[15px] normal-case leading-[1.75] text-cream/85 sm:text-[16px]">
          {post.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-10">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Book a demo
          </a>
          <Link
            to="/blog"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            All posts
          </Link>
          <Link
            to="/"
            className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
          >
            Home
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
