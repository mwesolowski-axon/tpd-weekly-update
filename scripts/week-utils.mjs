import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const ROOT = path.join(__dirname, '..')
export const DRAFT_PATH = path.join(ROOT, 'content', 'weekly-update.DRAFT.md')
export const UPDATES_DIR = path.join(ROOT, 'public', 'data', 'updates')
export const INDEX_PATH = path.join(UPDATES_DIR, 'index.json')

export function newId() {
  return crypto.randomUUID()
}

export function formatWeekOf(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function addDays(dateStr, days) {
  const date = new Date(`${dateStr}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function readIndex() {
  return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'))
}

export function readUpdate(id) {
  const file = path.join(UPDATES_DIR, `${id}.json`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function latestWeekOf(index) {
  const sorted = [...index.updates].sort((a, b) => b.weekOf.localeCompare(a.weekOf))
  return sorted[0]?.weekOf ?? null
}

export function parseArgs(argv) {
  const args = { weekOf: null, by: 'mwesolowski@axon.com' }
  for (const arg of argv) {
    if (arg.startsWith('--week-of=')) args.weekOf = arg.slice('--week-of='.length)
    if (arg.startsWith('--by=')) args.by = arg.slice('--by='.length)
  }
  return args
}
