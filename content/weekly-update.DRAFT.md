---
week-of: 2026-07-20
published-by: mwesolowski@axon.com
---

# Program changes

## Motor Vehicle Fatality Form

- New feedback identified several changes needed:
  - Add collision options included in the latest tracking spreadsheet, such as Vehicle vs. Bicycle.
  - Add an Unknown option to several fields.
  - Support multiple involved people, such as multiple deceased or at-fault parties.

# Data store

- Axon Analytics and Data Store training
- Follow-up resources were provided:
  - [MyAxon Records Datastore v2 Guide](https://my.axon.com/s/records#axon-datastore)
  - [Axon DataStore v2 Introduction](https://my.axon.com/s/article/Axon-DataStore-v2-introduction-Axon-Records?language=en_US)
  - [Concepts in DataStore v2](https://my.axon.com/s/article/Concepts-in-DataStore-v2-Axon-Records?language=en_US)
  - [Additional DataStore v2 features](https://my.axon.com/s/article/Additional-DataStore-v2-features-Axon-Records?language=en_US)
  - [Joining in DataStore v2](https://my.axon.com/s/article/Joining-in-DataStore-v2-Axon-Records?language=en_US)
- Analytics resources
  - [Analytics Administration - Axon Records](https://my.axon.com/s/article/Analytics-Administration-Axon-Records?language=en_US)
  - [Analytics Privileges - Axon Records](https://my.axon.com/s/article/Analytics-Privileges-Axon-Records?language=en_US)
  - [Analytics Dashboard Management](https://www.axon.com/help/axon-records/software/rms/analytics/dashboard-management.htm)
  - [Analytics OOTB Dashboards](https://www.axon.com/help/axon-records/software/rms/analytics/dashboards.htm)

# Integrations/Conversions

## Warrants

- **Issues:** Integration Ticket entered for issues below
  - A warrant did not reactivate despite having the same docket number and subject. Differences included the case-number format and the incoming felony charge versus the corrected misdemeanor charge on the existing warrant.
  - Certain charges coming as the correct charge but with DV incorrectly
  - Shoplifting charges coming in as felony version instead of misdemeanor
  - 13-1203A1(M1)(DV) coming in as 13-1203A1 (M2)
- **Workaround:** Records specialist updates warrant to correct charge

## Tech 5

- Export to Axon disabled
  - On July 23, Tech 5 confirmed that the export to Axon had been disabled in its configuration. 
  - This stops Tech 5 from sending data to the Axon Records API while the agency is not live with the integration.
- Outstanding: Tech 5 change in endpoint configuration: we export to Tech 5.
- Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints
- Outstanding: Testing for mug shots coming into correct MNI

## ATF/NESS Import

- Feedback meeting scheduled for Monday, July 27 (2:30pm)

# MNI Deduplication (Senzing):

- No new update
  - Approval received

