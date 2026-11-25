import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  LOCALES,
  LOCALE_META,
  rememberLocale,
  swapLocale,
  useLocale,
  useMessages,
} from '@/lib/i18n'

// Links to the current page in the other languages. `alternates` comes from pages whose
// counterpart is not simply the same path with another prefix (posts and tags).
export default function LocaleSwitch({ alternates, className = '' }) {
  const router = useRouter()
  const current = useLocale()
  const t = useMessages()

  return (
    <nav aria-label={t.switchLanguage} className={`flex items-center text-sm ${className}`}>
      {LOCALES.map((locale, i) => {
        const href = alternates?.[locale]?.href || swapLocale(router.asPath, locale)
        return (
          <span key={locale} className="flex items-center">
            {i > 0 && <span className="mx-1 text-gray-400">/</span>}
            {locale === current ? (
              <span aria-current="true" className="font-semibold text-gray-900 dark:text-gray-100">
                {LOCALE_META[locale].label}
              </span>
            ) : (
              <Link
                href={href}
                hrefLang={LOCALE_META[locale].htmlLang}
                lang={LOCALE_META[locale].htmlLang}
                onClick={() => rememberLocale(locale)}
                className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
              >
                {LOCALE_META[locale].label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
