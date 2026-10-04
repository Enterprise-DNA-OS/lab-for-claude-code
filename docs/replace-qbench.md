# Replace QBench: sample intake first

Sources checked 4 October 2026: [QBench Samples](https://junctionconcepts.zendesk.com/hc/en-us/articles/360014250891-Samples) and [Exporting and Importing](https://junctionconcepts.zendesk.com/hc/en-us/articles/360020238772-Exporting-and-Importing). These document sample exports as XLSX and a separate test-worksheet CSV export. They do not establish a universal column layout for customised tenants.

In Workflow, open Samples, select records and use Export Selected, or Export All. When the queued export is ready, use Download Latest Export All. Keep the original export intact. The base reads the first worksheet of an XLSX file or a UTF-8 CSV. It rejects formula and rich-text cells; export plain values if necessary. No vendor connection or credentials are needed.

1. Export a small sample and compare its headings with the mapping below.
2. Register your customers with `add customer`. Customer matches use an existing code or unambiguous name.
3. Map your headings in a JSON file. Supplied dates must be ISO dates; timestamps must include a timezone. Do not infer a sampling time from a receipt date.
4. Run a dry run, then remove --dry-run to import in one command. Reconcile sample counts, source IDs, customers, timestamps and due dates before expanding the batch.

```bash
npm run lab -- import qbench --file=your-export.xlsx --mapping=your-mapping.json --dry-run
npm run lab -- import qbench --file=your-export.xlsx --mapping=your-mapping.json
```

The default mapping and the synthetic CSV fixture use:

| Internal field | Export heading |
|---|---|
| code | Sample ID |
| name | Sample Name |
| customer | Customer |
| matrix | Matrix |
| collected | Collected At |
| received | Received At |
| due | Due Date |
| condition | Condition |
| location | Location |

Use `examples/qbench-mapping.json` as the starting point. These headings are a supported mapping example, not a claim that every QBench export has these columns. Blank collected time is preserved as unknown and flagged by compliance. Other mapped values are required. Spreadsheet date cells are accepted for dates; check your source timezone before using timestamp cells.

Import creates samples only. It does not invent custody receipts, tests, methods, result values, review signatures, attachments, worksheets, billing, quality-management history or an audit trail. Keep those originals; Enterprise DNA scopes their migration separately. Imported samples with no assigned test appear in attention.

An identical reimport is unchanged. A duplicate ID within a batch, conflicting existing record, missing customer, invalid time or missing required value rolls back the entire batch. A dry run also rolls back. No history is silently overwritten. JSON export includes all nine business tables and identifiers; database backup/restore is the recovery path, not reimporting the QBench samples file.

Use a day to prove a small, mapped intake workflow. Full migration timing depends on custom fields, history, validation and instrument connections. Run both systems until the lab has reconciled and approved the intended use.
