// Keeps /tags/<tag> URLs from before the site was bilingual working.
import LocaleRedirect from '@/components/LocaleRedirect'
import { getTags } from '@/lib/content'
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
  return { props: { tag, available } }
}

export default function LegacyTag({ tag, available }) {
  return <LocaleRedirect path={`/tags/${tag}`} available={available} />
}
