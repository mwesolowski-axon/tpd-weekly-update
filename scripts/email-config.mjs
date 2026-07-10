import fs from 'fs'
import path from 'path'
import { ROOT } from './week-utils.mjs'

const ENV_PATH = path.join(ROOT, '.env')

export function loadEnv(envPath = ENV_PATH) {
  if (!fs.existsSync(envPath)) return {}
  const env = {}
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

export function extractEmails(recipientLine) {
  if (!recipientLine) return []
  return recipientLine
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/<([^>]+)>/)
      return (match ? match[1] : part).trim()
    })
}

export function getEmailConfig(env = loadEnv()) {
  const gmailInbox = Number.parseInt(env.EMAIL_GMAIL_INBOX ?? '0', 10)
  return {
    to: env.EMAIL_TO || '',
    cc: env.EMAIL_CC || '',
    subjectTemplate: env.EMAIL_SUBJECT || 'Axon Weekly Update — Week of {weekOf}',
    siteUrl: (env.SITE_URL || 'https://mwesolowski-axon.github.io/tpd-weekly-update').replace(/\/$/, ''),
    gmailInbox: Number.isNaN(gmailInbox) || gmailInbox < 0 ? 0 : gmailInbox,
  }
}
