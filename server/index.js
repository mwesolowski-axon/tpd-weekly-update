import express from 'express'
import { getRequestIdentity } from './identity.js'
import { isAllowlisted, saveUpdate } from './github-save.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(express.json({ limit: '4mb' }))

function requireIdentity(req, res) {
  const identity = getRequestIdentity(req)
  if (!identity.email) {
    res.status(401).json({
      error: 'not_authenticated',
      hint: 'Access this site through Axon SSO. Local dev: set DEV_USER_EMAIL in .env.local.',
    })
    return null
  }
  return identity
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/me', (req, res) => {
  const identity = requireIdentity(req, res)
  if (!identity) return
  res.json({
    email: identity.email,
    name: identity.name,
    sub: identity.sub,
  })
})

app.post('/api/admin/updates', async (req, res) => {
  const identity = requireIdentity(req, res)
  if (!identity) return

  if (!isAllowlisted(identity.email)) {
    res.status(403).json({ error: 'not_allowlisted', email: identity.email })
    return
  }

  const { update, index } = req.body ?? {}
  if (!update?.id || !index?.updates) {
    res.status(400).json({ error: 'invalid_payload' })
    return
  }

  try {
    await saveUpdate(update, index)
    res.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://127.0.0.1:${PORT}`)
})
