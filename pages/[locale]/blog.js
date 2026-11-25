import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { getPosts } from '@/lib/content'
import { localeStaticPaths, useMessages } from '@/lib/i18n'

export const POSTS_PER_PAGE = 5

export async function getStaticPaths() {
  return { paths: localeStaticPaths(), fallback: false }
}

export async function getStaticProps({ params: { locale } }) {
  const posts = await getPosts(locale)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { locale, initialDisplayPosts, posts, pagination } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  const t = useMessages()
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={t.siteDescription} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={t.allPosts}
      />
    </>
  )
}
