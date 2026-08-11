import problemsJson from '../../data/problems.json';
import conceptsJson from '../../data/concepts.json';
import reviewsJson from '../../data/reviews.json';
import type { Concept, Problem, ReviewLog, ReviewStatus } from './types';

export const problems = problemsJson as Problem[];
export const concepts = conceptsJson as Concept[];
export const reviewLogs = reviewsJson as ReviewLog[];

/* ── 콘텐츠 파일 ──────────────────────────────────────
 * content/problems/<id>/ 아래 파일들을 빌드 시점에 전부 읽어들인다.
 * 정적 사이트라 런타임 파일 접근이 없다.
 */
// Vite는 glob 인자를 정적으로 분석하므로 옵션을 변수로 빼면 안 된다.
const answerFiles = import.meta.glob('/content/problems/*/answer-code.java', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const myFiles = import.meta.glob('/content/problems/*/my-code.java', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const reviewFiles = import.meta.glob('/content/problems/*/review.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const attemptFiles = import.meta.glob('/content/problems/*/attempts/*.java', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function fileFor(map: Record<string, unknown>, id: string, name: string): string {
  return ((map[`/content/problems/${id}/${name}`] as string) ?? '').trim();
}

export interface Attempt {
  file: string;
  code: string;
}

export interface ProblemContent {
  myCode: string;
  answerCode: string;
  /** 오답노트의 `## 내 접근` */
  approach: string;
  /** 오답노트의 `## 왜 틀렸는가` — 항목별로 쪼갠 것 */
  whyWrong: string[];
  /** 복습 때 다시 푼 코드, 최신순 */
  attempts: Attempt[];
}

/**
 * 오답노트에서 `## 제목` 섹션 본문을 뽑는다.
 * HTML 주석은 안내문이라 버린다.
 */
function section(markdown: string, heading: string): string {
  const block = markdown
    .split(/^## /m)
    .slice(1)
    .find((b) => b.split('\n', 1)[0]!.trim() === heading);
  if (!block) return '';
  return block.split('\n').slice(1).join('\n').replace(/<!--[\s\S]*?-->/g, '').trim();
}

export function getContent(id: string): ProblemContent {
  const note = fileFor(reviewFiles, id, 'review.md');

  const attempts = Object.entries(attemptFiles)
    .filter(([p]) => p.startsWith(`/content/problems/${id}/attempts/`))
    .map(([p, code]) => ({ file: p.split('/').pop()!, code: String(code).trim() }))
    .sort((a, b) => b.file.localeCompare(a.file));

  return {
    myCode: fileFor(myFiles, id, 'my-code.java'),
    answerCode: fileFor(answerFiles, id, 'answer-code.java'),
    approach: section(note, '내 접근'),
    whyWrong: section(note, '왜 틀렸는가')
      .split('\n')
      // `- 항목` / `1. 항목` 둘 다 받는다
      .map((l) => l.trim().replace(/^(?:[-*]|\d+\.)\s*/, ''))
      .filter(Boolean),
    attempts,
  };
}

/* ── 조회 헬퍼 ───────────────────────────────────────── */

export function problemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function conceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function historyOf(id: string) {
  const log = reviewLogs.find((r) => r.problemId === id);
  return [...(log?.history ?? [])].sort((a, b) => a.date.localeCompare(b.date));
}

/** `PGS 42627` — 디자인의 문제 코드 표기 */
export function problemCode(p: Problem): string {
  return `${p.platform} ${p.number}`;
}

export const STATUS_COLOR: Record<ReviewStatus, string> = {
  UNDERSTOOD: 'var(--ok)',
  NEEDS_REVIEW: 'var(--warn)',
  UNTOUCHED: 'var(--faint)',
};

/** 아직 오답노트를 쓰지 않은 문제는 복습 대상 집계에서 뺀다. */
export function needsReview(): Problem[] {
  return problems
    .filter((p) => p.reviewStatus === 'NEEDS_REVIEW')
    .sort((a, b) => (b.lastReviewedAt ?? '').localeCompare(a.lastReviewedAt ?? ''));
}

export function understood(): Problem[] {
  return problems.filter((p) => p.reviewStatus === 'UNDERSTOOD');
}

/** 마지막 복습(없으면 첫 풀이) 기준 최신순 — 문제 목록의 기본 정렬 */
export function byLastReview(list: Problem[] = problems): Problem[] {
  return [...list].sort((a, b) =>
    (b.lastReviewedAt ?? b.firstSolvedAt ?? '').localeCompare(
      a.lastReviewedAt ?? a.firstSolvedAt ?? '',
    ),
  );
}

/* ── 집계 ────────────────────────────────────────────── */

/** 오답 유형별 문제 수, 많은 순 */
export function mistakeCounts(): { label: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const p of problems) {
    for (const m of p.mistakes) tally.set(m, (tally.get(m) ?? 0) + 1);
  }
  return [...tally]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

/** 유형별 푼 문제 수와 오답 수, 많은 순 */
export function typeCounts(): { label: string; solved: number; mistakes: number }[] {
  const tally = new Map<string, { solved: number; mistakes: number }>();
  for (const p of problems) {
    for (const t of p.types) {
      const row = tally.get(t) ?? { solved: 0, mistakes: 0 };
      row.solved++;
      if (p.mistakes.length) row.mistakes++;
      tally.set(t, row);
    }
  }
  return [...tally]
    .map(([label, row]) => ({ label, ...row }))
    .sort((a, b) => b.solved - a.solved || a.label.localeCompare(b.label));
}

/** 필터 칩용 유형 목록 */
export function allTypes(): string[] {
  return [...new Set(problems.flatMap((p) => p.types))].sort((a, b) => a.localeCompare(b));
}

/** 최근 학습한 개념, 최신순 */
export function recentConcepts(limit = 3): Concept[] {
  return [...concepts].sort((a, b) => b.learnedAt.localeCompare(a.learnedAt)).slice(0, limit);
}

/** 아카이브에 마지막으로 기록이 남은 날 — 헤더의 LAST SYNC */
export function lastActivity(): string | null {
  const dates = activityDates();
  return dates.length ? dates[dates.length - 1]! : null;
}

/** 학습 활동이 있었던 모든 날짜 (첫 풀이 + 모든 복습), 오름차순 */
function activityDates(): string[] {
  const dates: string[] = [];
  for (const p of problems) if (p.firstSolvedAt) dates.push(p.firstSolvedAt);
  for (const log of reviewLogs) for (const h of log.history) dates.push(h.date);
  return dates.sort();
}

export interface HeatWeek {
  days: { date: string; level: number; count: number }[];
}

/**
 * 최근 `weeks`주의 일별 활동량을 0~4단계로.
 * 마지막 열이 이번 주가 되도록 일요일 기준으로 자른다.
 */
export function heatmap(weeks = 26): HeatWeek[] {
  const counts = new Map<string, number>();
  for (const d of activityDates()) counts.set(d, (counts.get(d) ?? 0) + 1);

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + (6 - end.getDay())); // 이번 주 토요일

  const out: HeatWeek[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const days: HeatWeek['days'] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(end);
      day.setDate(end.getDate() - (w * 7 + (6 - d)));
      const key = day.toISOString().slice(0, 10);
      const count = counts.get(key) ?? 0;
      days.push({ date: key, count, level: count === 0 ? 0 : Math.min(4, count) });
    }
    out.push({ days });
  }
  return out;
}

export function stats() {
  return {
    total: problems.length,
    understood: understood().length,
    needsReview: needsReview().length,
    concepts: concepts.length,
  };
}
