import { DEFAULT_LOCALE, LOCALE_META } from '@/lib/i18n'
import { PUBLISH_TIME_ZONE } from '@/lib/publish'

const formatDate = (date, locale = DEFAULT_LOCALE) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Show the day in Japan, not in the time zone of the build machine (UTC on Actions).
    timeZone: PUBLISH_TIME_ZONE,
  }
  return new Date(date).toLocaleDateString(LOCALE_META[locale].dateLocale, options)
}

export default formatDate
