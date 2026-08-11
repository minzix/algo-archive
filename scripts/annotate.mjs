#!/usr/bin/env node
/**
 * 문제에 유형 · 오답 유형 · 개념을 붙이고 오답노트를 연다.
 *
 *   npm run annotate pgs-42627
 */
import fs from 'node:fs';
import path from 'node:path';
import { close, pick, pickMany } from './lib/prompt.mjs';
import { findProblem, problemDir, read, reviewTemplate, write } from './lib/store.mjs';

const MISTAKE_TYPES = [
  '접근 실패',
  '알고리즘 선택',
  '자료구조 선택',
  '구현 오류',
  '시간복잡도',
  '문법/API',
];

const target = process.argv[2];
if (!target) {
  console.error('사용법: npm run annotate <id>   예) npm run annotate pgs-42627');
  process.exit(1);
}

const problems = read('problems');
const problem = findProblem(problems, target);
if (!problem) {
  console.error(`문제를 찾을 수 없습니다: ${target}`);
  process.exit(1);
}

const concepts = read('concepts');

console.log(`\n${problem.platform} ${problem.number} · ${problem.title} (${problem.difficulty})`);
console.log(`현재 유형: ${problem.types.join(', ') || '없음'}`);
console.log(`현재 오답 유형: ${problem.mistakes.join(', ') || '없음'}`);

// 이미 쓰이고 있는 유형 + 이 문제의 유형을 후보로 제시한다
const knownTypes = [...new Set([...problems.flatMap((p) => p.types), ...problem.types])].sort();

problem.types = await pickMany(
  '유형을 고르세요 (쉼표로 여러 개)',
  knownTypes.map((t) => ({ label: t, value: t })),
  problem.types,
);

problem.mistakes = await pickMany(
  '오답 유형을 고르세요',
  MISTAKE_TYPES.map((m) => ({ label: m, value: m })),
  problem.mistakes,
);

if (concepts.length) {
  problem.concepts = await pickMany(
    '이 문제에서 배운 개념을 고르세요 (없으면 엔터)',
    concepts.map((c) => ({ label: `${c.title} (${c.category})`, value: c.id })),
    problem.concepts,
  );
  // 개념 쪽에도 역방향으로 연결해준다
  for (const concept of concepts) {
    const linked = problem.concepts.includes(concept.id);
    const already = concept.relatedProblems.includes(problem.id);
    if (linked && !already) concept.relatedProblems.push(problem.id);
    if (!linked && already) {
      concept.relatedProblems = concept.relatedProblems.filter((id) => id !== problem.id);
    }
  }
  write('concepts', concepts);
}

// 오답 원인을 적었다면 더 이상 손 안 댄 문제가 아니다
if (problem.reviewStatus === 'UNTOUCHED' && problem.mistakes.length) {
  problem.reviewStatus = await pick(
    '이 문제의 현재 상태는?',
    [
      { label: '다시 복습해야 함 (NEEDS_REVIEW)', value: 'NEEDS_REVIEW' },
      { label: '이해 완료 (UNDERSTOOD)', value: 'UNDERSTOOD' },
    ],
    0,
  );
}

write('problems', problems);
close();

const notePath = path.join(problemDir(problem.id), 'review.md');
if (!fs.existsSync(notePath)) fs.writeFileSync(notePath, reviewTemplate(), 'utf8');

console.log(`\n저장했습니다.`);
console.log(`오답노트를 채우세요: ${path.relative(process.cwd(), notePath)}`);
console.log(`내 오답 코드:       ${path.relative(process.cwd(), path.join(problemDir(problem.id), 'my-code.java'))}`);
