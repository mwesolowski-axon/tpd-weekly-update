import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { fetchIndex, fetchUpdate } from '../lib/content'
import { formatWeekOf, stripHtml } from '../lib/utils'
import type { UpdateIndexEntry } from '../lib/types'

interface SearchableUpdate extends UpdateIndexEntry {
  body: string
}

export function ArchivePage() {
  const [searchable, setSearchable] = useState<SearchableUpdate[]>([])
  const [query, setQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const index = await fetchIndex()
      const published = index.updates
        .filter((u) => u.status !== 'draft')
        .sort((a, b) => b.weekOf.localeCompare(a.weekOf))

      const full = await Promise.all(
        published.map(async (entry) => {
          const update = await fetchUpdate(entry.id)
          const body = update.sections
            .flatMap((s) => [
              s.title,
              ...s.subsections.flatMap((ss) => [
                ss.title,
                ...ss.bullets.map((b) => stripHtml(b.content)),
              ]),
            ])
            .join(' ')
          return { ...entry, body }
        }),
      )
      setSearchable(full)
      setLoading(false)
    }
    load().catch(console.error)
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(searchable, {
        keys: ['title', 'body', 'weekOf'],
        threshold: 0.35,
      }),
    [searchable],
  )

  const filtered = useMemo(() => {
    let results = query
      ? fuse.search(query).map((r) => r.item)
      : searchable

    if (dateFrom) {
      results = results.filter((u) => u.weekOf >= dateFrom)
    }
    if (dateTo) {
      results = results.filter((u) => u.weekOf <= dateTo)
    }
    return results
  }, [searchable, fuse, query, dateFrom, dateTo])

  if (loading) {
    return <p className="text-slate-500">Loading archive…</p>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Update Archive</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <input
          type="search"
          placeholder="Search updates…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm sm:col-span-1"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          title="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          title="To date"
        />
      </div>

      <p className="mb-4 text-sm text-slate-500">{filtered.length} update(s)</p>

      <div className="space-y-3">
        {filtered.map((entry, i) => (
          <Link
            key={entry.id}
            to={`/update/${entry.id}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">
                  Week of {formatWeekOf(entry.weekOf)}
                </p>
                <p className="text-sm text-slate-500">{entry.title}</p>
              </div>
              {i === 0 && !query && !dateFrom && !dateTo && (
                <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Latest
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
