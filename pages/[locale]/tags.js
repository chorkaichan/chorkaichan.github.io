import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getTags } from '@/lib/content'
import { localePath, localeStaticPaths, useLocale, useMessages } from '@/lib/i18n'
import kebabCase from '@/lib/utils/kebabCase'

export async function getStaticPaths() {
  return { paths: localeStaticPaths(), fallback: false }
}

export async function getStaticProps({ params: { locale } }) {
  const tags = await getTags(locale)

  return { props: { locale, tags } }
}

export default function Tags({ tags }) {
  const locale = useLocale()
  const t = useMessages()
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  return (
    <>
      <PageSEO title={`Tags - ${siteMetadata.author}`} description={t.tagsDescription} />
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:justify-center md:items-center md:divide-y-0 md:flex-row md:space-x-6 md:mt-24">
        <div className="pt-6 pb-8 space-x-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 md:border-r-2 md:px-6">
            {t.tags}
          </h1>
        </div>
        <div className="flex flex-wrap max-w-lg">
          {Object.keys(tags).length === 0 && t.noTags}
          {sortedTags.map((tag) => {
            return (
              <div key={tag} className="mt-2 mb-2 mr-5">
                <Tag text={tag} />
                <Link
                  href={localePath(locale, `/tags/${kebabCase(tag)}`)}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                >
                  {` (${tags[tag]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
