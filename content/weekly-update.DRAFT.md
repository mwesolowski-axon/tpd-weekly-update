---
week-of: 2026-11-06
published-by: mwesolowski@axon.com
---

# Program changes

- Updated the CID form in training.

# Data Store

- No New Update

# Integrations/Conversions

## Warrants

- **Issue:** When a charge is missing from the MCT, the warrant fails out. When the charge is entered and the warrant is reprocessed, it creates a duplicate.
- This is because when the warrant fails out, it is not ingested. Records creates the warrant manually. Engineering notifies us of what charge is missing or incorrect. Once RTU researches the charge specifics, the MCT is updated. Engineering will then reprocess the warrant. When it is, the warrant is not recognized as being ingested from the payload, thus, it sees it as a new one and effectively creates a duplicate in the UI.
- Recommendation: Once the warrant is reprocessed, quash the manually entered one so that if the warrant is ever updated by the court, it will be recognized as being in a payload and update it as the integration intended.
- We will also work with Records and RTU to see what processes we can have in identifying missing charges more quickly versus relying on engineering to send the failures over potentially slowing down the correction process.
- We are also checking to see if and how the integration could accommodate for checking both the payload and for manually entered warrants.



## Tech 5

- No New Update
- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.
- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints.
- Outstanding: Testing for mug shots coming into correct MNI.



## ATF/NESS Import

- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API .
- Update: The "Time to First Shooting" field was tested this week. The field did not populate as expected. More testing is required.



## Standards

- The team agreed to simplify the External Complaint form by removing unused fields and updating its form types, dropdowns, and allegation and discipline behavior.
- Incident ID will represent the department’s case number. The OPS case number will remain, and a separate outside-agency case number field will be added. Identifiers can be entered manually when needed.
- Recommended using the Cases module for investigation status, investigator and supervisor assignments, and deadline tracking, pending confirmation of the 180-day calculation and suspension adjustments.
- Develop a proposed review workflow that reflects the different closure permissions by case type and allows supervisors to review relevant materials without entering investigation data.

