---
week-of: 2026-10-16
published-by: alarsh@axon.com
---

# Program changes

- Turned Audit Trail Dashboard off in Production to be able to use the older audit trail version. Left on in Training. 
- 14 Charge additions and 1 UCR addition to the MCT in both Training and Production.
- Permissioned ISB Detectives and PSI to utilize AI Search in Training and Production. 

# Data Store
- An incident happened on Thurs, Oct 15 that affected the V1 tables. Root cause was identified and engineering began mitigation immediately. 

- TPD glue jobs and integrations ran successfully Friday, Oct 16. 

# Integrations/Conversions

## Warrants

- **Issue:** Failure to Appear charges not in payload
  - Update: Molly made the decision to NOT have Kiet remove the restriction in the query due to the unknown impacts to warrants. As of now, we are leaving as is and the Records team will manually enter the Failure to Appear from the Prosecutors office. 

## Tech 5

- No New Update

- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.

- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints.

- Outstanding: Testing for mug shots coming into correct MNI.

## ATF/NESS Import

- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API .

  - Update: The "Time to First Shooting" field was added to the form in Training for testing. 

  - ATF will have TTFS available in their endpoint on Oct 22 for testing.

## Standards

- Continued work on the Customer Complaint form.

- Identified 2 additional forms that OPS needs created. 

- OPS to send the form information to Axon for creation. We will also look to see if the info can be incorporated into existing forms. 

- Next week, we meet on Tues and Thurs again. 
