// Keeps /blog/<slug> URLs from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { getPostSlugs } from '@/lib/content'
import { LOCALES } from '@/lib/i18n'

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
  return { props: { slug, available } }
}

export default function LegacyPost({ slug, available }) {
  return <LocaleRedirect path={`/blog/${slug}`} available={available} />
}
