// Keeps /blog/<slug> URLs from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { BlogSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAuthor, getPost, getPostSlugs, postAlternates } from '@/lib/content'
import { LOCALES, localePath, shareLocale } from '@/lib/i18n'

export async function getStaticPaths() {
  const slugs = new Set(LOCALES.flatMap((locale) => getPostSlugs(locale)))
  return {
    paths: [...slugs].map((slug) => ({ params: { slug: slug.split('/') } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/')
  const available = LOCALES.filter((locale) => getPostSlugs(locale).includes(slug))
  // SNS cards show the English post when there is one.
  const locale = shareLocale(available)
  const { frontMatter } = await getPost(locale, slug)
  const authorDetails = await Promise.all(
    (frontMatter.authors || ['default']).map(
      async (author) => (await getAuthor(locale, author)).frontMatter
    )
  )
  return {
    props: {
      slug,
      available,
      url: `${siteMetadata.siteUrl}${localePath(locale, `/blog/${slug}`)}`,
      frontMatter,
      authorDetails,
      alternates: postAlternates(slug),
    },
  }
}

export default function LegacyPost({
  slug,
  available,
  url,
  frontMatter,
  authorDetails,
  alternates,
}) {
  return (
    <LocaleRedirect path={`/blog/${slug}`} available={available}>
      <BlogSEO url={url} authorDetails={authorDetails} alternates={alternates} {...frontMatter} />
    </LocaleRedirect>
  )
}
