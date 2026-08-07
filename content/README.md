# Weekly update instructions

This folder holds the working draft for each week's Axon update. You do not need to use the terminal or know how the site is built.

## First time setup

If you are new to this project, do this once before your first week:

1. **Open the repo in Cursor** — open the `tpd-weekly-update` folder (not the parent folder).
2. **Install dependencies** — in Cursor chat, say: **Run npm install** (or run it yourself in the terminal).
3. **Check GitHub access** — you need permission to push to the repo, or **Publish** will not update the live site.
4. **Use Agent mode** — in Cursor chat, switch to Agent mode so the assistant can run scripts and push for you.

Email recipients are already configured in **`.env`** at the project root. You can skip this unless you need to change who receives the weekly email.

## Create a new week

1. In **Cursor chat**, say: **Prepare a new week update**
   - The agent **pulls the latest from GitHub** first, then creates the draft from the most recent published week.
2. Open **`weekly-update.DRAFT.md`** in this folder and edit the text for the new week.
3. Check the **week-of** date at the top is the Monday for that week (the agent sets this automatically).
4. When you are done, say: **Publish**

The site updates after the publish step finishes (usually within a couple of minutes).

## Fix or change a past week

1. In **Cursor chat**, say: **Edit the week of June 15, 2026** (use the date you need).
   - The agent pulls the latest from GitHub before loading that week into the draft.
2. Edit **`weekly-update.DRAFT.md`** with your changes.
3. Say: **Publish**

## What to edit in the draft

The draft is a simple text file organized like the live updates:

- **Section headings** (Program change, Data store, Integrations/Conversions, Senzing, and so on)
- **Bullet points** under each section
- **Subsections** under Integrations/Conversions (Warrants, Tech 5, ATF/NESS Import, etc.)

Use a new bullet for each item. You can use **bold** for labels like **Issues:** or **Workaround:**.

Typical sections each week:

| Section | Subsections |
|---------|-------------|
| Program change | (bullets only) |
| Data store | (bullets only) |
| Integrations/Conversions | Warrants, Tech 5, ATF/NESS Import, … |
| Senzing | (bullets only) |

Copy the structure from the previous week and change only what is new.

## Tips

- Set **published-by** at the top of the draft to your email if you are the author.
- If a section has no news, keep a bullet such as "No changes".
- Nested bullets (sub-items under a main bullet) are indented with two spaces in the draft file.


## Email draft on publish

When you say **Publish**, a draft email is also opened with the week's content:

- **Outlook** opens with To, CC, subject, and formatted HTML body (including a link to the live update).
- **Gmail** opens in your browser with To, CC, and subject; formatted HTML is copied to your clipboard — paste with **Ctrl+V**.

Set **`EMAIL_CLIENT`** in **`.env`** to `outlook`, `gmail`, or `both` (default) to control which client opens.

Recipients are configured in **`.env`** at the project root (already set up for the TPD distribution list). Edit that file if recipients change.

For markdown syntax, scripts, and git details, see **[README.technical.md](README.technical.md)**.
