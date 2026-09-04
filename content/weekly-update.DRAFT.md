---
week-of: 2026-08-31
published-by: alarsh@axon.com
---

# Program changes

- Removed Blue Team Case factor in Training and replaced it with Use of Force (Type 1,2,3,4) case factors.

- Reviewing of all permissions for team members to match between Training and Production continued.

# Data store

- No changes.

# Integrations/Conversions

## Warrants

- **Integration Ticket entered for issues below**

- **Issue:** A warrant did not reactivate despite having the same docket number and subject. Still investigating.
  - Certain charges coming in incorrectly.
  - This is partly due to the payload. The payload has the charge id and part of the charge description. It does not include the severity.
  - The integration picks an active charge on the MCT with the closest match to what is in the payload. Continuing to investigate.

- **Workaround:** Records specialist updates warrant to correct charge.

- **Status:** Warrant duplicates are still being sent to Kiet as examples.
  - This issue is still being investigated by the courts.

- **Issue:** Warrant charges duplicating on the warrant form in the UI.
  - This is due to duplicate charges within the payload.
  - Agency has reached out to the court POC about this with examples to get the issue investigated.

- **Workaround:** Records team to remove the duplicate charges in the UI so they match the physical warrant.

## Tech 5 
- No New Update 
- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.

- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints.

- Outstanding: Testing for mug shots coming into correct MNI.

## ATF/NESS Import

- **Update:** ATF received permission to add in the &quot;Time To First Shooting&quot; field in the API .
  - This is being investigated.

- **Status:** Reprocessing of files to add retroactive functionality completed.

- **Issue:** There are multiple related cases where the NIBIN LE number only appears once for Tucson, AZ cases. This is currently under investigation.

## Standards

- Discovery meeting occurred for Tuesday 8/25

- Weekly meetings planned for Tuesdays

# MNI Deduplication (Senzing):

- **Update:** Remaining records with errors are being analyzed.

- Completed approximately 95% of the MNI dedupe work, successfully processing roughly 430K MNIs. There are approximately 24K MNIs that have not yet been merged in the UI.

- At a high level, the remaining records appear to fall into a couple of scenarios:
  - Some MNIs were already merged into a different primary GUID than the one identified in the Senzing output
  - Some of the primary or duplicate GUIDs are associated with reports that are still In Progress or in Records Review, which may prevent the merge from completing.
