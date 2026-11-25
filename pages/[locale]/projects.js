import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'
import { localeStaticPaths, useLocale, useMessages } from '@/lib/i18n'

export async function getStaticPaths() {
  return { paths: localeStaticPaths(), fallback: false }
}

export async function getStaticProps({ params: { locale } }) {
  return { props: { locale } }
}

export default function Projects() {
  const locale = useLocale()
  const t = useMessages()
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={t.siteDescription} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-9 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {t.projects}
          </h1>
        </div>
        <div className="container py-12">
          <div className="flex flex-wrap -m-4">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description[locale]}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
