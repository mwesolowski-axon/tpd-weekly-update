# Weekly update draft

Edit **`weekly-update.DRAFT.md`** in this folder, then publish to the site.

## Ask the agent (Cursor)

You can run the whole workflow from chat — no terminal needed:

| Say this | What happens |
|----------|----------------|
| **Prepare a new week update** | Creates a fresh draft from the latest week |
| **Edit the week of June 15** (any date) | Loads that week into the draft for editing |
| **Publish** (after you finish editing) | Converts draft → JSON, commits, and pushes to GitHub |

The agent runs `npm run new-week`, `npm run edit-week`, and `npm run publish-week` for you.

## Format

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

- `#` = main section (Program change, Data store, …)
- `##` = subsection (Warrants, Tech 5, …) — omit when the section has no subsections
- `-` = bullet point (supports **bold**, nested lists with two-space indent)

You never need to manage IDs — the publish script generates those automatically.

## Each new week

### 1. Start from the previous week

```bash
npm run new-week
```

Optional:

```bash
npm run new-week -- --week-of=2026-06-29 --by=your.name@axon.com
```

### 2. Edit the draft

Open `content/weekly-update.DRAFT.md` and update the text. Change `week-of` in the frontmatter to the Monday for that week.

### 3. Publish to the site data

```bash
npm run publish-week
```

This converts the markdown to JSON, writes `public/data/updates/YYYY-MM-DD.json`, and updates `index.json`. The previous week stays in **Archive**; the new week becomes **Latest**.

### 4. Push to GitHub from Cursor

1. Open **Source Control** (branch icon)
2. Stage `public/data/updates/YYYY-MM-DD.json` and `public/data/updates/index.json`
3. Commit, e.g. `Publish weekly update: week of June 29, 2026`
4. **Sync** / **Push**

GitHub Actions rebuilds and deploys the site. Updates go live when the deploy finishes (usually 1–2 minutes).

| Section | Subsections |
|---------|-------------|
| Program change | (flat bullets) |
| Data store | (flat bullets) |
| Integrations/Conversions | Warrants, Tech 5, ATF/NESS Import, … |
| Senzing | (flat bullets) |
