# Weekly update instructions

This folder holds the working draft for each week's Axon update. You do not need to use the terminal or know how the site is built.

## Create a new week

1. In **Cursor chat**, say: **Prepare a new week update**
2. Open **`weekly-update.DRAFT.md`** in this folder (the agent creates or refreshes it from last week).
3. Edit the text for the new week. Update the **week-of** date at the top to the Monday for that week.
4. When you are done, say: **Publish**

The site updates after the publish step finishes (usually within a couple of minutes).

## Fix or change a past week

1. In **Cursor chat**, say: **Edit the week of June 15, 2026** (use the date you need).
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

For markdown syntax, scripts, and git details, see **[README.technical.md](README.technical.md)**.
