import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getPosts } from '@/lib/content'
import { localePath, localeStaticPaths, useLocale, useMessages } from '@/lib/i18n'
import formatDate from '@/lib/utils/formatDate'

const MAX_DISPLAY = 5

export async function getStaticPaths() {
  return { paths: localeStaticPaths(), fallback: false }
}

export async function getStaticProps({ params: { locale } }) {
  const posts = await getPosts(locale)

  return { props: { locale, posts } }
}

export default function Home({ posts }) {
  const locale = useLocale()
  const t = useMessages()

  return (
    <>
      <PageSEO title={siteMetadata.title} description={t.siteDescription} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-9 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {t.latest}
          </h1>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && t.noPosts}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                    <dl>
                      <dt className="sr-only">{t.publishedOn}</dt>
                      <dd className="text-base font-medium text-gray-500 leading-6 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight leading-8">
                            <Link
                              href={localePath(locale, `/blog/${slug}`)}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="text-gray-500 prose max-w-none dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={localePath(locale, `/blog/${slug}`)}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={t.readPost(title)}
                        >
                          {t.readMore} &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href={localePath(locale, '/blog')}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            {t.allPosts} &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
