import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { getPosts } from '@/lib/content'
import { LOCALES, useMessages } from '@/lib/i18n'
import { POSTS_PER_PAGE } from '../../blog'

export async function getStaticPaths() {
  const paths = []
  for (const locale of LOCALES) {
    const totalPages = Math.ceil((await getPosts(locale)).length / POSTS_PER_PAGE)
    for (let i = 1; i <= totalPages; i++) {
      paths.push({ params: { locale, page: i.toString() } })
    }
  }

  return { paths, fallback: false }
}

export async function getStaticProps({ params: { locale, page } }) {
  const posts = await getPosts(locale)
  const pageNumber = parseInt(page)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { locale, posts, initialDisplayPosts, pagination } }
}

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  const t = useMessages()
  return (
    <>
      <PageSEO title={siteMetadata.title} description={t.siteDescription} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={t.allPosts}
      />
    </>
  )
}
