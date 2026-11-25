# chorkaichan.github.io

- サイトは日本語と英語の二言語で、URL は `/ja/...` と `/en/...` になる。ページは `pages/[locale]/` にあり、UI の文言は `data/i18n.js` にある。
- ブログ記事は `data/blog/ja/` と `data/blog/en/` に、同じファイル名で置く。日本語の記事を書く、書き直す、推敲するときは、`.claude/skills/chorkaichan-blog-style/SKILL.md` の口調に合わせる。
- 画像は `public/static/images/YYYY_MM_DD_NN.png` に置く。英語版で差し替える画像は、同じ名前で `public/static/images/en/` に置く。
- ビルドの確認: `yarn build`（静的サイトが `out/` に出力される）
- Next.js のコードを書く前に `AGENTS.md` を読む。

@AGENTS.md
