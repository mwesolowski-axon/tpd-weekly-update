import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLatestUpdate } from '../lib/content'
import { UpdateRenderer } from '../components/UpdateRenderer'
import type { WeeklyUpdate } from '../lib/types'

export function HomePage() {
  const [update, setUpdate] = useState<WeeklyUpdate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLatestUpdate()
      .then(setUpdate)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-slate-500">Loading latest update…</p>
  }

  if (error || !update) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
        {error ?? 'No updates found.'}
      </div>
    )
  }

  return (
    <div>
      <UpdateRenderer update={update} />
      <div className="mt-10 flex gap-4">
        <Link
          to="/archive"
          className="rounded bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
        >
          View all updates
        </Link>
        <Link
          to={`/update/${update.id}`}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Permalink
        </Link>
      </div>
    </div>
  )
}
