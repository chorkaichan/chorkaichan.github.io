import Head from 'next/head'
import { useRouter } from 'next/router'
import siteMetadata from '@/data/siteMetadata'
import { LOCALES, LOCALE_META, localePath, swapLocale, useLocale } from '@/lib/i18n'

// Paths of the same page in every locale. `alternates` comes from pages that know which
// translations exist (posts and tags).
const useLocaleHrefs = (alternates) => {
  const router = useRouter()
  return Object.fromEntries(
    LOCALES.filter((l) => !alternates || alternates[l]?.exists !== false).map((l) => [
      l,
      alternates?.[l]?.href || swapLocale(router.asPath, l),
    ])
  )
}

// Links to the same page in every locale, so that search engines can pair the translations.
const LocaleAlternates = ({ hrefs, canonical }) => {
  const locale = useLocale()
  return (
    <Head>
      <link rel="canonical" href={canonical} />
      {Object.entries(hrefs).map(([l, href]) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${siteMetadata.siteUrl}${href}`} />
      ))}
      {hrefs.ja && (
        <link rel="alternate" hrefLang="x-default" href={`${siteMetadata.siteUrl}${hrefs.ja}`} />
      )}
      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${siteMetadata.siteUrl}${localePath(locale)}feed.xml`}
      />
    </Head>
  )
}

const CommonSEO = ({ title, description, ogType, ogImage, twImage, alternates }) => {
  const router = useRouter()
  const locale = useLocale()
  const hrefs = useLocaleHrefs(alternates)
  // On a page without a locale in its URL (`/`, `/blog/...`), this is the page it redirects to.
  const canonical = `${siteMetadata.siteUrl}${hrefs[locale] || swapLocale(router.asPath, locale)}`
  return (
    <>
      <LocaleAlternates hrefs={hrefs} canonical={canonical} />
      <Head>
        <title>{title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:locale" content={LOCALE_META[locale].ogLocale} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        {ogImage.constructor.name === 'Array' ? (
          ogImage.map(({ url }) => <meta property="og:image" content={url} key={url} />)
        ) : (
          <meta property="og:image" content={ogImage} key={ogImage} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={siteMetadata.twitter} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={twImage} />
      </Head>
    </>
  )
}

export const PageSEO = ({ title, description }) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      twImage={twImageUrl}
    />
  )
}

export const TagSEO = ({ title, description, alternates }) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const router = useRouter()
  const locale = useLocale()
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={ogImageUrl}
        twImage={twImageUrl}
        alternates={alternates}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteMetadata.siteUrl}${localePath(locale, router.asPath.split(/[?#]/)[0].replace(/^\/(ja|en)/, ''))}feed.xml`}
        />
      </Head>
    </>
  )
}

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  images = [],
  alternates,
}) => {
  const publishedAt = new Date(date).toISOString()
  const modifiedAt = new Date(lastmod || date).toISOString()
  let imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
        ? [images]
        : images

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${img}`,
    }
  })

  let authorList
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      }
    })
  } else {
    authorList = {
      '@type': 'Person',
      name: siteMetadata.author,
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: summary,
  }

  const twImageUrl = featuredImages[0].url

  return (
    <>
      <CommonSEO
        title={title}
        description={summary}
        ogType="article"
        ogImage={featuredImages}
        twImage={twImageUrl}
        alternates={alternates}
      />
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  )
}
