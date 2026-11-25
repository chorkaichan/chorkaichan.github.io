import fs from 'fs'
import { globby } from 'globby'
import prettier from 'prettier'
import siteMetadata from '../data/siteMetadata.js'

// Lists every page of the static export under out/<locale>/. The root and the pre-bilingual
// URLs only redirect to a locale, so they are left out.
;(async () => {
  const prettierConfig = await prettier.resolveConfig('./prettier.config.js')
  const pages = await globby(['out/ja/**/index.html', 'out/en/**/index.html'])

  const routes = pages.map((page) => page.replace(/^out/, '').replace(/index\.html$/, '')).sort()

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${routes
              .map(
                (route) => `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `
              )
              .join('')}
        </urlset>
    `

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  fs.writeFileSync('public/sitemap.xml', formatted)
  // `next build` has already copied public/ into out/, so write the static export copy too.
  if (fs.existsSync('out')) {
    fs.writeFileSync('out/sitemap.xml', formatted)
  }
})()
