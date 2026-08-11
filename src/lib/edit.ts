/**
 * 폼 입력을 커밋할 파일 목록으로 바꾼다.
 *
 * scripts/ 의 CLI 와 같은 결과를 내야 한다. 정렬과 들여쓰기까지 맞춰야
 * 어느 쪽으로 기록하든 git diff 가 깨끗하다.
 */
import { commitFiles, readJson, type FileChange } from './github';
import { RESULT_TO_STATUS, type Concept, type MistakeType, type Problem, type ReviewLog, type ReviewResult, type ReviewStatus } from './types';

/** CLI 의 write() 와 같은 형식: id 정렬, 2칸 들여쓰기, 끝에 개행 */
function stableJson<T extends Record<string, any>>(rows: T[], sortKey: keyof T = 'id'): string {
  const sorted = [...rows].sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey]), 'en'));
  return JSON.stringify(sorted, null, 2) + '\n';
}

function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 사이트가 파싱하는 섹션 제목은 고정이다. */
function buildNote(approach: string, whyWrong: string[]): string {
  return [
    '## 내 접근',
    '',
    approach || '<!-- 처음 문제를 봤을 때 어떤 생각을 했는지 -->',
    '',
    '## 왜 틀렸는가',
    '',
    ...(whyWrong.length ? whyWrong.map((w) => `- ${w}`) : ['<!-- 한 줄에 하나씩, 목록으로 -->']),
    '',
  ].join('\n');
}

export function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((l) => l.trim().replace(/^(?:[-*]|\d+\.)\s*/, ''))
    .filter(Boolean);
}

/* ── 오답노트 ────────────────────────────────────────── */

export interface AnnotateInput {
  problemId: string;
  approach: string;
  whyWrong: string;
  mistakes: MistakeType[];
  status: ReviewStatus;
  myCode: string;
}

export async function saveAnnotation(input: AnnotateInput): Promise<string> {
  const problems = await readJson<Problem[]>('data/problems.json');
  const problem = problems.find((p) => p.id === input.problemId);
  if (!problem) throw new Error(`문제를 찾을 수 없습니다: ${input.problemId}`);

  problem.mistakes = input.mistakes;
  problem.reviewStatus = input.status;

  const dir = `content/problems/${problem.id}`;
  const files: FileChange[] = [
    { path: 'data/problems.json', content: stableJson(problems) },
    { path: `${dir}/review.md`, content: buildNote(input.approach.trim(), splitLines(input.whyWrong)) },
  ];

  const myCode = input.myCode.trim();
  if (myCode) files.push({ path: `${dir}/my-code.java`, content: myCode + '\n' });

  return commitFiles(files, `annotate: ${problem.platform} ${problem.number} ${problem.title}`);
}

/* ── 복습 결과 ───────────────────────────────────────── */

export interface ReviewInput {
  problemId: string;
  result: ReviewResult;
  note: string;
  code: string;
}

export async function saveReview(input: ReviewInput): Promise<string> {
  const [problems, logs] = await Promise.all([
    readJson<Problem[]>('data/problems.json'),
    readJson<ReviewLog[]>('data/reviews.json'),
  ]);

  const problem = problems.find((p) => p.id === input.problemId);
  if (!problem) throw new Error(`문제를 찾을 수 없습니다: ${input.problemId}`);

  let log = logs.find((l) => l.problemId === problem.id);
  if (!log) {
    log = { problemId: problem.id, history: [] };
    logs.push(log);
  }

  const date = today();
  const entry: ReviewLog['history'][number] = { date, result: input.result, note: input.note.trim() };

  const files: FileChange[] = [];
  const code = input.code.trim();
  if (code) {
    entry.codeFile = `review-${date}.java`;
    files.push({ path: `content/problems/${problem.id}/attempts/${entry.codeFile}`, content: code + '\n' });
  }

  log.history.push(entry);
  log.history.sort((a, b) => a.date.localeCompare(b.date));

  problem.reviewStatus = RESULT_TO_STATUS[input.result];
  problem.lastReviewedAt = date;
  problem.reviewCount = log.history.length;

  files.push(
    { path: 'data/problems.json', content: stableJson(problems) },
    { path: 'data/reviews.json', content: stableJson(logs, 'problemId') },
  );

  return commitFiles(files, `review: ${problem.platform} ${problem.number} → ${problem.reviewStatus}`);
}

/* ── 개념 카드 ───────────────────────────────────────── */

export interface ConceptInput {
  category: Concept['category'];
  title: string;
  description: string;
  code: string;
  relatedProblems: string[];
  related: string[];
}

export function conceptId(category: string, title: string): string {
  return `${category.toLowerCase()}-${title
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()}`;
}

export async function saveConcept(input: ConceptInput): Promise<string> {
  const [concepts, problems] = await Promise.all([
    readJson<Concept[]>('data/concepts.json'),
    readJson<Problem[]>('data/problems.json'),
  ]);

  const id = conceptId(input.category, input.title);
  if (concepts.some((c) => c.id === id)) throw new Error(`이미 있는 개념입니다: ${id}`);

  concepts.push({
    id,
    category: input.category,
    title: input.title.trim(),
    description: input.description.trim(),
    code: input.code.trim(),
    relatedProblems: input.relatedProblems,
    related: input.related,
    learnedAt: today(),
  });

  // 개념끼리, 그리고 문제 쪽에도 역방향으로 이어준다
  for (const other of concepts) {
    if (input.related.includes(other.id) && !other.related.includes(id)) other.related.push(id);
  }
  for (const p of problems) {
    if (input.relatedProblems.includes(p.id) && !p.concepts.includes(id)) p.concepts.push(id);
  }

  return commitFiles(
    [
      { path: 'data/concepts.json', content: stableJson(concepts) },
      { path: 'data/problems.json', content: stableJson(problems) },
    ],
    `study: ${input.title.trim()}`,
  );
}
