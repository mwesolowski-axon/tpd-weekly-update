/** Normalize Axon email for allowlist comparison. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isAllowlisted(email: string, allowlist: string[]): boolean {
  const normalized = normalizeEmail(email)
  return allowlist.some((entry) => normalizeEmail(entry) === normalized)
}
