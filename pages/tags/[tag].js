// Keeps /tags/<tag> URLs from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getTags, tagAlternates } from '@/lib/content'
import { LOCALES } from '@/lib/i18n'

export async function getStaticPaths() {
  const tags = new Set()
  for (const locale of LOCALES) {
    Object.keys(await getTags(locale)).forEach((tag) => tags.add(tag))
  }
  return { paths: [...tags].map((tag) => ({ params: { tag } })), fallback: false }
}

export async function getStaticProps({ params: { tag } }) {
  const available = []
  for (const locale of LOCALES) {
    if (tag in (await getTags(locale))) available.push(locale)
  }
  return { props: { tag, available, alternates: await tagAlternates(tag) } }
}

export default function LegacyTag({ tag, available, alternates }) {
  return (
    <LocaleRedirect path={`/tags/${tag}`} available={available}>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
        alternates={alternates}
      />
    </LocaleRedirect>
  )
}
