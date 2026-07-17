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
| **Publish** | `npm run publish-week` (opens Outlook + Gmail drafts), then commit and push |

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


## Email drafts

After publish, `publish-week.mjs` opens draft emails using settings from `.env` in the project root:

| Variable | Purpose |
|----------|---------|
| `EMAIL_TO` | Semicolon-separated `Name <email>` recipients |
| `EMAIL_CC` | CC recipients (same format) |
| `EMAIL_SUBJECT` | Subject line; `{weekOf}` is replaced with formatted date |
| `SITE_URL` | Base URL for the "View online" link in the email body |
| `EMAIL_CLIENT` | Which draft to open: `outlook`, `gmail`, or `both` (default `both`) |
| `EMAIL_GMAIL_INBOX` | Gmail account index for compose URL (`0` = first inbox, `1` = second, etc.) |

**Outlook:** full HTML body via COM automation (`scripts/open-outlook-draft.ps1`).

**Gmail:** compose URL with To/CC/subject; formatted HTML copied to clipboard (paste with Ctrl+V).

Skip email drafts: `npm run publish-week -- --no-email`
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

Converts the draft to JSON, writes `public/data/updates/{week-of}.json`, updates `index.json`, and opens Outlook + Gmail drafts.

## Push to GitHub

1. **Source Control** in Cursor
2. Stage `public/data/updates/{week-of}.json` and `public/data/updates/index.json` (and the draft if it changed)
3. Commit, e.g. `Publish weekly update: week of June 29, 2026`
4. **Sync** / **Push**

GitHub Actions rebuilds and deploys. Updates go live when the deploy finishes (usually 1â€“2 minutes).

## Deploy and private repo

Content is bundled into the GitHub Pages build (`public/data/` is copied to `dist/data/`). The live site loads JSON from the deployed URL, not from `raw.githubusercontent.com`, so the repository can be private while the Pages site stays public (GitHub Pro, Team, or Enterprise).

## Related scripts

| Script | Purpose |
|--------|---------|
| `scripts/new-week.mjs` | Clone latest week to draft |
| `scripts/edit-week.mjs` | Load a past week into draft |
| `scripts/publish-week.mjs` | Draft to JSON + open email drafts |
| `scripts/markdown-week.mjs` | Markdown parser |
| `scripts/replace-em-dashes.mjs` | Em dash cleanup rules |
| `scripts/fix-em-dashes.mjs` | Bulk em dash fix for JSON files |

