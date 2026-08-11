#!/usr/bin/env node
/**
 * 복습 한 회차를 기록한다. 이력은 지우지 않고 계속 쌓는다.
 *
 *   npm run review pgs-42627
 *   npm run review pgs-42627 -- --result=UNDERSTOOD
 */
import fs from 'node:fs';
import path from 'node:path';
import { ask, askDate, askMultiline, close, confirm, pick } from './lib/prompt.mjs';
import { findProblem, problemDir, read, today, write } from './lib/store.mjs';

const RESULTS = [
  { label: '아직도 접근이 어려움', value: 'FAILED' },
  { label: '접근은 가능하지만 구현이 어려움', value: 'PARTIAL' },
  { label: '완전히 이해함', value: 'UNDERSTOOD' },
];

/** 복습 결과 → 문제의 복습 상태 */
const RESULT_TO_STATUS = {
  FAILED: 'NEEDS_REVIEW',
  PARTIAL: 'NEEDS_REVIEW',
  UNDERSTOOD: 'UNDERSTOOD',
};

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const preset = args.find((a) => a.startsWith('--result='))?.split('=')[1];

if (!target) {
  console.error('사용법: npm run review <id>   예) npm run review pgs-42627');
  process.exit(1);
}

const problems = read('problems');
const problem = findProblem(problems, target);
if (!problem) {
  console.error(`문제를 찾을 수 없습니다: ${target}`);
  process.exit(1);
}

const logs = read('reviews');
let log = logs.find((l) => l.problemId === problem.id);
if (!log) {
  log = { problemId: problem.id, history: [] };
  logs.push(log);
}

console.log(`\n${problem.platform} ${problem.number} · ${problem.title}`);
console.log(`현재 상태: ${problem.reviewStatus} · 복습 ${problem.reviewCount}회`);
if (log.history.length) {
  console.log('\n지난 기록');
  for (const h of log.history) console.log(`  ${h.date}  ${h.result.padEnd(10)} ${h.note}`);
}

let result = preset;
if (result && !RESULT_TO_STATUS[result]) {
  console.error(`알 수 없는 결과값: ${result} (FAILED / PARTIAL / UNDERSTOOD)`);
  process.exit(1);
}
if (!result) result = await pick('이번 복습 결과는?', RESULTS, 2);

const note = await askMultiline('이번 복습에서 알게 된 것 (한 줄이어도 됩니다)');
const date = await askDate('기록할 날짜', today());

// 다시 푼 코드가 있으면 attempts/ 에 남긴다
let codeFile;
if (await confirm('이번에 다시 푼 코드를 저장할까요?', false)) {
  const source = await ask('코드 파일 경로 (붙여넣기)');
  if (source && fs.existsSync(source)) {
    const dir = path.join(problemDir(problem.id), 'attempts');
    fs.mkdirSync(dir, { recursive: true });
    codeFile = `review-${date}.java`;
    fs.copyFileSync(source, path.join(dir, codeFile));
    console.log(`저장: attempts/${codeFile}`);
  } else if (source) {
    console.log(`파일을 찾을 수 없어 건너뜁니다: ${source}`);
  }
}

close();

log.history.push({ date, result, note, ...(codeFile ? { codeFile } : {}) });
log.history.sort((a, b) => a.date.localeCompare(b.date));

problem.reviewStatus = RESULT_TO_STATUS[result];
problem.lastReviewedAt = date;
problem.reviewCount = log.history.length;

write('reviews', logs, 'problemId');
write('problems', problems);

console.log(`\n${problem.id} → ${problem.reviewStatus} (복습 ${problem.reviewCount}회)`);
console.log(`git commit -m "review: ${problem.platform} ${problem.number}"`);
