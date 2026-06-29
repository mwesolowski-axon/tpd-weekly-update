import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { replaceEmDashes } from './replace-em-dashes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const UPDATES_DIR = path.join(ROOT, 'public', 'data', 'updates')

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const updated = replaceEmDashes(original)
  if (updated !== original) {
    fs.writeFileSync(filePath, updated)
    return true
  }
  return false
}

let count = 0

for (const file of fs.readdirSync(UPDATES_DIR)) {
  if (file.endsWith('.json')) {
    if (fixFile(path.join(UPDATES_DIR, file))) count += 1
  }
}

const draftPath = path.join(ROOT, 'content', 'weekly-update.DRAFT.md')
if (fs.existsSync(draftPath) && fixFile(draftPath)) count += 1

console.log(`Updated ${count} file(s).`)
