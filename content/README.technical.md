# Weekly update: technical reference

## Files

| File | Purpose |
|------|---------|
| `content/weekly-update.DRAFT.md` | Working draft (edit this) |
| `public/data/updates/YYYY-MM-DD.json` | Published week (generated) |
| `public/data/updates/index.json` | Archive list (generated) |

## Cursor agent commands

| Say this | Action |
|----------|--------|
| **Prepare a new week update** | `npm run new-week` |
| **Edit the week of June 15** (any date) | `npm run edit-week -- --week-of=YYYY-MM-DD` |
| **Publish** | `npm run publish-week`, then commit and push |

## Markdown format

```markdown
---
week-of: 2026-06-22
published-by: mwesolowski@axon.com
---

# Section name

- First bullet
- Second bullet with **bold**

# Section with subsections

## Subsection name

- Bullet text
  - Nested sub-bullet
  - Another sub-bullet
```

- `#` = main section
- `##` = subsection (omit when the section has no subsections)
- `-` = bullet (**bold**, nested lists with two-space indent)
- IDs are generated automatically on publish

## Scripts

### New week

```bash
npm run new-week
```

Optional:

```bash
npm run new-week -- --week-of=2026-06-29 --by=your.name@axon.com
```

Copies the latest week into `content/weekly-update.DRAFT.md`.

### Edit existing week

```bash
npm run edit-week -- --week-of=2026-06-15
```

Run without `--week-of` to list available dates.

### Publish

```bash
npm run publish-week
```

Converts the draft to JSON, writes `public/data/updates/{week-of}.json`, and updates `index.json`.

## Push to GitHub

1. **Source Control** in Cursor
2. Stage `public/data/updates/{week-of}.json` and `public/data/updates/index.json` (and the draft if it changed)
3. Commit, e.g. `Publish weekly update: week of June 29, 2026`
4. **Sync** / **Push**

GitHub Actions rebuilds and deploys. Updates go live when the deploy finishes (usually 1–2 minutes).

## Deploy and private repo

Content is bundled into the GitHub Pages build (`public/data/` is copied to `dist/data/`). The live site loads JSON from the deployed URL, not from `raw.githubusercontent.com`, so the repository can be private while the Pages site stays public (GitHub Pro, Team, or Enterprise).

## Related scripts

| Script | Purpose |
|--------|---------|
| `scripts/new-week.mjs` | Clone latest week to draft |
| `scripts/edit-week.mjs` | Load a past week into draft |
| `scripts/publish-week.mjs` | Draft to JSON |
| `scripts/markdown-week.mjs` | Markdown parser |
| `scripts/replace-em-dashes.mjs` | Em dash cleanup rules |
| `scripts/fix-em-dashes.mjs` | Bulk em dash fix for JSON files |
