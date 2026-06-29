import type { Bullet, Section, Subsection, WeeklyUpdate } from './types'

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

export function newId(): string {
  return crypto.randomUUID()
}

export function cloneUpdateForNewWeek(
  source: WeeklyUpdate,
  weekOf: string,
  publishedBy: string,
): WeeklyUpdate {
  return {
    id: weekOf,
    weekOf,
    title: `Axon Weekly Update — Week of ${formatWeekOf(weekOf)}`,
    publishedAt: new Date().toISOString(),
    publishedBy,
    status: 'draft',
    sections: source.sections.map((section) => ({
      id: newId(),
      title: section.title,
      subsections: section.subsections.map((ss) => ({
        id: newId(),
        title: ss.title,
        bullets: ss.bullets.map((b) => ({
          id: newId(),
          content: b.content,
        })),
      })),
    })),
  }
}

export function ensureIds(update: WeeklyUpdate): WeeklyUpdate {
  return {
    ...update,
    sections: update.sections.map((section) => ({
      ...section,
      id: section.id || newId(),
      subsections: section.subsections.map((ss) => ({
        ...ss,
        id: ss.id || newId(),
        bullets: ss.bullets.map((b) => ({
          ...b,
          id: b.id || newId(),
        })),
      })),
    })),
  }
}

export function emptyBullet(): Bullet {
  return { id: newId(), content: '<p></p>' }
}

export function emptySubsection(): Subsection {
  return { id: newId(), title: '', bullets: [emptyBullet()] }
}

export function emptySection(): Section {
  return { id: newId(), title: 'New Section', subsections: [emptySubsection()] }
}
