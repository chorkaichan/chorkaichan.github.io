const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // The site is hosted on GitHub Pages, so `next build` writes a static site to out/.
  output: 'export',
  // Export /ja/ as ja/index.html instead of ja.html, so GitHub Pages serves both /ja and /ja/.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
})
