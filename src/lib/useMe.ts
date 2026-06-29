import { useCallback, useEffect, useState } from 'react'

export type MeUser = {
  email: string
  name: string
}

type MeState = {
  user: MeUser | null
  loading: boolean
  error: string | null
}

async function loadMe(): Promise<MeUser | null> {
  try {
    const res = await fetch('/api/me', { credentials: 'include', cache: 'no-store' })
    if (res.status === 401) return null
    if (!res.ok) throw new Error('Failed to load identity')
    const data = (await res.json()) as { email: string; name: string }
    return { email: data.email.toLowerCase(), name: data.name }
  } catch {
    if (import.meta.env.DEV) {
      const devEmail = (import.meta.env.VITE_DEV_USER_EMAIL as string | undefined)?.trim()
      if (devEmail) {
        const email = devEmail.toLowerCase()
        return { email, name: email.split('@')[0] }
      }
    }
    throw new Error('Unable to verify your Axon identity')
  }
}

export function useMe(): MeState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<MeState>({ user: null, loading: true, error: null })

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const user = await loadMe()
      setState({ user, loading: false, error: null })
    } catch (e) {
      setState({
        user: null,
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load identity',
      })
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...state, refresh }
}
