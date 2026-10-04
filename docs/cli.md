# Laboratory CLI

Read commands: customers, samples, sample <ref>, test <ref>, methods, equipment, worklist, review-queue, attention, turnaround, issues and compliance. Add --json to any command. Reference matching uses an exact code first, then a partial UUID or case-insensitive name/code. Ambiguity fails with candidates.

All flags use --name=value. Dates use YYYY-MM-DD and timestamps include a timezone. Zero is a valid result, blank is not. Required fields are below; optional fields are labelled.

| Write | Required flags |
|---|---|
| add customer | code, name; optional email |
| add method | code, name, revision, unit; optional lower, upper, validation |
| add equipment | code, name, calibrated (date), due (date), certificate |
| add sample | code, name, customer, matrix, received (timestamp), due (date), condition, location; optional collected (timestamp) |
| add test | code, sample, method, equipment, analyst, due (date) |
| add issue | code, sample, description, owner, due (date) |
| log custody | sample, at (timestamp), handler, location, note |
| log result | test, value, uncertainty (nonnegative), at (timestamp), analyst, raw (reference), qc (pass/fail/pending), reason |
| review <test> | reviewer, note |
| close-issue <ref> | resolution |
| import qbench | file; optional mapping, dry-run |
| export | optional out (new file only) |
| draft-weekly | none |

```bash
npm run lab -- add customer --code=C03 --name="Example Materials"
npm run lab -- sample S001
npm run lab -- log result --test=T003 --value=7.3 --uncertainty=0.1 --at=2026-10-03T12:00:00Z --analyst=Ben --raw=LOCAL-RAW-003 --qc=pass --reason="Correction after transcription check"
npm run lab -- review T003 --reviewer=Casey --note="Raw record and quality control checked"
```

Use actual evidence and times for your records. Measurement must follow receipt and cannot be in the future. Each correction creates a new revision, and earlier review does not approve the correction. Supplied operator names are not authenticated. Review is a recorded check, not authorisation to issue a certificate.

Register a new method code for each revision and assign new tests to it. Earlier results retain their own method and instrument snapshots. Database access must restrict direct changes in production. Custody events list movements; the sample location field records intake location and is not automatically changed by a movement.
