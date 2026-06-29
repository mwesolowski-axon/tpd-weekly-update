import type { UpdateIndex, WeeklyUpdate } from './types'

const REPO = import.meta.env.VITE_GITHUB_REPO as string | undefined
const BRANCH = (import.meta.env.VITE_GITHUB_BRANCH as string) || 'main'

function dataBaseUrl(): string {
  if (import.meta.env.DEV) {
    return `${import.meta.env.BASE_URL}data`
  }
  if (REPO) {
    return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public/data`
  }
  return `${import.meta.env.BASE_URL}data`
}

async function fetchJson<T>(path: string, cacheBust = false): Promise<T> {
  const url = `${dataBaseUrl()}/${path}${cacheBust ? `?t=${Date.now()}` : ''}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchIndex(cacheBust = false): Promise<UpdateIndex> {
  return fetchJson<UpdateIndex>('updates/index.json', cacheBust)
}

export async function fetchUpdate(id: string, cacheBust = false): Promise<WeeklyUpdate> {
  return fetchJson<WeeklyUpdate>(`updates/${id}.json`, cacheBust)
}

export async function fetchAllowlist(): Promise<string[]> {
  return fetchJson<string[]>('admin-allowlist.json')
}

export async function fetchLatestUpdate(cacheBust = false): Promise<WeeklyUpdate | null> {
  const index = await fetchIndex(cacheBust)
  const published = index.updates
    .filter((u) => u.status !== 'draft')
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf))
  if (published.length === 0) return null
  return fetchUpdate(published[0].id, cacheBust)
}
