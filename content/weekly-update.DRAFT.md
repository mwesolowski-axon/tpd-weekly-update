---
week-of: 2026-09-14
published-by: alarsh@axon.com
---

# Program changes


- Made multiple changes to the CID Form in Training for SIS and VSC
- Updated Vehicle Status field for NONE to show Recovery Details for the Record Dept in Training 
- SVS has requested to have their own form created and work will begin next week.
# Data store

- No changes.

# Integrations/Conversions

## Warrants

- No New Update - Meeting with Kiet still needs to be scheduled

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

- No New Update - Update to API and testing still in progress

- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API .
  - UPDATE: Axon is working on adding this to the API and coordinating with ATF for testing. 

- **Issue:** There are multiple related cases where the NIBIN LE number only appears once for Tucson, AZ cases. This is currently under investigation.
  - UPDATE: Axon was able to determine that the specific cases that were missing were not in the payload sent from ATF. 

## Standards

- Project team to test out Use of Force with Sgt power users.
- Vehicle Collision almost complete. Finshing next meeting. 
- Following meeting will focus on Vehicle Pursuit. 
- Axon waiting on Customer Complaint fields & dropdown options to incorporate into the form
- Axon waiting on Subject actions and department restraint types for Use of Force form from Sgt Jahnke
- Outstanding questions /decisions needed on the Vehicle Collision form:
  - Should shift information be automatically pulled from Personnel, manually maintained, or preserved in each finalized report? 
  - Should bureau and division values be fixed at the time of the incident or reflect current Personnel data? 
  - Is Chief review required for all vehicle collisions or only certain incidents? 
  - Should Code 3 status be recorded per unit or at the incident level? 
  - What fields must be required before an author can submit the report? 
  - What fields are in the legacy system that need to be entered into the Use of Force and Vehicle Collision form for data migration purposes?


# MNI Deduplication (Senzing):

- **Status:** 

- **UPDATE:** Decision Makers (Derrick, Luis and Molly) have determined as of Sept 24 that the 24K MNIS that were not successfully de-duped are good to leave as is and will be tackled by the Department over time.
- Approximately 95% of the MNI deduplication work has been completed, with roughly 430K MNIs successfully processed. Approximately 24K MNIs remain unmerged in the UI.

- An updated review workbook was provided to help the Agency evaluate the remaining exceptions. The workbook includes searchable Person IDs, associated Draft, In Progress, or Records Review report numbers, and confirmation of whether each Person is active in Axon.

- The remaining failures are categorized as:
  - Duplicate Person not found as an active record
  - Primary Person not found as an active record
  - Duplicate Person already associated with a different surviving MNI than the one identified by Senzing

- Once the review is returned, Axon will clean up the remaining exceptions and perform one final automated MNI deduplication run.
