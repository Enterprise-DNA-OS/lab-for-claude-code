# Lab for Claude Code

Samples, test worklists, result revisions and draft certificates in a database you own. Built by Enterprise DNA. MIT licence. Works with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free code. Install and operate it. Hosting and agent costs are yours. | Your methods, fields, forms and QBench data mapping. [Book a call](https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=qbench&utm_medium=github). | Installed, connected and operated through Omni by Enterprise DNA. One setup fee, then a retainer. [See the offer](https://enterprisedna.co/omni/instead-of/qbench?utm_source=github&utm_medium=readme&utm_campaign=qbench). |

## Quick start

```bash
git clone https://github.com/Enterprise-DNA-OS/lab-for-claude-code.git
cd lab-for-claude-code
npm install
npm run demo
npm test
npm run view
npm run docs
```

Node 20 or newer. Local mode uses embedded PGlite without a server. The demo has two fictional customers, four samples, four tests, failed quality control, an expired calibration and a damaged-seal issue. Methods and limits are illustrative, not drinking-water or food acceptance criteria. Seeding twice does not duplicate records. Use a separate database for live work.

Set DATABASE_URL through the environment for a shared Postgres database and run `npm run migrate`. Configure permissions, backups and operator identity before shared use. The local database supports one process at a time.

## Weekly laboratory work

| Job | Recipe |
|---|---|
| /add | .claude/commands/add.md |
| /attention | .claude/commands/attention.md |
| /bench-worklist | .claude/commands/bench-worklist.md |
| /close-issue | .claude/commands/close-issue.md |
| /compliance | .claude/commands/compliance.md |
| /customers | .claude/commands/customers.md |
| /customise | .claude/commands/customise.md |
| /documents | .claude/commands/documents.md |
| /draft-weekly | .claude/commands/draft-weekly.md |
| /equipment | .claude/commands/equipment.md |
| /export | .claude/commands/export.md |
| /import | .claude/commands/import.md |
| /issues | .claude/commands/issues.md |
| /log | .claude/commands/log.md |
| /methods | .claude/commands/methods.md |
| /new-view | .claude/commands/new-view.md |
| /review-queue | .claude/commands/review-queue.md |
| /review-result | .claude/commands/review-result.md |
| /sample | .claude/commands/sample.md |
| /samples | .claude/commands/samples.md |
| /test | .claude/commands/test.md |
| /turnaround | .claude/commands/turnaround.md |
| /weekly-review | .claude/commands/weekly-review.md |

The five bench rituals are intake, bench worklist, result review, equipment checks and customer turnaround. One CLI supports human output or --json. [Write flags and examples](docs/cli.md) cover adding records, logging evidence and reviewing results.

## Evidence before review

Nine business tables hold customers, versioned methods, instruments, samples, tests, result revisions, reviews, custody and issues. Three database views drive worklist, attention and turnaround. Each result snapshots its method and calibration evidence. Corrections add a revision; earlier values and reviews remain. Review refuses failed quality control, absent validation, out-of-date calibration at measurement and unresolved sample issues. Independent review is a house policy, not a claimed universal legal requirement.

Names supplied to the CLI are recorded labels, not authenticated identities. There is no signed release workflow or production accreditation claim. [Compliance scope and sources](docs/compliance.md) explain the checks. Your lab validates its intended use before relying on it.

## Ten questions across your records

QBench offers configurable reports and analytics. These are questions this free version answers today; we have not established that QBench cannot answer them.

1. Which overdue tests still await review rather than a measurement? (`worklist`)
2. Which customers have the most overdue tests in our loaded history? (`turnaround`)
3. Which results combine failed quality control and values outside our recorded limits? (`review-queue`)
4. Which instruments have expired calibration or missing evidence? (`compliance`)
5. Which sample receipts have no collection time or custody entry? (`compliance`)
6. Which methods have no validation reference? (`compliance`)
7. Which test results were measured outside the recorded calibration period? (`compliance`)
8. Which samples have arrived without any assigned tests? (`attention`)
9. Who owns each open sample issue and when is it due? (`issues`)
10. What changed between every recorded revision of a result? (`test T001`)

## Paperwork and views

`npm run docs` creates a draft certificate of analysis and custody record for each sample, plus nonconformance records. `npm run view` creates views/week.html from the same database views as the CLI. Change brand.json to use your business name, logo and colours. Every certificate says DRAFT, including reviewed results. Recorded limits are a simple screening check; the base does not make conformity decisions.

## Your first hour: ten things to ask for

1. Put our business name and logo on the draft certificate.
2. Add our customer reference to intake.
3. Register our method codes and revisions.
4. Add our instrument calibration evidence.
5. Map our QBench sample headings.
6. Show overdue tests by analyst.
7. Add our preservation and holding-time policy.
8. Add our agreed uncertainty statement to draft reports.
9. Add a date window to the customer turnaround view.
10. Draft this week's review from the current records.

/customise backs up first, writes and applies a migration, updates affected reads and documents, and tests the result. /new-view adds a read-only dashboard.

## Instead of QBench

The [switch guide](docs/replace-qbench.md) covers the vendor export steps, XLSX and CSV intake, field mapping, dry runs and reconciliation. Sample intake is a one-command import after customers and headings are mapped. It does not bring over tests, worksheets, attachments, signatures or audit history. Conflicting reimports fail atomically rather than changing existing evidence.

```bash
npm run lab -- import qbench --file=examples/qbench-samples.csv --dry-run
npm run lab -- export
```

The sample fixture is synthetic. QBench custom fields vary by tenant; check your actual export. [Why no front end](docs/why-no-front-end.md) describes mobile capture, barcode and instrument connections as custom work.

## Verification

`npm test` uses a temporary database and output directory. It checks idempotent migrations and seed, every CLI path, evidence revisions, blocked reviews, ambiguous names, XLSX and CSV import, rollback, JSON export and branded documents. CI covers Linux and Windows plus PostgreSQL. Local results are reported separately from hosted CI results.

MIT. Copyright 2026 Enterprise DNA.
