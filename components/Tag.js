import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'
import { localePath, useLocale } from '@/lib/i18n'

const Tag = ({ text }) => {
  const locale = useLocale()
  return (
    <Link
      href={localePath(locale, `/tags/${kebabCase(text)}`)}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
