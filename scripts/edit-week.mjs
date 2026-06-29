import fs from 'fs'
import path from 'path'
import { updateToMarkdown } from './markdown-week.mjs'
import {
  DRAFT_PATH,
  UPDATES_DIR,
  formatWeekOf,
  parseArgs,
  readIndex,
  readUpdate,
} from './week-utils.mjs'

const args = parseArgs(process.argv.slice(2))

if (!args.weekOf) {
  const index = readIndex()
  const weeks = [...index.updates].sort((a, b) => b.weekOf.localeCompare(a.weekOf))
  console.error('Usage: npm run edit-week -- --week-of=YYYY-MM-DD')
  console.error('')
  console.error('Available weeks:')
  for (const entry of weeks) {
    console.error(`  ${entry.weekOf}  (${formatWeekOf(entry.weekOf)})`)
  }
  process.exit(1)
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(args.weekOf)) {
  console.error('week-of must be YYYY-MM-DD.')
  process.exit(1)
}

const updatePath = path.join(UPDATES_DIR, `${args.weekOf}.json`)
if (!fs.existsSync(updatePath)) {
  console.error(`No update found for ${args.weekOf}`)
  console.error('Check dates with: npm run edit-week')
  process.exit(1)
}

const source = readUpdate(args.weekOf)
const draft = updateToMarkdown(source)

fs.mkdirSync(path.dirname(DRAFT_PATH), { recursive: true })
fs.writeFileSync(DRAFT_PATH, draft)

console.log(`Wrote ${path.relative(process.cwd(), DRAFT_PATH)}`)
console.log(`  Editing: week of ${args.weekOf} (${formatWeekOf(args.weekOf)})`)
console.log('Edit the markdown draft, then run: npm run publish-week')
