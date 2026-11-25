// Server-only helpers that read the per-locale content under data/blog/<locale>/ and data/authors/<locale>/.
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from './mdx'
import { getAllTags } from './tags'
import { isPublished } from './publish'
import { LOCALES, DEFAULT_LOCALE, localePath } from './i18n'

const root = process.cwd()

export const blogDir = (locale) => `blog/${locale}`

export const getPosts = (locale) => getAllFilesFrontMatter(blogDir(locale))

// Slugs of the published posts only, so drafts and scheduled posts get no page.
export const getPostSlugs = (locale) =>
  getFiles(blogDir(locale))
    .filter((file) => /\.mdx?$/.test(file))
    .filter((file) => {
      const source = fs.readFileSync(path.join(root, 'data', blogDir(locale), file), 'utf8')
      return isPublished(matter(source).data)
    })
    .map((file) => formatSlug(file))

export const getPost = (locale, slug) => getFileBySlug(blogDir(locale), slug)

export const getTags = (locale) => getAllTags(blogDir(locale))

// Falls back to the Japanese profile when an author has no translation yet.
export async function getAuthor(locale, name) {
  const dir = path.join(root, 'data', 'authors', locale)
  const exists = ['md', 'mdx'].some((ext) => fs.existsSync(path.join(dir, `${name}.${ext}`)))
  return getFileBySlug(`authors/${exists ? locale : DEFAULT_LOCALE}`, [name])
}

// Paths of the same post in every locale. A locale without a translation points to its blog index.
export function postAlternates(slug) {
  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      getPostSlugs(locale).includes(slug)
        ? { href: localePath(locale, `/blog/${slug}`), exists: true }
        : { href: localePath(locale, '/blog'), exists: false },
    ])
  )
}

// Paths of the same tag page in every locale. Tags are translated, so most point to the tag index.
export async function tagAlternates(tag) {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const tags = await getTags(locale)
      return [
        locale,
        tag in tags
          ? { href: localePath(locale, `/tags/${tag}`), exists: true }
          : { href: localePath(locale, '/tags'), exists: false },
      ]
    })
  )
  return Object.fromEntries(entries)
}
