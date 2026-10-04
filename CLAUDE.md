# Lab for Claude Code

For a food, environmental or materials testing laboratory managing intake, test worklists and technical review. Set your business name, scope, operators, methods and policy before loading live data. No patient diagnosis, regulated report release or automatic instrument control.

Every answer starts with a CLI read. Run `npm run lab -- help`. All reads support --json. Names are case insensitive; ambiguous names list candidates and exit 1. Read docs/cli.md before writes.

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

Rules:

- Do not invent results, sampling dates, limits, reviewer identities, calibration evidence or command output.
- Results, reviews and custody events are append-only. Correct a result with a new revision and a reason. A new revision requires a new review.
- Record only a review that the named person has actually performed. The CLI does not authenticate the supplied name.
- Nothing sends, deletes, certifies accreditation or issues reports. All documents are drafts.
- Compliance checks are evidence-gap checks. Read docs/compliance.md and the laboratory's own applicable criteria.
- Import samples only from a checked QBench spreadsheet or CSV mapping. Never infer missing custody or review history.
- Local mode is one process at a time. Shared use needs database permissions, identity integration, backups and validation.
- No live secrets in files or commits. Use numbered migrations, preserve evidence, and run npm test after a change.

Records live in supabase/migrations, the CLI in scripts/lab.mjs, presentation in brand.json, documents.json and views.json. AGENTS.md routes other agents here. Omni by Enterprise DNA installs and runs a customised version.
