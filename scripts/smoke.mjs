import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawnSync} from 'node:child_process';
import ExcelJS from 'exceljs';
import {getDb,REPO_ROOT} from './lib/db.mjs';import {migrate} from './migrate.mjs';import {seed} from './seed.mjs';import {run,reads,tables} from './lab.mjs';import {parseCsv} from './lib/csv.mjs';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lab-test-'));
process.env.DATABASE_URL=process.env.TEST_DATABASE_URL||'';process.env.DATA_DIR=path.join(temp,'db');process.env.OUTPUT_DIR=temp;
const day=n=>new Date(Date.now()+n*86400000).toISOString().slice(0,10);const at=n=>day(n)+'T00:00:00Z';
let db;const cli=(...args)=>run(db,args);
try{
 db=await getDb();await migrate(db);assert.equal((await migrate(db)).ran.length,0);await seed(db);await seed(db);
 assert.equal((await cli('samples')).length,4);assert.equal((await cli('worklist')).length,4);
 for(const cmd of Object.keys(reads))assert(Array.isArray(await cli(cmd,'--json')),cmd);
 assert((await cli('help'))[0].commands.includes('import qbench'));
 assert.equal((await cli('sample','river inlet')).sample.code,'S001');const s=(await cli('sample','S001')).sample;assert.equal((await cli('sample',s.id.slice(0,8))).sample.code,'S001');
 await assert.rejects(()=>cli('sample','River'),/Ambiguous.*S001.*S002/);
 const checks=await cli('compliance');for(const code of ['CALIBRATION','QC_HOLD','METHOD_VALIDATION','SAMPLE_TRACE','RESULT_REVIEW','RESULT_EQUIPMENT','OPEN_ISSUE'])assert(checks.some(x=>x.rule===code),code);
 const writes=[
 ['add','customer','--code=C03','--name=Test Client'],
 ['add','method','--code=COND','--name=Conductivity','--revision=1','--unit=uS/cm','--lower=0','--upper=100','--validation=TEST-VAL'],
 ['add','equipment','--code=CD01','--name=Conductivity meter',`--calibrated=${day(-5)}`,`--due=${day(100)}`,'--certificate=TEST-CAL'],
 ['add','sample','--code=S005','--name=Test water','--customer=C03','--matrix=Water',`--collected=${at(-3)}`,`--received=${at(-2)}`,`--due=${day(2)}`,'--condition=Intact','--location=Cold room'],
 ['add','test','--code=T005','--sample=S005','--method=COND','--equipment=CD01','--analyst=Tester',`--due=${day(2)}`],
 ['add','issue','--code=I005','--sample=S005','--description=Check seal','--owner=Reviewer',`--due=${day(1)}`],
 ['log','custody','--sample=S005',`--at=${at(-1)}`,'--handler=Tester','--location=Bench','--note=Receipt checked']
 ];for(const args of writes)await cli(...args);
 const result=['log','result','--test=T005','--value=50','--uncertainty=1',`--at=${at(-1)}`,'--analyst=Tester','--raw=TEST-RAW','--qc=pass','--reason=Initial result'];
 await cli(...result);await assert.rejects(()=>cli('review','T005','--reviewer=Reviewer','--note=Checked'),/unresolved/);
 await cli('close-issue','I005','--resolution=Seal inspected');await assert.rejects(()=>cli('close-issue','I005','--resolution=Again'),/already closed/);
 await assert.rejects(()=>cli('review','T005','--reviewer=tester','--note=Checked'),/Independent/);
 await cli('review','T005','--reviewer=Reviewer','--note=Evidence checked');
 assert.equal((await cli('worklist')).find(x=>x.code==='T005').status,'reviewed');
 await cli(...result.map(x=>x==='--value=50'?'--value=55':x==='--reason=Initial result'?'--reason=Transcription correction':x));
 assert.equal((await cli('test','T005')).history.length,2);assert.equal((await cli('worklist')).find(x=>x.code==='T005').status,'awaiting review');
 const before=(await cli('test','T005')).history[0];assert.equal(Number(before.value),50);assert.equal(before.reviewer,'Reviewer');
 await assert.rejects(()=>db.query('update results set value=999 where id=$1',[before.id]),/append-only/);
 await assert.rejects(()=>db.query('delete from reviews where result_id=$1',[before.id]),/append-only/);
 await assert.rejects(async()=>db.query('delete from custody where sample_id=$1',[(await cli('sample','S005')).sample.id]),/append-only/);
 await assert.rejects(()=>cli('review','T002','--reviewer=Casey','--note=Check'),/blocked/);
 // Test each evidence gate independently, not only the multi-failure demo row.
 const makeTest=async(code,method='COND',equipment='CD01')=>cli('add','test',`--code=${code}`,'--sample=S005',`--method=${method}`,`--equipment=${equipment}`,'--analyst=Tester',`--due=${day(2)}`);
 for(const [code,method,equipment,qc] of [['T006','COND','CD01','fail'],['T007','SOLIDS','CD01','pass'],['T008','COND','TB01','pass']]){await makeTest(code,method,equipment);await cli(...result.map(x=>x==='--test=T005'?`--test=${code}`:x==='--qc=pass'?`--qc=${qc}`:x));await assert.rejects(()=>cli('review',code,'--reviewer=Reviewer','--note=Check'),/blocked/);}
 await assert.rejects(()=>cli(...result.map(x=>x==='--value=50'?'--value=NaN':x)),/Invalid/);
 await assert.rejects(()=>cli(...result.map(x=>x==='--uncertainty=1'?'--uncertainty=-1':x)),/check constraint/);
 await assert.rejects(()=>cli(...result.map(x=>x===`--at=${at(-1)}`?`--at=${at(1)}`:x)),/between receipt/);
 await assert.rejects(()=>cli('add','equipment','--code=BAD','--name=Bad','--calibrated=2026-02-30','--due=2027-01-01','--certificate=X'),/Invalid/);
 // Evidence snapshots survive changes to the current method record.
 await db.query("update methods set unit='changed',revision='2' where code='COND'");assert.equal((await cli('test','T005')).history[1].method_snapshot.unit,'uS/cm');
 const file=path.join(temp,'samples.csv');const header='Sample ID,Sample Name,Customer,Matrix,Collected At,Received At,Due Date,Condition,Location\r\n';
 const row=(code,name='Imported sample')=>`${code},${name},C01,Water,2026-09-01T09:00:00Z,2026-09-01T10:00:00Z,2026-09-03,Intact,Cold room\r\n`;
 fs.writeFileSync(file,'\uFEFF'+header+row('QB01','"Outlet, west"'));
 assert.equal((await cli('import','qbench',`--file=${file}`,'--dry-run')).inserted,1);await assert.rejects(()=>cli('sample','QB01'),/No match/);
 assert.equal((await cli('import','qbench',`--file=${file}`)).inserted,1);assert.equal((await cli('import','qbench',`--file=${file}`)).unchanged,1);
 assert.equal((await cli('sample','QB01')).custody.length,0,'Import never invents custody');
 fs.writeFileSync(file,header+row('QB02')+row('QB01','Changed'));await assert.rejects(()=>cli('import','qbench',`--file=${file}`),/Conflicting/);await assert.rejects(()=>cli('sample','QB02'),/No match/);
 fs.writeFileSync(file,header+row('QB02')+row('QB02'));await assert.rejects(()=>cli('import','qbench',`--file=${file}`),/Duplicate/);
 const map=path.join(temp,'mapping.json');const mapping=JSON.parse(fs.readFileSync(path.join(REPO_ROOT,'examples/qbench-mapping.json')));mapping.code='ID';fs.writeFileSync(map,JSON.stringify(mapping));fs.writeFileSync(file,header.replace('Sample ID','ID')+row('QB03'));assert.equal((await cli('import','qbench',`--file=${file}`,`--mapping=${map}`)).inserted,1);
 const workbook=new ExcelJS.Workbook(),sheet=workbook.addWorksheet('Samples');sheet.addRow(header.trim().split(','));sheet.addRow(['QB04','Spreadsheet sample','C01','Water','2026-09-01T09:00:00Z','2026-09-01T10:00:00Z',new Date('2026-09-03T00:00:00Z'),'Intact','Cold room']);const xlsx=path.join(temp,'samples.xlsx');await workbook.xlsx.writeFile(xlsx);assert.equal((await cli('import','qbench',`--file=${xlsx}`)).inserted,1);assert.equal((await cli('import','qbench',`--file=${xlsx}`)).unchanged,1);
 sheet.getCell('B2').value={formula:'1+1',result:2};await workbook.xlsx.writeFile(xlsx);await assert.rejects(()=>cli('import','qbench',`--file=${xlsx}`),/Formula/);
 assert.throws(()=>parseCsv('a,a\n1,2'),/unique/);assert.throws(()=>parseCsv('a,b\n"bad'),/unclosed/);assert.throws(()=>parseCsv('a,b\n1,2,3'),/expected/);
 const exportFile=path.join(temp,'all.json');await cli('export',`--out=${exportFile}`);assert.deepEqual(Object.keys(JSON.parse(fs.readFileSync(exportFile)).data),tables);await assert.rejects(()=>cli('export',`--out=${exportFile}`),/EEXIST/);
 const draft=await cli('draft-weekly');assert.equal(draft.sent,false);assert.match(fs.readFileSync(draft.file,'utf8'),/review-queue/);fs.unlinkSync(draft.file);
 await assert.rejects(()=>cli('nonsense'),/Unknown/);await assert.rejects(()=>cli('samples','--wrong'),/Unknown option/);await assert.rejects(()=>cli('import','qbench',`--file=${file}`,'--dry-run=false'),/boolean/);
 const totals=await cli('turnaround');assert.equal(Number(totals.find(x=>x.customer==='Harbour Water Lab Client').tests),3);
 await db.close();db=null;
 const child=(script,...args)=>{const p=spawnSync(process.execPath,[script,...args],{cwd:REPO_ROOT,env:process.env,encoding:'utf8'});assert.equal(p.status,0,p.stderr);return p.stdout;};assert(Array.isArray(JSON.parse(child('scripts/lab.mjs','samples','--json'))));
 const bad=spawnSync(process.execPath,['scripts/lab.mjs','sample','River'],{cwd:REPO_ROOT,env:process.env,encoding:'utf8'});assert.equal(bad.status,1);assert.match(bad.stderr,/Ambiguous/);
 child('scripts/view.mjs');child('scripts/docs.mjs');assert.match(fs.readFileSync(path.join(temp,'views/week.html'),'utf8'),/Laboratory week/);const certificates=fs.readdirSync(path.join(temp,'docs-out/certificate'));assert(certificates.length>=4);const html=fs.readFileSync(path.join(temp,'docs-out/certificate',certificates[0]),'utf8');assert.match(html,/DRAFT Certificate/);assert.match(html,/Not authorised for issue/);
 console.log(`PASS: ${process.env.TEST_DATABASE_URL?'PostgreSQL':'PGlite'} migration, seed, every CLI path, result revisions, review gates, evidence snapshots, import rollback, CSV/XLSX, export, drafts, HTML. ${fs.readdirSync(path.join(REPO_ROOT,'.claude/commands')).filter(x=>x.endsWith('.md')&&x!=='README.md').length} slash commands.`);
}finally{await db?.close();fs.rmSync(temp,{recursive:true,force:true});}
