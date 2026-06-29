---
week-of: 2026-06-22
published-by: mwesolowski@axon.com
---

# Program change

- Updated Patrol, Investigations and Records permissions to be able to view ATF Crime Gun form

- Granted Brandon Wahl Fusus permissions — Brandon assisting in troubleshooting Verkada LPR integration

- Wilson Lindelof — NIBRS UCR Engineer — Training access for NIBRS troubleshooting

# Data store

- No changes

# Integrations/Conversions

## Warrants

- **Issues:** Integration Ticket entered for issues below
  - Certain charges coming as the correct charge but with DV incorrectly
  - Shoplifting charges coming in as felony version instead of misdemeanor
  - 13-1203A1(M1)(DV) coming in as 13-1203A1 (M2)

- **Workaround:** Records specialist updates warrant to correct charge

## Tech 5

- No New Update

- Luis scheduling meeting with AFIS Leadership to discuss process changes
  - Outstanding: Tech 5 change in endpoint configuration — we export to Tech 5.
  - Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints
  - Outstanding: Testing for mug shots coming into correct MNI

## ATF/NESS Import

- Production test ran Tues, June 16

- All historical Crime Guns were ingested successfully the same day.

- TPD to validate and notify Axon of any issues found.

# Senzing

- TPD reviewed the test subset before loading into Production Tues, June 16

- MNI Subset loaded into Production Thurs, June 18

- TPD review completing review before Mon, June 22
