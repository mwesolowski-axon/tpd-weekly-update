/**
 * Axon SSO identity from ALB OIDC headers (production) or dev/proxy headers (local).
 * Mirrors tam-tools-hip/apps/api/src/identity.js — payload decode only, no JWT verify.
 */

function normalizeHeader(req, name) {
  const v = req.get(name)
  if (!v || typeof v !== 'string') return ''
  return v.trim()
}

function parseAmznOidcData(req) {
  const raw = normalizeHeader(req, 'x-amzn-oidc-data')
  if (!raw) return null

  const parts = raw.split('.')
  if (parts.length < 2) return null

  let payload
  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch {
    try {
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const pad = '='.repeat((4 - (b64.length % 4)) % 4)
      payload = JSON.parse(Buffer.from(b64 + pad, 'base64').toString('utf8'))
    } catch {
      return null
    }
  }

  if (!payload || typeof payload !== 'object') return null

  const sub = String(payload.sub || '').trim()
  let email = String(payload.email || '').trim()
  if (!email && typeof payload.preferred_username === 'string' && payload.preferred_username.includes('@')) {
    email = payload.preferred_username.trim()
  }

  const given = String(payload.given_name || '').trim()
  const family = String(payload.family_name || '').trim()
  const nameClaim = String(payload.name || '').trim()
  const name =
    nameClaim ||
    [given, family].filter(Boolean).join(' ').trim() ||
    (email ? email.split('@')[0] : '')

  if (!sub || !email) return null

  return {
    email: email.toLowerCase(),
    name,
    sub,
  }
}

export function getRequestIdentity(req) {
  const fromAlb = parseAmznOidcData(req)
  if (fromAlb) return fromAlb

  const email = (
    normalizeHeader(req, 'x-auth-request-email') ||
    normalizeHeader(req, 'x-forwarded-email') ||
    process.env.DEV_USER_EMAIL ||
    ''
  ).toLowerCase()

  const name =
    normalizeHeader(req, 'x-auth-request-preferred-username') ||
    normalizeHeader(req, 'x-forwarded-user') ||
    normalizeHeader(req, 'x-auth-request-user') ||
    process.env.DEV_USER_NAME ||
    (email ? email.split('@')[0] : '')

  const sub =
    normalizeHeader(req, 'x-okta-sub') ||
    normalizeHeader(req, 'x-auth-request-user') ||
    process.env.DEV_OKTA_SUB ||
    (email ? `email:${email}` : '')

  return { email, name, sub }
}
