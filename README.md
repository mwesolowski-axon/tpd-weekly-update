# TPD Axon Weekly Update

Public site for Tucson Police Department Axon program weekly updates, hosted on [GitHub Pages](https://mwesolowski-axon.github.io/tpd-weekly-update/).

## Features

- **Latest update** on the home page
- **Archive** with search and date-range filtering
- **File-based publishing** — edit a markdown draft in Cursor, push to GitHub

## Publishing a new week

See **[content/README.md](content/README.md)** for step-by-step instructions.

Technical details: **[content/README.technical.md](content/README.technical.md)**.

**In Cursor chat:** say *Prepare a new week update* → edit the draft → say *Publish*.

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
  README.md                  # Publishing instructions (non-technical)
  README.technical.md        # Scripts, markdown, git, deploy
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
