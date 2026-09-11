---
week-of: 2026-09-07
published-by: mwesolowski@axon.com
---

# Program changes

- Multiple changes to Training Incident Report json to replicate Production version.

- Disabled Warrant Import feature in an Incident Report.

# Data store

- No changes.

# Integrations/Conversions

## Warrants

- No New Update

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

- No New Update

- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API .
  - This is being investigated.

- **Issue:** There are multiple related cases where the NIBIN LE number only appears once for Tucson, AZ cases. This is currently under investigation.

## Standards

- No New Update

- Weekly meetings planned for Tuesdays

# MNI Deduplication (Senzing):

- **Status:** Customer review is needed for the remaining MNI deduplication exceptions.

- Approximately 95% of the MNI deduplication work has been completed, with roughly 430K MNIs successfully processed. Approximately 24K MNIs remain unmerged in the UI.

- An updated review workbook was provided to help the customer evaluate the remaining exceptions. The workbook includes searchable Person IDs, associated Draft, In Progress, or Records Review report numbers, and confirmation of whether each Person is active in Axon.

- The remaining failures are categorized as:
  - Duplicate Person not found as an active record
  - Primary Person not found as an active record
  - Duplicate Person already associated with a different surviving MNI than the one identified by Senzing

- Once the review is returned, Axon will clean up the remaining exceptions and perform one final automated MNI deduplication run.