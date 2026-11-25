import Link from '@/components/Link'
import { localePath, useLocale, useMessages } from '@/lib/i18n'

export default function Pagination({ totalPages, currentPage }) {
  const locale = useLocale()
  const t = useMessages()
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)

  return (
    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            {t.prevPage}
          </button>
        )}
        {prevPage && (
          <Link
            href={localePath(
              locale,
              currentPage - 1 === 1 ? '/blog' : `/blog/page/${currentPage - 1}`
            )}
            rel="prev"
          >
            {t.prevPage}
          </Link>
        )}
        <span>{t.pageOf(currentPage, totalPages)}</span>
        {!nextPage && (
          <button rel="next" className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            {t.nextPage}
          </button>
        )}
        {nextPage && (
          <Link href={localePath(locale, `/blog/page/${currentPage + 1}`)} rel="next">
            {t.nextPage}
          </Link>
        )}
      </nav>
    </div>
  )
}
