import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const updatesDir = path.join(root, 'public', 'data', 'updates')
const dataDir = path.join(root, 'public', 'data')

const p = (t) => `<p>${t}</p>`
const b = (content) => ({ id: crypto.randomUUID(), content })
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`

const ss = (title, bullets) => ({
  id: crypto.randomUUID(),
  title,
  bullets: bullets.map((item) => {
    if (typeof item === 'string') {
      return b(item.startsWith('<') ? item : p(item))
    }
    return b(item)
  }),
})

const flat = (...bullets) => ss('', bullets)

const section = (title, subsections) => ({
  id: crypto.randomUUID(),
  title,
  subsections,
})

function formatWeekOf(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function makeUpdate({ weekOf, publishedAt, publishedBy, sections }) {
  return {
    id: weekOf,
    weekOf,
    title: `Axon Weekly Update — Week of ${formatWeekOf(weekOf)}`,
    publishedAt: publishedAt.includes('T') ? publishedAt : `${publishedAt}T17:00:00Z`,
    publishedBy,
    sections,
  }
}

const WARRANTS_ISSUES = `<p><strong>Issues:</strong> Integration Ticket entered for issues below</p>${ul([
  'Certain charges coming as the correct charge but with DV incorrectly',
  'Shoplifting charges coming in as felony version instead of misdemeanor',
  '13-1203A1(M1)(DV) coming in as 13-1203A1 (M2)',
])}`

const WARRANTS_WORKAROUND =
  '<p><strong>Workaround:</strong> Records specialist updates warrant to correct charge</p>'

const TECH5_STANDARD = [
  p('No New Update'),
  `<p>Luis scheduling meeting with AFIS Leadership to discuss process changes</p>${ul([
    'Outstanding: Tech 5 change in endpoint configuration — we export to Tech 5.',
    'Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints',
    'Outstanding: Testing for mug shots coming into correct MNI',
  ])}`,
]

const TECH5_OUTSTANDING_ONLY = [
  'Outstanding: Tech 5 change in endpoint configuration — we export to Tech 5.',
  'Outstanding: Pending on confirmation Tech 5 only sends offenders and not civilian fingerprints',
  'Outstanding: Testing for mug shots coming into correct MNI',
]

const TECH5_MAR23 = [
  'Outstanding — Live review of workflow process when exporting — assist in diagnosis of missing fields sent to Tech 5',
  'Anna to send email to Tech 5 about excluding all but offenders in te MNIs import',
  'Jason D to send detailed email from last week',
]

const ATF_REF_MAR6 = [
  'Engineering still on track for March 31st',
  'Meeting with TPD / Axon / ATF to be set first week of April',
]

const DATA_CONV_GROUPS = [
  'Group A',
  'Group C',
  'Group D',
  'Group E',
]

const updates = [
  makeUpdate({
    weekOf: '2026-06-15',
    publishedAt: '2026-06-18T22:28:00Z',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Updated Patrol, Investigations and Records permissions to be able to view ATF Crime Gun form',
          'Granted Brandon Wahl Fusus permissions — Brandon assisting in troubleshooting Verkada LPR integration',
          'Wilson Lindelof — NIBRS UCR Engineer — Training access for NIBRS troubleshooting',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations/Conversions', [
        ss('Warrants', [WARRANTS_ISSUES, WARRANTS_WORKAROUND]),
        ss('Tech 5', TECH5_STANDARD),
        ss('ATF/NESS Import', [
          'Production test ran Tues, June 16',
          'All historical Crime Guns were ingested successfully the same day.',
          'TPD to validate and notify Axon of any issues found.',
        ]),
      ]),
      section('Senzing', [
        flat(
          'TPD reviewed the test subset before loading into Production Tues, June 16',
          'MNI Subset loaded into Production Thurs, June 18',
          'TPD review completing review before Mon, June 22',
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-06-08',
    publishedAt: '2026-06-12',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Turned on updated Master Charge Table tool',
          'Updated TC20-501A charge description to match Pima County Court',
          'RTA updated 4 additional charges',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations/Conversions', [
        ss('Warrants', [WARRANTS_ISSUES, WARRANTS_WORKAROUND]),
        ss('Area Restrictions', ['Completed']),
        ss('Tech 5', TECH5_STANDARD),
        ss('ATF/NESS Import', [
          'ATF/TPD and Axon meet on Thurs, June 11',
          `<p>Issue: ATF models data around the LE Case ID and not the Gun Crime ID.</p>`,
          `<p><strong>Resolution Complete:</strong> ATF changed API feed model to link to Crime Gun.</p>`,
          'TPD validation complete — no issues found',
          'Production test to be done and validated on Tues, June 16',
          'If successful, will load all historical Crime Guns for TPD Tuesday.',
        ]),
      ]),
      section('Senzing', [
        flat(
          'Training test loaded on Wed, June 10',
          'Subset provided for validation is from Production',
          `<p><strong>Needed:</strong> TPD approval to load test subset into Production for Records validation</p>${ul(['If test is unsuccessful, MNIs can be unmerged'])}`,
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-06-01',
    publishedAt: '2026-06-05',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Added additional filters ( including Alias filter) to the Warrants Module in Agency Court Papers section',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations/Conversions', [
        ss('Warrants', [
          `<p><strong>Issue:</strong> Some charges missing in Axon from the warrants that are on the paper warrants — Ex: TC21</p>${ul([
            'Harrison was able to determine that the city codes are not coming over in the payload',
            'Need a TPD contact to reach out to the Court to discuss',
          ])}`,
        ]),
        ss('Area Restrictions', [
          'Fix went into place on Tuesday evening',
          'Notified Molly and Team Wed',
          'No issue identified',
        ]),
        ss('Tech 5', TECH5_STANDARD),
        ss('ATF/NESS Import', [
          'ATF/TPD and Axon meet on Thurs, May 28',
          'Issue: Different shell casing are coming into the form that do not match the gun.',
          ' ATF models data around the LE Case ID and not the Gun Crime ID.',
          'Resolution: ATF to change API feed model so casings are linked to guns which are then linked to the LE Case #.',
          'Follow up meeting scheduled for Thurs, June 11.',
        ]),
      ]),
      section('Senzing', [
        flat(
          'No New Update',
          'New Senzing file provided to Axon based on Canonical External ID on Thurs, May 21.',
          'Axon to begin work on week of June 8th',
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-05-18',
    publishedAt: '2026-05-22',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Updated Training for ATF Crime Gun form — hide the Nibin POE ID field',
          'Added 7550 to routing rule to CORE',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations/Conversions', [
        ss('Warrants', [
          `<p><strong>Issue:</strong> Aliases are not searchable within the Warrants &gt; Agency Court Papers search</p>${ul([
            'To find all warrants with aliases, you have to utilize the Omni box search within the Search module',
            'Additional filters are being added into Training to test out search ability including an Alias filter — ID and Alias fixes in progress',
            'If the filter is not supported in the module, Axon will enter a product feature request',
          ])}`,
          `<p><strong>Issue:</strong> Some charges missing in Axon from the warrants that are on the paper warrants — Ex: TC21</p>${ul([
            'Molly to send examples to RTU to research specific charges and get them added into Axon',
            'April to work with Harrison to see if those charges were sent in the payload',
          ])}`,
        ]),
        ss('Area Restrictions', [
          'During validation, the expiration date and purge date are different.',
          "Working theory: system used midnight as the time and it's showing in the UI an hour before.",
          'Fix to be tested next week with all parties available.',
        ]),
        ss('Tech 5', TECH5_STANDARD),
        ss('ATF/NESS Import', [
          'Axon provided response on the questions from the last validation email',
          'ATF/TPD and Axon to meet on Thurs, May 28 to discuss final sign off to push integration to Production',
        ]),
      ]),
      section('Senzing', [
        flat(
          'New Senzing file provided to Axon based on Canonical External ID on Thurs, May 21.',
          'Axon internal meeting scheduled for Tuesday, May 26.',
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-05-11',
    publishedAt: '2026-05-15',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [flat('No Changes')]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'Ingestion file completed Monday, May 11',
          'Delta file ingested Wednesday, May 13',
          'Integration ran manually Thursday, May 14 and trigger set',
          'Live integration ran Friday, May 15 without issues',
          `<p><strong>Integration Details:</strong></p>${ul([
            "City IT (Harrison) has a cleanup script that runs each morning at 3:00am to archive the previous day's file (to prevent duplicate ingestion)",
            'The integration file from the Court is sent to the server Axon has access to at 3:15am',
            'Axon picks up the file at 5:00am',
            'Records team begins working the warrants at 6:00am',
          ])}`,
        ]),
        ss('Tech 5', [p('No New Update'), ...TECH5_OUTSTANDING_ONLY]),
        ss('ATF/NESS Import', [
          'Axon and ATF meet Wednesday, May 13 to discuss second round of validation',
          'Keith to craft a response email for TPD',
          'Meeting between ATF/ TPD and Axon scheduled for Thurs, May 28 for final integration review',
        ]),
      ]),
      section('Senzing', [flat('Output file provided to Axon on Thurs, May 14')]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-05-04',
    publishedAt: '2026-05-08',
    publishedBy: 'mwesolowski',
    sections: [
      section('Program change', [flat('Warrant Permissions updates')]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'Full Production warrant file received and parsed successfully with no errors',
          'Production ingest is in progress; initial batches completed successfully and team received clearance to run the remaining full ingest',
          'As of latest update, ~6.5k warrants remain to be loaded',
          'Expected: Friday through Monday catch-up, then live integration can be turned on',
        ]),
        ss('Tech 5', [
          'Internal Decision to continue still Pending',
          ...TECH5_OUTSTANDING_ONLY,
        ]),
        ss('ATF/NESS Import', [
          'Pending: Axon / ATF to review validation feedback',
          'Next Axon/Agency/ ATF meeting TBD',
        ]),
      ]),
      section('Senzing', [
        flat(
          'Output file is ready, when warrants are ingested, Senzing will be purged and the script run again to generate a new deduped file with new MNIs',
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-04-27',
    publishedAt: '2026-05-01',
    publishedBy: 'mwesolowski',
    sections: [
      section('Program change', [flat('No changes')]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'Sample format file of 300 passed parsing and FETT testing',
          'Outstanding: Load 300 into Training once training integration incident resolved completely',
          'In progress — full set example file going through parsing and FETT testing',
          'Once complete, if no issues found, then TPD to provide full set Production file',
          'In progress — Engineering evaluating if the file needs split into smaller loads',
        ]),
        ss('Tech 5', ['Internal Decision to continue still Pending', ...TECH5_OUTSTANDING_ONLY]),
        ss('ATF/NESS Import', [
          'NESS file dump complete in Training',
          'TPD validation complete',
          'Axon / ATF to review validation feedback',
          'Next Axon/Agency/ ATF meeting TBD',
        ]),
      ]),
      section('Senzing', [flat('In Progress — No new update')]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-03-30',
    publishedAt: '2026-04-03',
    publishedBy: 'mwesolowski',
    sections: [
      section('Program change', [
        flat(
          'Cartographer enabled for Tucson',
          'In progress — MCT clean up following data migration',
          'ATF Crime Gun Form published in Prod (admin only until April 10 — not viewable except Admins while testing continues in Training)',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'In Progress — Combined / Validated file in integration format',
          'Outstanding — Ingestion of validated live warrant file',
          'Outstanding — Go live date',
        ]),
        ss('Tech 5', [
          'Meeting scheduled to go over potential workflow changes',
          'Outstanding — endpoint configuration issues from Tech 5',
          'Outstanding — pending confirmation on excluding all but offenders in the MNIs import',
        ]),
        ss('ATF/NESS Import', [
          'Live data into training as of April 2',
          'Meeting with TPD / Axon / ATF to be set first week of April',
        ]),
      ]),
      section('SENZING', [flat('In Progress', 'Form 4C taking priority at the moment.')]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-03-23',
    publishedAt: '2026-03-27',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'FOCUS_OFFICER_PRCIT role added to the Incident Form -TRN and PROD',
          'New case closure codes have went live in Production',
          'PDF Search feature turned on for Production — ability to search PDFs loaded from today forward',
          '13-3623 (B3) (DV) — charge format updated to reflect TRACS update',
          'NIBRS 26C to UCR 1104',
          '13-2506A (M1), 13-2506A1 (M1) and 13-2506A2 (M2) deprecated because they did not pop required NIBRS fields properly',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'Live warrant file received from Kiet for TPD comparison.',
          'Outstanding — Combined / Validated file in integration format',
          'Outstanding — Ingestion of validated live warrant file',
          'Outstanding — Go live date',
        ]),
        ss('Tech 5', ['No change from last week', ...TECH5_MAR23]),
        ss('ATF/NESS Import', ['Refer to Email sent Friday, Mar 6', ...ATF_REF_MAR6]),
      ]),
      section('SENZING', [
        flat('In Progress', 'Form 4C taking priority at the moment. Will revisit in a week or so.'),
      ]),
      section('COMPLETED', [
        flat(
          'Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)',
          '*** All Groups successfully ingested into Production',
          ...DATA_CONV_GROUPS,
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-03-16',
    publishedAt: '2026-03-20',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          '"Blue Team Required" case factor added to Training for review',
          'Motor Vehicle Fatality form created in Training for Analysis Division discussion',
          'Focus Officer — PCRIT — drafted in training. Working through NIBRS issue before go live.',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'Outstanding — Court contact on vacation this week. Unable to get Live warrant file for comparison.',
          'Outstanding — Go live date',
        ]),
        ss('Tech 5', [
          'No change from last week',
          'Testing — export payload sending. Diagnosing missing fields or workflow issue.',
          'Unable to test upload of mug shots.',
          'Request to test next Wed while the process is being worked to see end to end.',
          'Jason Danielle to send out more detailed email.',
        ]),
        ss('ATF/NESS Import', ['Refer to Email sent Friday, Mar 6', ...ATF_REF_MAR6]),
      ]),
      section('SENZING', [
        flat(
          'TPD DEs pulled updated axon.persons to ingest into the Senzing program',
          'DEs working with Senzing on results and validations',
        ),
      ]),
      section('IMPORTANT ISSUES IDENTIFIED', [
        ss('TRACS Citations', [
          'Missing Citation Numbers in axon.citation Datastore view — FINDINGS',
          'The TRACS integration initially recognizes the citation number, then checks for an associated incident. If an incident exists, a custom field replaces the citation number with the incident number as the unique identifier.',
          'If no incident number is available, the custom field uses the event ID entered by the officer in the Agency Report Number field in TRACS.',
          'Because the custom field overwrites the citation number with either the incident number or event ID, the citation number is not retained in the UI or the datastore.',
          'If needed, the integration can be updated to preserve the citation number through the Integrations Scope Change process.',
        ]),
        ss('DORS', [
          'Engineering determining root cause — RESOLVED',
          'A bug was identified in a recent deployment. This has been resolved.',
          'All Shoplifting reports affected have been fixed. They now show the address in the search cards as expected.',
        ]),
      ]),
      section('COMPLETED', [
        flat(
          'Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)',
          '*** All Groups successfully ingested into Production',
          ...DATA_CONV_GROUPS,
        ),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-03-09',
    publishedAt: '2026-03-13',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Case closure codes updated in Training — awaiting review before pushing live',
          'Added Axon NIBRS specialist Christina Swenson to TRN to assist with NIBRS mapping for the new Incident Role of "Focus Officer — PCRIT"',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'Area Restrictions testing done this week with TPD / Hexagon',
          'Hexagon doing some view adjustments',
          'Outstanding — Court and iLeads live warrants validation — for the ingestion file',
          'Outstanding — Go live date',
        ]),
        ss('Tech 5', [
          'No change from last week',
          'Tech 5 to change import endpoint to Production',
          'Final test scheduled Tues, Mar 17 at 9:00am',
        ]),
        ss('ATF/NESS Import', [
          'Refer to Email sent Friday, Mar 6',
          'Timeline provided for testing and deployment',
          'No revisions or additions provided for the Test plans',
        ]),
      ]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        flat('*** All Groups successfully ingested into Production', ...DATA_CONV_GROUPS),
      ]),
      section('SENZING', [
        flat(
          'TPD DEs pulled updated axon.persons to ingest into the Senzing program',
          'DEs working with Senzing on results and validations',
        ),
      ]),
      section('IMPORTANT ISSUES IDENTIFIED', [
        ss('TRACS Citations', [
          'Citation numbers missing from datastore axon.citations view',
          'Not missing for all reports but most',
          'RTU TRACS/Records review — no common denominator for when missing or showing',
          'Ticket entered with Axon engineering for diagnosis / resolution',
        ]),
        ss('DORS', [
          'Shoplifting reports are missing the incident address on the Incident Overview and on the Search card within Records',
          'This is happening only on Shoplifting reports',
          'Incident address is showing correctly within the -1 report',
          'Began happening on March 4',
          'Lexis Nexis is currently in the midst of a migration that began March 4 — March 13.',
          'Working with TPD DORS contact as well as Axon engineering to determine root cause',
        ]),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-03-03',
    publishedAt: '2026-03-06',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Replaced Auto Theft Tracker Dashboard with notice of redirection (from Anthony S)',
          'Updated spelling for "Recovered by Agency" and "Recovered by TPD" (Trn & Pro)',
          'Changed Primary MNI Flag Description to read "VERIFIED BY THE AFIS UNIT',
        ),
      ]),
      section('Data store', [flat('No changes')]),
      section('Integrations', [
        ss('Warrants', [
          'TPD Owner needed to work with Court & Molly to validate all active warrants in iLeads match active warrants with Court',
          'Once validated, file (in integration format) to be ingested into Production before Go Live',
          'Outstanding: TPD to provide Warrant Go Live date',
          'Molly and Bethany met this week to talk through Dept communication regarding Warrants to be sent out before Go Live.',
        ]),
        ss('Tech 5', [
          'No change from last week',
          'Testing on Tues, March 3.',
          'Tech 5 import pointing to Training environment',
          'Engineering working with Tech 5 to point to Production',
          'Final test to be rescheduled',
        ]),
        ss('ATF/NESS Import', [
          'Refer to Email sent Friday 4:38pm',
          'Timeline provided for testing and deployment',
          'Test plans provided for review / needed additions',
        ]),
      ]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        flat('*** All Groups successfully ingested into Production', ...DATA_CONV_GROUPS),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-02-23',
    publishedAt: '2026-02-27',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [flat('No changes')]),
      section('Data store', [flat('No changes')]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        flat(
          '*** All Groups successfully ingested into Production',
          ...DATA_CONV_GROUPS,
          'Expungement of 127K in progress — 48K remaining; to complete over the weekend.',
        ),
      ]),
      section('Integrations', [
        ss('Warrants', [
          'Production testing successful',
          'TPD to validate all active warrants in iLeads match active warrants with Court',
          'Once validated, file (in integration format) to be ingested into Production before Go Live',
          'TPD to determine Warrant Go Live date',
        ]),
        ss('Tech 5', [
          'No change from last week',
          'Final Production testing scheduled Tues, March 3 with Anna Badilla',
        ]),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-02-16',
    publishedAt: '2026-02-20',
    publishedBy: 'mwesolowski',
    sections: [
      section('Program change', [
        flat(
          'UCR  1708 ( Sex Offenses — Sextortion) Loaded to Production.',
          'Warrants — Updated form and entity in Production to match Training',
        ),
      ]),
      section('Data store', [flat('Initial meeting with Data Engineers concerning V2 migration')]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        ss('Group C', [
          'Expungement CM is ready for review',
          'Finalization of ~530 reports would be done next week through CM',
          'After expungement — Ingest 5422 Incident reports back in Tucson PROD env and ensure "New Person card" is resolved',
        ]),
        ss('Group D', [
          'Narrative Only load completed',
          '18 reports are not present in datastore — requested DS team to run backfill',
          'TPD running data quality validations on ingested data set',
          'Once 5422 Incident reports from Group C are re-ingested we have to ingest ~6k Narrative Only reports — to complete this Group',
        ]),
        ss('Group E', [
          'Received approval to proceed with the remaining load into PROD following successful confidence testing. However, we will defer execution until Group C is complete to avoid rework, as some secondary arrest supplements are linked to the 5,422 reports planned for expunging and re-ingestion',
        ]),
      ]),
      section('Integrations', [
        ss('Warrants', [
          'Training version of Warrant JSON moved to Production',
          'Training version of Warrant Entity JSON moved to Production',
          'Need to schedule another production test',
        ]),
        ss('Tech 5', ['No change from last week']),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-02-02',
    publishedAt: '2026-02-06',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Charge Entity schema: Corrected Offense Categories mapping for Incident searching (both Trn and Prod)',
          'Livescan Name Check: Added Mug ID to the Mug ID field in Production and implemented a DOB validation rule that rejects dates before 1900 or in the future (Production).',
          'Warrant Supplement: Added Legacy Person ID for the data conversion (Training and Production).',
          'Person View schema: Updated to display Mug ID within MNIs (Production).',
        ),
      ]),
      section('Data store', [flat('N/A')]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        ss('Group C', [
          'All legacy GO reports (1,201,441) are available in both the UI and the datastore.',
          'Approximately 500 reports are marked "In Progress" in the datastore but appear finalized in the UI; this discrepancy will be resolved via a backfill next week.',
        ]),
        ss('Group D', [
          'Derrick confirmed ingestion of 1,864,575 narrative-only payloads from legacy into Axon.',
          'Confidence testing completed; payloads currently being sent to Production. We will provide an update when ingestion is fully complete.',
        ]),
        ss('Group E', [
          "Awaiting Derrick's confirmation on the final small batch of payloads.",
          'After confirmation, we will run a ~100-payload validation before approving the group for Production load.',
        ]),
      ]),
      section('Integrations', [
        ss('Warrants', [
          'Form schema mismatches across environments blocked ingestion.',
          'Internal TPD discussion required to determine whether the Training form can be moved to Production without issues.',
        ]),
        ss('Tech 5', [
          'Import: All test scenarios passed. Preparing to test into Production.',
          `<p><strong>Export:</strong></p>${ul([
            'Training-environment pipeline was turned off, causing apparent test failures; the pipeline needs to be re-enabled.',
            'Production pipeline is working; additional testing will be performed.',
          ])}`,
        ]),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-01-19',
    publishedAt: '2026-01-23',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Quality Control Inventory feature live in Training early next week.',
          'Charge 13-1203A2 (M3) (DV) added to MCT',
        ),
      ]),
      section('Data store', [
        flat(
          'Datastore team / Luis meet Wednesday to discuss latency',
          'Troubleshoot plan identified to prove / disprove network data transfer as the root cause',
          'Datastore team coordinating troubleshooting efforts with Microsoft',
          'Follow up meeting next week — TBD',
        ),
      ]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        flat(
          'Incident ingestion — production payloads:',
          `<p><strong>Group C:</strong> ~127k GO reports are remaining to be ingested</p>`,
          `<p><strong>Group D:</strong> Narrative Only payloads being created; will be ingested after Group C completion</p>`,
          `<p><strong>Group E:</strong> Ingested 40+ new secondary arrests in training after fixing issues from initial feedback — awaiting TPD validation on new load</p>`,
        ),
      ]),
      section('Integrations', [
        ss('Warrants', [
          'Jason D to verify engineering completion and test plan',
          'Once confirmed, April to set up meeting with Records, RTU, Harrison and Jack for final testing.',
        ]),
        ss('Tech 5 Import', [
          'Export issue resolved',
          'Import issue being worked on',
          'Once complete, will test mug shot ingestion with Anna and Team',
        ]),
      ]),
    ],
  }),

  makeUpdate({
    weekOf: '2026-01-12',
    publishedAt: '2026-01-16',
    publishedBy: 'alarsh',
    sections: [
      section('Program change', [
        flat(
          'Property module enabled in Training (per Lt. Perrin; request from Bill Brantley & Heather Wellborn).',
          'Quality Control Inventory feature scheduled to go live in Training early next week.',
        ),
      ]),
      section('Data store', [
        flat(
          'Incident opened with DataStore team to troubleshoot nightly Glue job failures. Investigation ongoing with DataStore team and Luis Romero.',
        ),
      ]),
      section('Data conversion ( 01 RAIL - Tucson Conv - Smartsheet.com)', [
        flat(
          'Incident ingestion — production payloads:',
          `<p><strong>Group C:</strong> 90th percentile high; Aniket to finish today or early next week, then TPD due audit.</p>`,
          `<p><strong>Decision pending</strong> for handling ~127K existing 2022 records in Records (options: append with "Z" suffix or alternative). Discussions ongoing.</p>`,
          `<p><strong>Sequence:</strong> after Group C → Group E → Group D.</p>`,
          `<p><strong>Group F (Area Restrictions):</strong> new file to be generated after Records alignment (target: ~1 week).</p>`,
        ),
      ]),
      section('Integrations', [
        ss('Warrants', [
          'Waiting on Area Restrictions ingestion into Records.',
          'Jason D to approve deployment of the integration from Training to Prod during the next engineering sprint. This is prework only; integration will not go live until AR ingestion exists in Prod. Timing TBD.',
        ]),
        ss('Tech 5 Import', ['Annie B provided test cases this week. Validation in progress.']),
      ]),
    ],
  }),
]

fs.mkdirSync(updatesDir, { recursive: true })

let filesWritten = 0

for (const update of updates) {
  const filePath = path.join(updatesDir, `${update.id}.json`)
  fs.writeFileSync(filePath, `${JSON.stringify(update, null, 2)}\n`)
  filesWritten++
}

const index = {
  updates: [...updates]
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf))
    .map(({ id, weekOf, title, publishedAt, publishedBy }) => ({
      id,
      weekOf,
      title,
      publishedAt: publishedAt.includes('T') ? publishedAt : `${publishedAt}T17:00:00Z`,
      publishedBy,
    })),
}

fs.writeFileSync(path.join(updatesDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`)
filesWritten++

console.log(`Wrote ${filesWritten} files (${updates.length} updates + index.json)`)
