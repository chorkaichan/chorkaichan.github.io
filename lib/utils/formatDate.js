import { DEFAULT_LOCALE, LOCALE_META } from '@/lib/i18n'

const formatDate = (date, locale = DEFAULT_LOCALE) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString(LOCALE_META[locale].dateLocale, options)
}

export default formatDate
