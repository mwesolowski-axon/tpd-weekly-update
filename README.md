# TPD Axon Weekly Update

A static website for Tucson Police Department Axon program weekly updates.

## Features

- **Latest update** displayed prominently on the home page
- **Archive** with search and date-range filtering across all historical updates
- **Admin panel** for allowlisted Axon users to create and edit updates
- **Structured editor** with sections, subsections, and rich-text bullets (TipTap)
- **Clone from previous week** when creating a new update

## Local development

Run both the web app and API (in separate terminals, or use `npm run dev:all`):

```bash
npm install
cp .env.example .env.local   # then edit .env.local
npm run dev:all
```

Open `http://localhost:5173/tpd-weekly-update/`.

### Local admin setup

Admin uses **Axon SSO** (same pattern as tam-tools-hip): the API reads identity from `x-amzn-oidc-data` in production, or `DEV_USER_EMAIL` locally.

1. Copy `.env.example` to `.env.local`
2. Set `DEV_USER_EMAIL` to your `@axon.com` address
3. Set `GITHUB_TOKEN` to a PAT with **Contents: Read and write** on the repo
4. Set `GITHUB_REPO` and `VITE_GITHUB_REPO` to `owner/repo`
5. Add your email to `public/data/admin-allowlist.json`
6. Run `npm run dev:all`

To regenerate seed data from the email chain:

```bash
npm run seed
```

## Deployment

The **static site** can be hosted on GitHub Pages or Cortex Pages. The **admin API** (`server/`) must run behind Axon SSO (ALB + Okta) with `GITHUB_TOKEN` set server-side for saves.

### GitHub Pages (public site)

1. Push to `main` — the deploy workflow builds and publishes the SPA.
2. Set repository variable `VITE_GITHUB_REPO` if needed (Actions sets it from `github.repository`).
3. Edit `public/data/admin-allowlist.json` for authorized editors.

### Admin API

Deploy `server/` as a small Node service behind the same ALB as the site. Required env:

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | PAT for committing update JSON files |
| `GITHUB_REPO` | `owner/repo` |
| `GITHUB_BRANCH` | Branch for content (default: `main`) |

Identity comes from ALB `x-amzn-oidc-data` automatically — no OAuth app or device flow.

## Admin usage

1. Visit `/admin` while signed in through Axon SSO.
2. Click **Create New Update** to clone the latest week's structure.
3. Edit sections, subsections, and bullets using the rich-text toolbar.
4. Click **Publish** to save to the repository.

Published updates are fetched at runtime from `raw.githubusercontent.com`, so new content appears without redeploying the site.

## Project structure

```
public/data/
  admin-allowlist.json    # Axon emails with edit access
  updates/
    index.json            # Metadata for all weeks
    YYYY-MM-DD.json       # One file per week
server/                   # Admin API (SSO identity + GitHub saves)
src/
  pages/                  # Home, Archive, Update detail, Admin
  components/             # Renderer, editor, layout
  lib/                    # Content fetch, auth, types
```

## Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_BASE_PATH` | Web | Base URL path (default: `/tpd-weekly-update/`) |
| `VITE_GITHUB_REPO` | Web | `owner/repo` for raw content URLs |
| `VITE_GITHUB_BRANCH` | Web | Branch for content files (default: `main`) |
| `VITE_DEV_USER_EMAIL` | Web | Optional dev-only identity fallback |
| `DEV_USER_EMAIL` | API | Local dev identity |
| `GITHUB_REPO` | API | `owner/repo` for API saves |
| `GITHUB_TOKEN` | API | PAT for Contents API writes |
