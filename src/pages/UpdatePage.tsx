import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adjacentUpdates, fetchIndex, fetchUpdate } from '../lib/content'
import { UpdateRenderer } from '../components/UpdateRenderer'
import { formatWeekOf } from '../lib/utils'
import type { UpdateIndexEntry, WeeklyUpdate } from '../lib/types'

const navLinkClass =
  'rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm hover:border-blue-300 hover:shadow transition-shadow'

function UpdateNav({
  prev,
  next,
}: {
  prev: UpdateIndexEntry | null
  next: UpdateIndexEntry | null
}) {
  if (!prev && !next) return null

  return (
    <nav className="flex items-stretch justify-between gap-4">
      {prev ? (
        <Link to={`/update/${prev.id}`} className={`${navLinkClass} text-left`}>
          <span className="block text-slate-500">Previous</span>
          <span className="block font-medium text-slate-900">
            Week of {formatWeekOf(prev.weekOf)}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/update/${next.id}`} className={`${navLinkClass} text-right ml-auto`}>
          <span className="block text-slate-500">Next</span>
          <span className="block font-medium text-slate-900">
            Week of {formatWeekOf(next.weekOf)}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export function UpdatePage() {
  const { id } = useParams<{ id: string }>()
  const [update, setUpdate] = useState<WeeklyUpdate | null>(null)
  const [prev, setPrev] = useState<UpdateIndexEntry | null>(null)
  const [next, setNext] = useState<UpdateIndexEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    Promise.all([fetchUpdate(id), fetchIndex()])
      .then(([loaded, index]) => {
        setUpdate(loaded)
        const adjacent = adjacentUpdates(index, id)
        setPrev(adjacent.prev)
        setNext(adjacent.next)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-slate-500">Loading…</p>
  if (error || !update) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
        {error ?? 'Update not found.'}
      </div>
    )
  }

  return (
    <div>
      <Link to="/archive" className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800">
        ← Back to archive
      </Link>

      <div className="mb-6">
        <UpdateNav prev={prev} next={next} />
      </div>

      <UpdateRenderer update={update} headerLabel="" />

      <div className="mt-10">
        <UpdateNav prev={prev} next={next} />
      </div>
    </div>
  )
}
