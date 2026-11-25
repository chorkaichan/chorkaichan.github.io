import { writeRss } from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getAuthor, getPost, getPosts, getPostSlugs, postAlternates } from '@/lib/content'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  return {
    paths: LOCALES.flatMap((locale) =>
      getPostSlugs(locale).map((slug) => ({ params: { locale, slug: slug.split('/') } }))
    ),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { locale } = params
  const slug = params.slug.join('/')
  const allPosts = await getPosts(locale)
  const postIndex = allPosts.findIndex((post) => post.slug === slug)
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getPost(locale, slug)
  const authorList = post.frontMatter.authors || ['default']
  const authorDetails = await Promise.all(
    authorList.map(async (author) => (await getAuthor(locale, author)).frontMatter)
  )

  // rss: one feed per locale. /feed.xml stays as the Japanese feed for existing subscribers.
  writeRss(allPosts, locale, `${locale}/feed.xml`)
  if (locale === DEFAULT_LOCALE) writeRss(allPosts, locale, 'feed.xml')

  return {
    props: { locale, alternates: postAlternates(slug), post, authorDetails, prev, next },
  }
}

export default function Blog({ post, authorDetails, prev, next, alternates }) {
  const { mdxSource, toc, frontMatter } = post

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      toc={toc}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      authorDetails={authorDetails}
      prev={prev}
      next={next}
      alternates={alternates}
    />
  )
}
