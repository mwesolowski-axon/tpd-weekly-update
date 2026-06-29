export interface Bullet {
  id: string
  content: string
}

export interface Subsection {
  id: string
  title: string
  bullets: Bullet[]
}

export interface Section {
  id: string
  title: string
  subsections: Subsection[]
}

export interface WeeklyUpdate {
  id: string
  weekOf: string
  title: string
  publishedAt: string
  publishedBy: string
  status?: 'draft' | 'published'
  sections: Section[]
}

export interface UpdateIndexEntry {
  id: string
  weekOf: string
  title: string
  publishedAt: string
  publishedBy: string
  status?: 'draft' | 'published'
}

export interface UpdateIndex {
  updates: UpdateIndexEntry[]
}
