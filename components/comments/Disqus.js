import React, { useState } from 'react'

import siteMetadata from '@/data/siteMetadata'
import { DEFAULT_LOCALE, useLocale, useMessages } from '@/lib/i18n'

const Disqus = ({ frontMatter }) => {
  const [enableLoadComments, setEnabledLoadComments] = useState(true)
  const locale = useLocale()
  const t = useMessages()
  // Japanese posts keep their pre-bilingual identifier so existing comments stay attached.
  const identifier = locale === DEFAULT_LOCALE ? frontMatter.slug : `${locale}/${frontMatter.slug}`

  const COMMENTS_ID = 'disqus_thread'

  function LoadComments() {
    setEnabledLoadComments(false)

    window.disqus_config = function () {
      this.page.url = window.location.href
      this.page.identifier = identifier
      this.language = locale
    }
    if (window.DISQUS === undefined) {
      const script = document.createElement('script')
      script.src = 'https://' + siteMetadata.comment.disqusConfig.shortname + '.disqus.com/embed.js'
      script.setAttribute('data-timestamp', +new Date())
      script.async = true
      document.body.appendChild(script)
    } else {
      window.DISQUS.reset({ reload: true })
    }
  }

  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && <button onClick={LoadComments}>{t.loadComments}</button>}
      <div className="disqus-frame" id={COMMENTS_ID} />
    </div>
  )
}

export default Disqus
