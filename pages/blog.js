// Keeps the URL from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { DEFAULT_LOCALE, getMessages } from '@/lib/i18n'

export default function Legacy() {
  return (
    <LocaleRedirect path="/blog">
      <PageSEO
        title={`Blog - ${siteMetadata.author}`}
        description={getMessages(DEFAULT_LOCALE).siteDescription}
      />
    </LocaleRedirect>
  )
}
