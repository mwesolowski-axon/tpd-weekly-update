---
week-of: 2026-08-03
published-by: mwesolowski@axon.com
---

# Program changes

## Training
- Expanded permissions for AI Search testing. 

## Production
- Created RAJ Unaccompanied Minors inbox.

# Data store
- No changes

# Integrations/Conversions

## Warrants

- **Issues:** Integration Ticket entered for issues below
  - A warrant did not reactivate despite having the same docket number and subject. Still investigating.
  
  - Certain charges coming in incorrectly.
  
  - This is partly due to the payload. The payload has the charge id and part of the charge description. It does not include the severity.
  
  - The integration picks an active charge on the MCT with the closet match to what is in the payload. Continuing to investigate.

- **Workaround:** Records specialist updates warrant to correct charge

## Tech 5

- No New Update

- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.

- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints

- Outstanding: Testing for mug shots coming into correct MNI

## ATF/NESS Import

- No New Update

- Axon engineering working on changing formatting of the NIBIN LE Case number removing the dashes and entering a P at the beignning.

- If the NIBIN LE number is not available, then the LAB Case ID will be used.

- Changes will be completed in this this or the next engineering sprints.

# MNI Deduplication (Senzing):

- File divided into smaller chunks for processing/ingestion. 

- 15 of 16 chunks complete.

- Audit of completed chunks underway.