---
week-of: 2026-10-23
published-by: mwesolowski@axon.com
---

# Program changes

- Update the TWX Notified field to be visible based on Vehicle Involvement Role versus the Vehicle Status field. 
- Offense field stays visible when Focus Officer - PRCIT is selected. 
- Medical field stays visible when Focus Officer - PRCIT is selected.
- 13-1805 (M) SHOPLIFTING added to MCT

# Data Store

- No New Update

# Integrations/Conversions

## Warrants

- **Issue:** Failure to Appear charges not in payload
  - Update: Molly made the decision to NOT have Kiet remove the restriction in the query due to the unknown impacts to warrants. As of now, we are leaving as is and the Records team will manually enter the Failure to Appear from the Prosecutor's office.



## Tech 5

- No New Update
- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.
- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints.
- Outstanding: Testing for mug shots coming into correct MNI.



## ATF/NESS Import

- No New Update
- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API .
- Update: The "Time to First Shooting" field was added to the form in Training for testing.
- ATF will have TTFS available in their endpoint on Oct 22 for testing.



## Standards

- Finalized proposed updates for the Vehicle Pursuit, Vehicle Collision, and Use of Force forms.
- Aligned on using a standardized case document as the primary running log for OPS investigations.
- Reviewed OPS permissions, analytics, terminology, and public-records redaction requirements.
- Next step is to test case documents versus case tasks before finalizing the workflow.

