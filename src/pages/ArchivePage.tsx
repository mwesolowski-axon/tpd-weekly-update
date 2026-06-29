import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { fetchIndex, fetchUpdate } from '../lib/content'
import { formatWeekOf, UPDATE_TITLE, updateBodyText } from '../lib/utils'
import type { UpdateIndexEntry } from '../lib/types'

interface SearchableUpdate extends UpdateIndexEntry {
  body: string
}

const PAGE_SIZES = [10, 25, 50] as const

export function ArchivePage() {
  const [searchable, setSearchable] = useState<SearchableUpdate[]>([])
  const [query, setQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)
  const [page, setPage] = useState(1)
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
          return { ...entry, body: updateBodyText(update.sections) }
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
        keys: ['body'],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [searchable],
  )

  const filtered = useMemo(() => {
    let results = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : searchable

    if (dateFrom) {
      results = results.filter((u) => u.weekOf >= dateFrom)
    }
    if (dateTo) {
      results = results.filter((u) => u.weekOf <= dateTo)
    }
    return results
  }, [searchable, fuse, query, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    setPage(1)
  }, [query, dateFrom, dateTo, pageSize])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const latestId = searchable[0]?.id
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const showingTo = Math.min(currentPage * pageSize, filtered.length)

  if (loading) {
    return <p className="text-slate-500">Loading archive…</p>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Update Archive</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <input
          type="search"
          placeholder="Search update content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm sm:col-span-1"
        />
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          <span className="font-medium">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          <span className="font-medium">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <p>
          {filtered.length} update(s)
          {filtered.length > 0 && (
            <span>
              {' '}
              · showing {showingFrom}–{showingTo}
            </span>
          )}
        </p>
        <label className="flex items-center gap-2">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) as (typeof PAGE_SIZES)[number])}
            className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-900"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-3">
        {paginated.map((entry) => (
          <Link
            key={entry.id}
            to={`/update/${entry.id}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{UPDATE_TITLE}</p>
                <p className="text-sm text-slate-500">Week of {formatWeekOf(entry.weekOf)}</p>
              </div>
              {entry.id === latestId && !query && !dateFrom && !dateTo && currentPage === 1 && (
                <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Latest
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-slate-500">No updates match your filters.</p>
      )}

      {filtered.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
