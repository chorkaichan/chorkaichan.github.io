// Keeps the URL from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { PageSEO } from '@/components/SEO'
import { getAuthor } from '@/lib/content'
import { DEFAULT_LOCALE, getMessages } from '@/lib/i18n'

export async function getStaticProps() {
  const { name } = (await getAuthor(DEFAULT_LOCALE, 'default')).frontMatter
  return { props: { name } }
}

export default function Legacy({ name }) {
  const t = getMessages(DEFAULT_LOCALE)
  return (
    <LocaleRedirect path="/about">
      <PageSEO title={`${t.about} - ${name}`} description={t.aboutDescription(name)} />
    </LocaleRedirect>
  )
}
