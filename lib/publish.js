// Decides which posts are public at build time.
// A post is public when it is not a draft and its `date` has come.
// A date without a time (`'2026-12-01'`) is published at 00:00 in PUBLISH_TIME_ZONE.
// The scheduled build in .github/workflows/main.yml starts a few minutes before midnight,
// so the build treats posts dated within PUBLISH_LEAD_MINUTES from now as already published.

export const PUBLISH_TIME_ZONE = 'Asia/Tokyo'
const PUBLISH_TIME_ZONE_OFFSET = '+09:00'
const PUBLISH_LEAD_MINUTES = 15

// `SHOW_SCHEDULED_POSTS=1 yarn dev` shows posts whose date has not come yet (drafts stay hidden).
const showScheduled = () => process.env.SHOW_SCHEDULED_POSTS === '1'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

// gray-matter turns an unquoted `date: 2026-12-01` into a Date at 00:00 UTC.
const isDateOnlyValue = (date) =>
  date instanceof Date &&
  date.getUTCHours() === 0 &&
  date.getUTCMinutes() === 0 &&
  date.getUTCSeconds() === 0 &&
  date.getUTCMilliseconds() === 0

export function publishTime(date) {
  if (!date) return null
  if (typeof date === 'string' && DATE_ONLY.test(date)) {
    return new Date(`${date}T00:00:00${PUBLISH_TIME_ZONE_OFFSET}`)
  }
  if (isDateOnlyValue(date)) {
    return new Date(`${date.toISOString().slice(0, 10)}T00:00:00${PUBLISH_TIME_ZONE_OFFSET}`)
  }
  return new Date(date)
}

export function isPublished(frontmatter, now = new Date()) {
  if (frontmatter.draft === true) return false
  if (showScheduled()) return true
  const time = publishTime(frontmatter.date)
  if (!time) return true
  return time.getTime() <= now.getTime() + PUBLISH_LEAD_MINUTES * 60 * 1000
}
