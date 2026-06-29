import { useCallback, useEffect, useState } from 'react'

import { apiUrl, isApiConfigured } from './api'

export type MeUser = {
  email: string
  name: string
}

type MeState = {
  user: MeUser | null
  loading: boolean
  error: string | null
  apiAvailable: boolean
}

async function loadMe(): Promise<MeUser | null> {
  if (!isApiConfigured()) {
    throw new Error('api_not_configured')
  }

  try {
    const res = await fetch(apiUrl('/api/me'), { credentials: 'include', cache: 'no-store' })
    if (res.status === 401) return null
    if (!res.ok) throw new Error('Failed to load identity')
    const data = (await res.json()) as { email: string; name: string }
    return { email: data.email.toLowerCase(), name: data.name }
  } catch (e) {
    if (e instanceof Error && e.message === 'api_not_configured') throw e
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

export function identityErrorMessage(error: string | null): string | null {
  if (!error) return null
  if (error === 'api_not_configured') {
    return 'Admin editing is not available on the GitHub Pages site URL. The public site is static and has no admin API. Use local dev (npm run dev:all) to publish updates — they appear on the live site within seconds. For in-browser admin on a hosted URL, deploy the server/ API behind Axon SSO and set VITE_API_URL at build time.'
  }
  return error
}

export function useMe(): MeState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<MeState>({
    user: null,
    loading: true,
    error: null,
    apiAvailable: isApiConfigured(),
  })

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const user = await loadMe()
      setState({ user, loading: false, error: null, apiAvailable: isApiConfigured() })
    } catch (e) {
      setState({
        user: null,
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load identity',
        apiAvailable: isApiConfigured(),
      })
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...state, refresh }
}
