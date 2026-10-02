---
week-of: 2026-09-28
published-by: mwesolowski@axon.com
---

# Program changes

- Change location of case factor so the Use of Force shows in search case factors

- Updated Validation rule for Vehicle ROLE / TWX Notified field and Recover Details section visibility

# Data Store

- Turned on Standards Data Store access in Training for both Admin and Analysis Team. Turned it on for the Analysis Team in Production.  

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
- Project team to continue testing Use of Force with SGT power users.

- Customer Complaint form meeting scheduled.

- Pending Subject actions and department restraint types for the Use of Force form.

- Department plans to use the Personnel module, with supervisors maintaining officer information.

- Department will use Trends. 
  - TASER 7 option is not needed.

- Outstanding questions / decisions needed:
  - What fields must be required before submitting the forms?
  - What legacy fields are needed for data migration?
  - What are the final review roles and workflows?
  - How should officer demographics and offense information be captured?

- Project team to test out Use of Force with Sgt power users.

- Vehicle Collision almost complete. Finishing next meeting.

- Following meeting will focus on Vehicle Pursuit.

- Axon waiting on Customer Complaint fields & dropdown options to incorporate into the form

- Axon waiting on Subject actions and department restraint types for Use of Force form from Sgt Jahnke


# MNI Deduplication (Senzing):

- **UPDATE:** Decision Makers (Derrick, Luis and Molly) have determined as of Sept 24 that the 24K MNIS that were not successfully de-duped are good to leave as is and will be tackled by the Department over time.

