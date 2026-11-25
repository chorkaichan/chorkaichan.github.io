import fs from 'fs'
import path from 'path'
import { escape } from '@/lib/utils/htmlEscaper'

import siteMetadata from '@/data/siteMetadata'
import { LOCALE_META, getMessages, localePath } from '@/lib/i18n'

const generateRssItem = (post, locale) => `
  <item>
    <guid>${siteMetadata.siteUrl}${localePath(locale, `/blog/${post.slug}`)}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}${localePath(locale, `/blog/${post.slug}`)}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

// `page` is the feed's path from the site root, e.g. 'ja/feed.xml'.
const generateRss = (posts, locale, page) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}${localePath(locale, '/blog')}</link>
      <description>${escape(getMessages(locale).siteDescription)}</description>
      <language>${LOCALE_META[locale].rssLanguage}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(post, locale)).join('')}
    </channel>
  </rss>
`

// Writes the feed under public/ so that the static export copies it to out/.
export function writeRss(posts, locale, page) {
  if (!posts.length) return
  const file = path.join(process.cwd(), 'public', page)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, generateRss(posts, locale, page))
}

export default generateRss
