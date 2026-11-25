import { useEffect, useState } from 'react'
import Link from '@/components/Link'
import LayoutWrapper from '@/components/LayoutWrapper'
import {
  DEFAULT_LOCALE,
  LocaleContext,
  detectLocale,
  getLocaleFromPath,
  getMessages,
  localePath,
} from '@/lib/i18n'

export default function FourZeroFour() {
  // The same 404.html is served for every missing URL, so pick the language in the browser.
  const [locale, setLocale] = useState(DEFAULT_LOCALE)
  useEffect(() => {
    setLocale(getLocaleFromPath(window.location.pathname) || detectLocale())
  }, [])
  const t = getMessages(locale)

  return (
    <LocaleContext.Provider value={locale}>
      <LayoutWrapper
        alternates={{ ja: { href: localePath('ja') }, en: { href: localePath('en') } }}
      >
        <div className="flex flex-col items-start justify-start md:justify-center md:items-center md:flex-row md:space-x-6 md:mt-24">
          <div className="pt-6 pb-8 space-x-2 md:space-y-5">
            <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-8xl md:leading-14 md:border-r-2 md:px-6">
              404
            </h1>
          </div>
          <div className="max-w-md">
            <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">{t.notFoundTitle}</p>
            <p className="mb-8">{t.notFoundBody}</p>
            <Link
              href={localePath(locale)}
              className="inline px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg shadow-sm focus:outline-hidden focus:shadow-outline-blue hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              {t.backToHome}
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    </LocaleContext.Provider>
  )
}
