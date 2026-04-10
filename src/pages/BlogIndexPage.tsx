import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BLOG_POST_LIST } from '../data/blogPosts'

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

export default function BlogIndexPage() {
  return (
    <MarketingPageLayout>
      <div className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          SentientWeb · Blog
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Blog
        </h1>
        <p className="font-mono mt-6 max-w-xl text-[14px] uppercase leading-relaxed text-cream/65 sm:text-[15px]">
          Product updates, launch notes, and how we think about the sentient web.
        </p>

        <ul className="mt-14 space-y-12 border-t border-white/10 pt-12">
          {BLOG_POST_LIST.map((post) => (
            <li key={post.slug}>
              <article>
                <time
                  dateTime={post.date}
                  className="font-mono text-[11px] uppercase tracking-widest text-cream/45"
                >
                  {formatDate(post.date)}
                </time>
                <h2 className="mt-3 font-grotesk text-[24px] uppercase leading-tight text-cream sm:text-[28px]">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="transition hover:text-neon"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="font-mono mt-4 text-[15px] normal-case leading-relaxed text-cream/75 sm:text-[16px]">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-5 inline-block font-grotesk text-[12px] uppercase tracking-wide text-neon transition hover:brightness-125 sm:text-[13px]"
                >
                  Read article →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </MarketingPageLayout>
  )
}
