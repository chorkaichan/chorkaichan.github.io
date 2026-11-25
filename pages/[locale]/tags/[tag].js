import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { writeRss } from '@/lib/generate-rss'
import { getPosts, getTags, tagAlternates } from '@/lib/content'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'
import kebabCase from '@/lib/utils/kebabCase'

export async function getStaticPaths() {
  const paths = []
  for (const locale of LOCALES) {
    const tags = await getTags(locale)
    Object.keys(tags).forEach((tag) => paths.push({ params: { locale, tag } }))
  }

  return { paths, fallback: false }
}

export async function getStaticProps({ params: { locale, tag } }) {
  const allPosts = await getPosts(locale)
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(tag)
  )

  writeRss(filteredPosts, locale, `${locale}/tags/${tag}/feed.xml`)
  // Keep the pre-bilingual tag feeds for existing subscribers.
  if (locale === DEFAULT_LOCALE) writeRss(filteredPosts, locale, `tags/${tag}/feed.xml`)

  return { props: { locale, alternates: await tagAlternates(tag), posts: filteredPosts, tag } }
}

export default function Tag({ posts, tag, alternates }) {
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
        alternates={alternates}
      />
      <ListLayout posts={posts} title={title} />
    </>
  )
}
