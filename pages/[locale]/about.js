import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getAuthor } from '@/lib/content'
import { localeStaticPaths } from '@/lib/i18n'

const DEFAULT_LAYOUT = 'AuthorLayout'

export async function getStaticPaths() {
  return { paths: localeStaticPaths(), fallback: false }
}

export async function getStaticProps({ params: { locale } }) {
  const authorDetails = await getAuthor(locale, 'default')
  return { props: { locale, authorDetails } }
}

export default function About({ authorDetails }) {
  const { mdxSource, frontMatter } = authorDetails

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
