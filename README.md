# TPD Axon Weekly Update

Public site for Tucson Police Department Axon program weekly updates, hosted on [GitHub Pages](https://mwesolowski-axon.github.io/tpd-weekly-update/).

## Features

- **Latest update** on the home page
- **Archive** with search and date-range filtering
- **File-based publishing** — edit a markdown draft in Cursor, push to GitHub

## Publishing a new week

See **[content/README.md](content/README.md)** for the full workflow.

**In Cursor chat:** say *Prepare a new week update* → edit the draft → say *Publish*.

Or run manually:

1. `npm run new-week` — copy last week's content into `content/weekly-update.DRAFT.md`
2. Edit the markdown draft
3. `npm run publish-week` — convert to JSON and update `index.json`
4. Commit and push (or ask the agent to publish)

To fix a past week: `npm run edit-week -- --week-of=YYYY-MM-DD`, edit, then publish.

After you push, GitHub Actions rebuilds and deploys the site. New weeks go live when that deploy finishes (usually 1–2 minutes). The repo can be **private**; the GitHub Pages site stays public to anyone with the link.

### Push from Cursor

1. Click the **Source Control** icon in the left sidebar
2. Stage `public/data/updates/*.json` and `public/data/updates/index.json`
3. Enter a commit message (e.g. `Publish weekly update: week of June 29, 2026`)
4. Click **Commit**, then **Sync Changes** / **Push**

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173/tpd-weekly-update/`

## Deploy

Push to `main`. GitHub Actions builds the app (including `public/data/updates/`) and publishes to GitHub Pages.

### Private repository

The site loads update JSON from the deployed Pages bundle, not from `raw.githubusercontent.com`. You can make the repository private while keeping the Pages URL public (requires GitHub Pro, Team, or Enterprise).

## Project structure

```
content/
  weekly-update.DRAFT.md     # Edit this each week
  README.md                  # Publishing instructions
public/data/updates/
  index.json                 # Archive list (newest first)
  YYYY-MM-DD.json            # One file per week
scripts/
  new-week.mjs               # Clone latest → draft
  edit-week.mjs              # Load a past week → draft
  publish-week.mjs           # Draft → public data
src/                         # React site (read-only)
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_BASE_PATH` | Base URL path (default: `/tpd-weekly-update/`) |
