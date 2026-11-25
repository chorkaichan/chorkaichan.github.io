import { useEffect } from 'react'
import Head from 'next/head'
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, detectLocale, localePath } from '@/lib/i18n'

// Sends a visitor from a path without a locale (`/`, or a URL from before the site was bilingual)
// to the same page in their language. GitHub Pages cannot redirect on the server, so this runs in
// the browser; without JavaScript the meta refresh falls back to the Japanese page.
export default function LocaleRedirect({ path = '/', available = LOCALES }) {
  // A page that exists in only one language (e.g. an untranslated post) opens in that language.
  const fallback = available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0]
  const targetFor = (locale) => localePath(available.includes(locale) ? locale : fallback, path)

  useEffect(() => {
    const target = targetFor(detectLocale())
    window.location.replace(target + window.location.search + window.location.hash)
  })

  return (
    <>
      <Head>
        <title>musicolare tech blog</title>
        <meta name="robots" content="noindex" />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${targetFor(fallback)}`} />
        </noscript>
      </Head>
      <div className="flex justify-center mt-24 space-x-6 text-lg">
        {available.map((locale) => (
          <a
            key={locale}
            href={targetFor(locale)}
            hrefLang={LOCALE_META[locale].htmlLang}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {LOCALE_META[locale].label}
          </a>
        ))}
      </div>
    </>
  )
}
