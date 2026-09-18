---
week-of: 2026-09-14
published-by: alarsh@axon.com
---

# Program changes


- Enabled Warrant Import feature in an Incident Report in Training
- Updated Training Incident Schema with the import warrant JSON
- Made changes to the CID form in Training / notified LASO of the changes
- Archived multiple draft forms in Training to match Production 
- Enabled ability to move charges to previous reports in Training (new Preview feature in Sept release)
- Enabled BOLO module in Training (new Preview feature)

# Data store

- No changes.

# Integrations/Conversions

## Warrants

- **Issue:** Warrant charges duplicating on the warrant form in the UI.
  - UPDATE: Duplicate charges are no longer appearing in the payload and is resolved.

- **Issue:** Failure to Appear charges not in payload 
  - UPDATE: Kiet was able to determine this is because the Prosecutor's office creates a new citation for it and the file has a restriction not to pull these.
  - Another meeting will be scheduled to discuss pros and cons of removing this restriction in the court's query. 

## Tech 5

- No New Update

- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.

- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints.

- Outstanding: Testing for mug shots coming into correct MNI.

## ATF/NESS Import


- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API .
  - UPDATE: Axon is working on adding this to the API and coordinating with ATF for testing. 

- **Issue:** There are multiple related cases where the NIBIN LE number only appears once for Tucson, AZ cases. This is currently under investigation.
  - UPDATE: Axon was able to determine that the specific cases that were missing were not in the payload sent from ATF. 

## Standards

- Use of Force form review completed. 
- Next meeting will focus on Vehicle Collision. 

# MNI Deduplication (Senzing):

- **Status:** NO NEW UPDATE: Agency review still in progress.

- Approximately 95% of the MNI deduplication work has been completed, with roughly 430K MNIs successfully processed. Approximately 24K MNIs remain unmerged in the UI.

- An updated review workbook was provided to help the Agency evaluate the remaining exceptions. The workbook includes searchable Person IDs, associated Draft, In Progress, or Records Review report numbers, and confirmation of whether each Person is active in Axon.

- The remaining failures are categorized as:
  - Duplicate Person not found as an active record
  - Primary Person not found as an active record
  - Duplicate Person already associated with a different surviving MNI than the one identified by Senzing

- Once the review is returned, Axon will clean up the remaining exceptions and perform one final automated MNI deduplication run.
