import LocaleRedirect from '@/components/LocaleRedirect'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { SHARE_LOCALE, getMessages } from '@/lib/i18n'

export default function Index() {
  return (
    <LocaleRedirect path="/">
      <PageSEO title={siteMetadata.title} description={getMessages(SHARE_LOCALE).siteDescription} />
    </LocaleRedirect>
  )
}
