import '@/css/tailwind.css'
import '@/css/prism.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { LocaleContext } from '@/lib/i18n'

export default function App({ Component, pageProps }) {
  // Pages under pages/[locale]/ pass their locale. Redirect pages and 404 have none and lay
  // themselves out.
  const { locale, alternates } = pageProps
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Analytics />
      {locale ? (
        <LocaleContext.Provider value={locale}>
          <LayoutWrapper alternates={alternates}>
            <Component {...pageProps} />
          </LayoutWrapper>
        </LocaleContext.Provider>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  )
}
