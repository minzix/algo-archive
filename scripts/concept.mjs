#!/usr/bin/env node
/**
 * 새로 배운 문법 · 알고리즘을 복습 카드로 추가한다.
 *
 *   npm run concept
 */
import { ask, askDate, askMultiline, close, pick, pickMany } from './lib/prompt.mjs';
import { read, today, write } from './lib/store.mjs';

const concepts = read('concepts');
const problems = read('problems');

const category = await pick('어떤 종류인가요?', [
  { label: 'Java — 문법 / API', value: 'Java' },
  { label: 'Algorithm — 알고리즘 / 자료구조', value: 'Algorithm' },
]);

const title = await ask('이름 (예: PriorityQueue)');
if (!title) {
  console.error('이름은 비울 수 없습니다.');
  process.exit(1);
}

const id = `${category.toLowerCase()}-${title
  .trim()
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase()}`;

if (concepts.some((c) => c.id === id)) {
  console.error(`이미 있는 개념입니다: ${id}`);
  process.exit(1);
}

const description = await ask('한 줄 설명');
const code = await askMultiline('예제 코드 (없으면 엔터)');

const relatedProblems = await pickMany(
  '이 개념을 처음 쓴 문제를 고르세요',
  problems
    .filter((p) => p.firstSolvedAt)
    .sort((a, b) => b.firstSolvedAt.localeCompare(a.firstSolvedAt))
    .slice(0, 20)
    .map((p) => ({ label: `${p.platform} ${p.number} · ${p.title}`, value: p.id })),
);

const related = concepts.length
  ? await pickMany(
      '관련 개념을 고르세요 (없으면 엔터)',
      concepts.map((c) => ({ label: `${c.title} (${c.category})`, value: c.id })),
    )
  : [];

const learnedAt = await askDate('배운 날짜', today());
close();

concepts.push({ id, category, title, description, code, relatedProblems, related, learnedAt });

// 관련 개념은 양방향으로 이어준다
for (const other of concepts) {
  if (related.includes(other.id) && !other.related.includes(id)) other.related.push(id);
}

// 고른 문제에도 이 개념을 달아준다
for (const p of problems) {
  if (relatedProblems.includes(p.id) && !p.concepts.includes(id)) p.concepts.push(id);
}

write('concepts', concepts);
write('problems', problems);

console.log(`\n추가했습니다: ${id}`);
console.log(`git commit -m "study: ${title}"`);
