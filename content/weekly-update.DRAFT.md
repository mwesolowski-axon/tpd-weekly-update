---
week-of: 2026-08-17
published-by: mwesolowski@axon.com
---

# Program changes

- Mirrored all Permission Teams to match between Training and Production in preparation for Command Hierarchy and Standards

## Training

- Permissions provisioned in Training for Standards

# Data store

- No changes

# Integrations/Conversions

## Warrants

- **Integration Ticket entered for issues below**

- **Issue:** A warrant did not reactivate despite having the same docket number and subject. Still investigating.
  - Certain charges coming in incorrectly.
    - This is partly due to the payload. The payload has the charge id and part of the charge description. It does not include the severity.
    - The integration picks an active charge on the MCT with the closest match to what is in the payload. Continuing to investigate.
- **Workaround:** Records specialist updates warrant to correct charge

---

- **Issue:** Warrant charges duplicating on the warrant form in the UI 
  - This is due to duplicate charges within the payload 
  - Agency has reached out to the court POC about this with examples to get the issue investigated
- **Workaround:** Records team to remove the duplicate charges in the UI so they match the physical warrant

## Tech 5

- No New Update
- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.
- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints
- Outstanding: Testing for mug shots coming into correct MNI

## ATF/NESS Import

- P and dash fix was implemented .
- Change scheduled for next week to make this work retroactively.

## Standards

- Kick-off meeting happened on Tuesday 8/18.
- Discovery meeting scheduled for Tuesday 8/25

# MNI Deduplication (Senzing):

- Completed approximately 95% of the MNI dedupe work, successfully processing roughly 430K MNIs. There are approximately 24K MNIs that have not yet been merged in the UI.
- At a high level, the remaining records appear to fall into a couple of scenarios:
  - Some MNIs were already been merged into a different primary GUID than the one identified in the Senzing output
  - Some of the primary or duplicate GUIDs are associated with reports that are still In Progress or in Records Review, which may prevent the merge from completing.

