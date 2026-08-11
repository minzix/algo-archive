#!/usr/bin/env node
/**
 * GitHub Issue Form 으로 제출된 내용을 데이터에 반영한다.
 * Actions 에서만 쓰인다. 사람이 직접 부를 일은 없다.
 *
 *   node scripts/apply-issue.mjs <annotate|review|concept>
 *
 * 이슈 본문은 ISSUE_BODY 환경변수로 받는다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { findProblem, problemDir, read, today, write } from './lib/store.mjs';

const MISTAKE_TYPES = [
  '접근 실패',
  '알고리즘 선택',
  '자료구조 선택',
  '구현 오류',
  '시간복잡도',
  '문법/API',
];

const RESULT_BY_LABEL = {
  '아직도 접근이 어려움': 'FAILED',
  '접근은 가능하지만 구현이 어려움': 'PARTIAL',
  '완전히 이해함': 'UNDERSTOOD',
};

const RESULT_TO_STATUS = {
  FAILED: 'NEEDS_REVIEW',
  PARTIAL: 'NEEDS_REVIEW',
  UNDERSTOOD: 'UNDERSTOOD',
};

const kind = process.argv[2];
const body = process.env.ISSUE_BODY ?? '';

/** 실패하면 Actions 로그에 이유를 남기고 멈춘다. */
function fail(message) {
  console.error(message);
  process.exit(1);
}

/**
 * Issue Form 본문은 `### 라벨` 뒤에 값이 오는 형태다.
 * 비워둔 항목은 `_No response_` 로 들어온다.
 */
function parseSections(markdown) {
  const out = new Map();
  const blocks = markdown.replace(/\r\n/g, '\n').split(/^### /m).slice(1);

  for (const block of blocks) {
    const newline = block.indexOf('\n');
    const label = block.slice(0, newline === -1 ? undefined : newline).trim();
    const value = newline === -1 ? '' : block.slice(newline + 1).trim();
    out.set(label, value === '_No response_' ? '' : value);
  }
  return out;
}

const fields = parseSections(body);

const field = (label) => fields.get(label) ?? '';

/** ```java ... ``` 로 감싸인 코드 블록을 벗긴다 (render: java 필드) */
function unfence(value) {
  const fenced = value.match(/^```[a-z]*\n([\s\S]*?)\n?```$/);
  return (fenced ? fenced[1] : value).trim();
}

/** `- [X] 접근 실패` 형태에서 체크된 항목만 */
function checked(label, allowed) {
  return field(label)
    .split('\n')
    .filter((l) => /^- \[[xX]\]/.test(l.trim()))
    .map((l) => l.replace(/^- \[[xX]\]\s*/, '').trim())
    .filter((v) => allowed.includes(v));
}

function commaList(label) {
  return field(label)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function dateOr(label, fallback) {
  const value = field(label).trim();
  if (!value) return fallback;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
    fail(`날짜는 YYYY-MM-DD 형식이어야 합니다: ${value}`);
  }
  return value;
}

/** 커밋 메시지와 이슈 답글에 쓸 한 줄 */
function report(summary) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT ?? '/dev/null', `summary=${summary}\n`);
  console.log(summary);
}

/* ── annotate ────────────────────────────────────────── */

function applyAnnotate() {
  const problems = read('problems');
  const problem = findProblem(problems, field('문제 ID'));
  if (!problem) fail(`문제를 찾을 수 없습니다: ${field('문제 ID')}`);

  const types = commaList('유형 태그');
  if (types.length) problem.types = types;

  problem.mistakes = checked('오답 유형', MISTAKE_TYPES);

  const status = field('현재 상태').trim();
  problem.reviewStatus = status === 'UNDERSTOOD' ? 'UNDERSTOOD' : 'NEEDS_REVIEW';

  const approach = field('내 접근');
  const why = field('왜 틀렸는가')
    .split('\n')
    .map((l) => l.trim().replace(/^(?:[-*]|\d+\.)\s*/, ''))
    .filter(Boolean);

  const note = [
    '## 내 접근',
    '',
    approach || '<!-- 처음 문제를 봤을 때 어떤 생각을 했는지 -->',
    '',
    '## 왜 틀렸는가',
    '',
    ...(why.length ? why.map((w) => `- ${w}`) : ['<!-- 한 줄에 하나씩, 목록으로 -->']),
    '',
  ].join('\n');

  fs.writeFileSync(path.join(problemDir(problem.id), 'review.md'), note, 'utf8');

  const myCode = unfence(field('내 오답 코드'));
  if (myCode) {
    fs.writeFileSync(path.join(problemDir(problem.id), 'my-code.java'), myCode + '\n', 'utf8');
  }

  write('problems', problems);
  report(`annotate: ${problem.platform} ${problem.number} ${problem.title}`);
}

/* ── review ──────────────────────────────────────────── */

function applyReview() {
  const problems = read('problems');
  const problem = findProblem(problems, field('문제 ID'));
  if (!problem) fail(`문제를 찾을 수 없습니다: ${field('문제 ID')}`);

  const result = RESULT_BY_LABEL[field('이번 복습 결과').trim()];
  if (!result) fail(`복습 결과를 알 수 없습니다: ${field('이번 복습 결과')}`);

  const date = dateOr('기록할 날짜', today());

  const logs = read('reviews');
  let log = logs.find((l) => l.problemId === problem.id);
  if (!log) {
    log = { problemId: problem.id, history: [] };
    logs.push(log);
  }

  const entry = { date, result, note: field('이번에 알게 된 것') };

  const code = unfence(field('다시 푼 코드'));
  if (code) {
    const dir = path.join(problemDir(problem.id), 'attempts');
    fs.mkdirSync(dir, { recursive: true });
    entry.codeFile = `review-${date}.java`;
    fs.writeFileSync(path.join(dir, entry.codeFile), code + '\n', 'utf8');
  }

  log.history.push(entry);
  log.history.sort((a, b) => a.date.localeCompare(b.date));

  problem.reviewStatus = RESULT_TO_STATUS[result];
  problem.lastReviewedAt = date;
  problem.reviewCount = log.history.length;

  write('reviews', logs, 'problemId');
  write('problems', problems);
  report(`review: ${problem.platform} ${problem.number} → ${problem.reviewStatus}`);
}

/* ── concept ─────────────────────────────────────────── */

function applyConcept() {
  const concepts = read('concepts');
  const problems = read('problems');

  const category = field('종류').trim() === 'Algorithm' ? 'Algorithm' : 'Java';
  const title = field('이름').trim();
  if (!title) fail('개념 이름이 비어 있습니다.');

  const id = `${category.toLowerCase()}-${title
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()}`;

  if (concepts.some((c) => c.id === id)) fail(`이미 있는 개념입니다: ${id}`);

  // 없는 문제 id 를 적었으면 조용히 넘어가지 말고 알려준다
  const relatedProblems = commaList('관련 문제').map((raw) => {
    const found = findProblem(problems, raw);
    if (!found) fail(`문제를 찾을 수 없습니다: ${raw}`);
    return found.id;
  });

  const related = commaList('관련 개념').filter((rid) => concepts.some((c) => c.id === rid));

  concepts.push({
    id,
    category,
    title,
    description: field('한 줄 설명'),
    code: unfence(field('예제 코드')),
    relatedProblems,
    related,
    learnedAt: dateOr('배운 날짜', today()),
  });

  // 관련 개념과 문제 양쪽에 역방향으로 연결한다
  for (const other of concepts) {
    if (related.includes(other.id) && !other.related.includes(id)) other.related.push(id);
  }
  for (const p of problems) {
    if (relatedProblems.includes(p.id) && !p.concepts.includes(id)) p.concepts.push(id);
  }

  write('concepts', concepts);
  write('problems', problems);
  report(`study: ${title}`);
}

const handlers = { annotate: applyAnnotate, review: applyReview, concept: applyConcept };
const handler = handlers[kind];
if (!handler) fail(`알 수 없는 종류: ${kind}`);
handler();
