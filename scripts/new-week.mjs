import fs from 'fs'
import path from 'path'
import { updateToMarkdown } from './markdown-week.mjs'
import {
  DRAFT_PATH,
  addDays,
  latestWeekOf,
  parseArgs,
  readIndex,
  readUpdate,
} from './week-utils.mjs'

const args = parseArgs(process.argv.slice(2))
const index = readIndex()
const previousWeekOf = latestWeekOf(index)
if (!previousWeekOf) {
  console.error('No updates in index.json — run npm run seed first.')
  process.exit(1)
}

const weekOf = args.weekOf ?? addDays(previousWeekOf, 7)
const source = readUpdate(previousWeekOf)
const draft = updateToMarkdown({
  ...source,
  weekOf,
  id: weekOf,
  publishedBy: args.by,
})

fs.mkdirSync(path.dirname(DRAFT_PATH), { recursive: true })
fs.writeFileSync(DRAFT_PATH, draft)

console.log(`Wrote ${path.relative(process.cwd(), DRAFT_PATH)}`)
console.log(`  Week of: ${weekOf} (cloned from ${previousWeekOf})`)
console.log('Edit the markdown draft, then run: npm run publish-week')
