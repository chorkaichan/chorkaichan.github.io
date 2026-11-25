import { createContext, useContext } from 'react'
import messages from '@/data/i18n'

// The site is exported as static files, so Next.js' built-in i18n routing is not available.
// Every page lives under pages/[locale]/ and receives `locale` from getStaticProps instead.
export const LOCALES = ['ja', 'en']
export const DEFAULT_LOCALE = 'ja'
// Used when the browser asks for neither Japanese nor English.
export const FALLBACK_LOCALE = 'en'

export const LOCALE_META = {
  ja: {
    label: '日本語',
    htmlLang: 'ja',
    dateLocale: 'ja-JP',
    ogLocale: 'ja_JP',
    rssLanguage: 'ja-jp',
  },
  en: {
    label: 'English',
    htmlLang: 'en',
    dateLocale: 'en-US',
    ogLocale: 'en_US',
    rssLanguage: 'en-us',
  },
}

const STORAGE_KEY = 'preferred-locale'

export const isLocale = (value) => LOCALES.includes(value)

export const localeStaticPaths = () => LOCALES.map((locale) => ({ params: { locale } }))

// localePath('en', '/blog') => '/en/blog/'
export function localePath(locale, path = '/') {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `/${locale}/${clean}/` : `/${locale}/`
}

// Swaps the locale prefix of a path: '/ja/blog/' => '/en/blog/'.
export function swapLocale(path, locale) {
  const [pathname] = path.split(/[?#]/)
  const rest = pathname.replace(/^\/(ja|en)(?=\/|$)/, '')
  return localePath(locale, rest)
}

export function getLocaleFromPath(path) {
  const match = path.match(/^\/(ja|en)(?=\/|$)/)
  return match ? match[1] : null
}

export function rememberLocale(locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Detection still works.
  }
}

// Picks the locale for a visitor: the one they chose on the site before, then the browser's languages.
export function detectLocale() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Ignore and fall through to the browser languages.
  }
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const language of languages) {
    const base = (language || '').toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return FALLBACK_LOCALE
}

export const LocaleContext = createContext(DEFAULT_LOCALE)

export const useLocale = () => useContext(LocaleContext)

export const useMessages = () => messages[useLocale()]

export const getMessages = (locale) => messages[locale]
