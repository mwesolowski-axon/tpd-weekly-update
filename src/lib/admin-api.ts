import { apiUrl } from './api'
import type { UpdateIndex, WeeklyUpdate } from './types'

export async function saveUpdateToRepo(
  update: WeeklyUpdate,
  index: UpdateIndex,
): Promise<void> {
  const res = await fetch(apiUrl('/api/admin/updates'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ update, index }),
  })

  const data = (await res.json().catch(() => ({}))) as { error?: string }
  if (!res.ok) {
    throw new Error(data.error || `Save failed (${res.status})`)
  }
}
