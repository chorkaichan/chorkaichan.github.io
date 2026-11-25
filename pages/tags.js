// Keeps the URL from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { SHARE_LOCALE, getMessages } from '@/lib/i18n'

export default function Legacy() {
  return (
    <LocaleRedirect path="/tags">
      <PageSEO
        title={`Tags - ${siteMetadata.author}`}
        description={getMessages(SHARE_LOCALE).tagsDescription}
      />
    </LocaleRedirect>
  )
}
