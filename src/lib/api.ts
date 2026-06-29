/** Base URL for the admin API (empty = same origin, e.g. behind Axon ALB). */
export function apiBaseUrl(): string {
  return ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl()}${normalized}`
}

export function isApiConfigured(): boolean {
  return import.meta.env.DEV || Boolean(apiBaseUrl())
}
