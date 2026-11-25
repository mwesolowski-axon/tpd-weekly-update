---
week-of: 2026-11-27
published-by: alarsh@axon.com
---

# Program changes

- Implemented Cause of Death options to the Child Fatality Form in Training (still being tested).

- Several Cold Case form changes completed and being reviewed in Training.

- Made Recovered Date and Time fields required when the role of a Vehicle is selected as "Recovered Outside Agency Stolen".

- Combined 6 routing rules together as the program can now have multiple UCRs routed to a district on the same rule. Testing on Rule 335 for UCRs 5503, 5504, 5505, 5506, 5507 in both Training and Production. Rule combination will be staggered over the next several weeks to watch for any routing failures.

- Alpha testing Flag Permissions in Training.

# Data Store

- Field-level mapping for the agency’s Data Store V1 to V2 migration is complete.

- Luis is reviewing the information.

- After rewview, next steps will be in scheduling moving V2 views / tables into Snowflake.

# Integrations/Conversions

## Warrants

- After testing the new process for when Warrants fail and are not ingested, Records has decided to go back to entering manually on the day received. Once the charges are identified, updated and the warrants reprocessed, Records will quash the manually entered one.

## Tech 5

- Removing Tech 5 going forward. We will bring back when needed.

## ATF/NESS Import

- **Status:** ATF received permission to add in the "Time To First Shooting" field in the API.

- Update: The "Time to First Shooting" field is further being looked into by Engineering.

## Standards

- Use of Force form completed.

- Testing has begun for the Civilian Compliant.

- Administrative Inspection form is being reviewed.

- Once final signoff on the forms are received, we will begin data migration conversations.

- We have requested testing scenarios from the project team for User Acceptance Testing (UAT).

- We will begin to move on to permissions and workflows.

- We are looking at scheduling UAT for the second week of December.

- We also will be starting to discuss Training plans for Jan.
