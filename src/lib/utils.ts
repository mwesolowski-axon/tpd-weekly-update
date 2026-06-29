export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent ?? ''
}

export function formatWeekOf(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatPublishedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const UPDATE_TITLE = 'Axon Weekly Update'

export function updateBodyText(sections: {
  title: string
  subsections: { title: string; bullets: { content: string }[] }[]
}[]): string {
  return sections
    .flatMap((s) => [
      s.title,
      ...s.subsections.flatMap((ss) => [
        ss.title,
        ...ss.bullets.map((b) => stripHtml(b.content)),
      ]),
    ])
    .join(' ')
}
