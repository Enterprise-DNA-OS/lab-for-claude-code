# Laboratory evidence checks

Scope: nonclinical food, environmental and materials laboratory records. These checks identify gaps; they do not certify ISO/IEC 17025, NATA or IANZ accreditation. No official report release, diagnostic use or electronic-signature validation is included. The lab owns method validation, measurement uncertainty, competence, accreditation scope and intended-use validation.

Sources checked 4 October 2026:

- [NATA ISO/IEC 17025 Standard Application Document, October 2024](https://nata.com.au/files/2021/05/ISO-IEC-17025-Standard-Application-Document-2017.pdf): resource, technical-record and reporting criteria supplement the standard and sector documents.
- [IANZ drinking-water laboratory programme](https://www.ianz.govt.nz/programmes/drinking-water-testing-laboratory/): accreditation depends on assessment against the standard and applicable criteria. This build does not claim that status.

| Check | What this implementation tests | Basis and limit |
|---|---|---|
| CALIBRATION / RESULT_EQUIPMENT | Missing evidence, overdue instrument record, measurement outside the calibration window stored with the result | NATA section 6.4 context; date-window logic is our record policy, not a universal calibration interval |
| METHOD_VALIDATION | Method has no validation reference | NATA section 7.2 context; storing a reference does not validate a method |
| SAMPLE_TRACE | Missing collection time or custody event | House traceability policy supporting technical records; not a completeness test for every sampling requirement |
| QC_HOLD | Latest result has failed or pending quality control | NATA section 7.7 context; actual control acceptance rules are laboratory-specific |
| RESULT_REVIEW | Latest result lacks a recorded review | House review policy supporting result reporting; it does not authenticate the reviewer |
| OPEN_ISSUE | Sample issue remains unresolved | House hold policy; it is not a full corrective-action programme |

Run `npm run lab -- compliance`. Results and custody are append-only. Each correction stores a new result revision with a reason and evidence snapshots. Reviews require a different supplied name from the analyst, passing quality control, method validation and calibration references, and no open sample issues. Independent review is our house rule. Database administrators can change the system, so this is not a tamper-proof audit service.

The certificate is always DRAFT. Uncertainty is a supplied nonnegative value with no automatic coverage factor or confidence statement. Recorded limits only identify results needing attention; they are not a regulatory pass/fail or conformity decision. Holding times, preservation rules, calibration intervals and report wording must be set from the lab's approved methods and customer requirements. Demo limits are fictional.
