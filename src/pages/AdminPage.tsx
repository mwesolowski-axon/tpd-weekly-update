import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { saveUpdateToRepo } from '../lib/admin-api'
import { isAllowlisted } from '../lib/allowlist'
import { fetchAllowlist, fetchIndex, fetchLatestUpdate, fetchUpdate } from '../lib/content'
import { useMe } from '../lib/useMe'
import { SectionEditor } from '../components/SectionEditor'
import { cloneUpdateForNewWeek, ensureIds, formatWeekOf } from '../lib/utils'
import type { UpdateIndex, WeeklyUpdate } from '../lib/types'

type View = 'gate' | 'dashboard' | 'editor'

export function AdminPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading, error: identityError } = useMe()
  const [view, setView] = useState<View>('gate')
  const [gateError, setGateError] = useState<string | null>(null)
  const [index, setIndex] = useState<UpdateIndex | null>(null)
  const [editing, setEditing] = useState<WeeklyUpdate | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const bootstrapDashboard = useCallback(async () => {
    if (!user) return

    const allowlist = await fetchAllowlist()
    if (!isAllowlisted(user.email, allowlist)) {
      setGateError(`"${user.email}" is not authorized to edit updates.`)
      setView('gate')
      return
    }

    setGateError(null)
    const idx = await fetchIndex(true)
    setIndex(idx)
    setView('dashboard')

    const editId = searchParams.get('edit')
    const isNew = searchParams.get('new')
    if (editId) {
      const update = await fetchUpdate(editId, true)
      setEditing(ensureIds(update))
      setView('editor')
    } else if (isNew) {
      const latest = await fetchLatestUpdate(true)
      if (latest) {
        const nextMonday = getNextWeekOf(latest.weekOf)
        setEditing(cloneUpdateForNewWeek(latest, nextMonday, user.email))
        setView('editor')
      }
    }
  }, [searchParams, user])

  useEffect(() => {
    if (loading) return
    if (!user) {
      setView('gate')
      return
    }
    bootstrapDashboard().catch((e: unknown) => {
      setGateError(e instanceof Error ? e.message : 'Failed to load admin data')
      setView('gate')
    })
  }, [loading, user, bootstrapDashboard])

  const handleSave = async (publish: boolean) => {
    if (!editing || !user) return

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const toSave: WeeklyUpdate = {
        ...ensureIds(editing),
        publishedBy: user.email,
        publishedAt: new Date().toISOString(),
        status: publish ? 'published' : 'draft',
      }

      const currentIndex = index ?? { updates: [] }
      const entry = {
        id: toSave.id,
        weekOf: toSave.weekOf,
        title: toSave.title,
        publishedAt: toSave.publishedAt,
        publishedBy: toSave.publishedBy,
        status: toSave.status,
      }
      const others = currentIndex.updates.filter((u) => u.id !== toSave.id)
      const newIndex: UpdateIndex = {
        updates: [entry, ...others].sort((a, b) => b.weekOf.localeCompare(a.weekOf)),
      }

      await saveUpdateToRepo(toSave, newIndex)
      setIndex(newIndex)
      setEditing(toSave)
      setSaveSuccess(true)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading || (user && view === 'gate' && !gateError && !identityError)) {
    return <p className="text-slate-500">Verifying your Axon identity…</p>
  }

  if (!user || gateError || identityError) {
    return (
      <div className="max-w-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h2>
        <p className="text-sm text-slate-600 mb-6">
          Editing weekly updates requires Axon SSO. Access is limited to allowlisted{' '}
          <span className="font-medium">@axon.com</span> email addresses.
        </p>

        {(gateError || identityError) && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {gateError || identityError}
          </div>
        )}

        {!user && !identityError && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-600 space-y-3">
            <p>
              Sign in through your organization&apos;s Axon portal (Okta). There is no separate
              login on this page — your browser session is verified automatically.
            </p>
            {import.meta.env.DEV && (
              <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                Local dev: run <code className="rounded bg-slate-100 px-1">npm run dev:api</code>{' '}
                and set <code className="rounded bg-slate-100 px-1">DEV_USER_EMAIL</code> in{' '}
                <code className="rounded bg-slate-100 px-1">.env.local</code>.
              </p>
            )}
          </div>
        )}

        <Link to="/" className="mt-6 inline-block text-sm text-blue-600 hover:text-blue-800">
          ← Back to site
        </Link>
      </div>
    )
  }

  if (view === 'editor' && editing) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Edit Update</h2>
          <button
            type="button"
            onClick={() => {
              setEditing(null)
              setView('dashboard')
              navigate('/admin')
            }}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Dashboard
          </button>
        </div>

        {saveError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Saved successfully.
          </div>
        )}

        <SectionEditor update={editing} onChange={setEditing} />

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Publish'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Save as draft
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-sm text-slate-500">Signed in as {user.email}</p>
        </div>
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to site
        </Link>
      </div>

      <button
        type="button"
        onClick={async () => {
          const latest = await fetchLatestUpdate(true)
          if (!latest || !user) return
          const nextWeek = getNextWeekOf(latest.weekOf)
          setEditing(cloneUpdateForNewWeek(latest, nextWeek, user.email))
          setView('editor')
        }}
        className="mb-6 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Create New Update (clone from latest)
      </button>

      <div className="space-y-2">
        {index?.updates.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-slate-900">
                Week of {formatWeekOf(entry.weekOf)}
              </p>
              <p className="text-sm text-slate-500">
                {entry.status === 'draft' ? 'Draft' : 'Published'} · {entry.publishedBy}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const update = await fetchUpdate(entry.id, true)
                setEditing(ensureIds(update))
                setView('editor')
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function getNextWeekOf(currentWeekOf: string): string {
  const d = new Date(currentWeekOf + 'T12:00:00')
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}
