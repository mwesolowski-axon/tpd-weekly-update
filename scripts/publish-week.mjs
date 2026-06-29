import fs from 'fs'
import path from 'path'
import { parseMarkdownWeek } from './markdown-week.mjs'
import {
  DRAFT_PATH,
  INDEX_PATH,
  UPDATES_DIR,
  formatWeekOf,
  readIndex,
} from './week-utils.mjs'

if (!fs.existsSync(DRAFT_PATH)) {
  console.error(`Draft not found: ${DRAFT_PATH}`)
  console.error('Run: npm run new-week')
  process.exit(1)
}

let draft
try {
  draft = parseMarkdownWeek(fs.readFileSync(DRAFT_PATH, 'utf8'))
} catch (error) {
  console.error(`Could not parse ${path.relative(process.cwd(), DRAFT_PATH)}:`)
  console.error(error.message)
  process.exit(1)
}

const published = {
  ...draft,
  title: draft.title || 'Axon Weekly Update',
  publishedAt: new Date().toISOString(),
  publishedBy: draft.publishedBy || 'mwesolowski@axon.com',
}
delete published.status

const updatePath = path.join(UPDATES_DIR, `${published.id}.json`)
fs.writeFileSync(updatePath, `${JSON.stringify(published, null, 2)}\n`)

const index = readIndex()
const entry = {
  id: published.id,
  weekOf: published.weekOf,
  title: published.title,
  publishedAt: published.publishedAt,
  publishedBy: published.publishedBy,
}
const others = index.updates.filter((u) => u.id !== published.id)
const updates = [entry, ...others].sort((a, b) => b.weekOf.localeCompare(a.weekOf))
fs.writeFileSync(INDEX_PATH, `${JSON.stringify({ updates }, null, 2)}\n`)

console.log(`Published ${published.id} → public/data/updates/${published.id}.json`)
console.log(`Updated public/data/updates/index.json (${updates.length} weeks)`)
console.log('')
console.log('Next — commit and push from Cursor:')
console.log(`  git add public/data/updates/${published.id}.json public/data/updates/index.json`)
console.log(`  git commit -m "Publish weekly update: week of ${formatWeekOf(published.weekOf)}"`)
console.log('  git push')
console.log('')
console.log('The live site picks up content from GitHub within a minute (no redeploy needed).')
