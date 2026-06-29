import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchUpdate } from '../lib/content'
import { UpdateRenderer } from '../components/UpdateRenderer'
import type { WeeklyUpdate } from '../lib/types'

export function UpdatePage() {
  const { id } = useParams<{ id: string }>()
  const [update, setUpdate] = useState<WeeklyUpdate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchUpdate(id)
      .then(setUpdate)
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
      <UpdateRenderer update={update} />
    </div>
  )
}
