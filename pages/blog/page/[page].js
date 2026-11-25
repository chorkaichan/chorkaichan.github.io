// Keeps /blog/page/<n> URLs from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getPosts } from '@/lib/content'
import { LOCALES, getMessages, shareLocale } from '@/lib/i18n'
import { POSTS_PER_PAGE } from '../../[locale]/blog'

const totalPages = async (locale) => Math.ceil((await getPosts(locale)).length / POSTS_PER_PAGE)

export async function getStaticPaths() {
  const max = Math.max(...(await Promise.all(LOCALES.map(totalPages))))
  return {
    paths: Array.from({ length: max }, (_, i) => ({ params: { page: `${i + 1}` } })),
    fallback: false,
  }
}

export async function getStaticProps({ params: { page } }) {
  const available = []
  for (const locale of LOCALES) {
    if (parseInt(page) <= (await totalPages(locale))) available.push(locale)
  }
  return { props: { page, available } }
}

export default function LegacyPage({ page, available }) {
  return (
    <LocaleRedirect path={`/blog/page/${page}`} available={available}>
      <PageSEO
        title={siteMetadata.title}
        description={getMessages(shareLocale(available)).siteDescription}
      />
    </LocaleRedirect>
  )
}
