/** 복습 상태 */
export type ReviewStatus =
  /** 임포트만 되고 아직 오답노트를 쓰지 않은 상태. Needs Review 집계에서 제외된다. */
  | 'UNTOUCHED'
  /** 다시 봐야 하는 문제 */
  | 'NEEDS_REVIEW'
  /** 이해 완료 */
  | 'UNDERSTOOD';

/** 오답 유형 — 기획서 7장 */
export type MistakeType =
  | '접근 실패'
  | '알고리즘 선택'
  | '자료구조 선택'
  | '구현 오류'
  | '시간복잡도'
  | '문법/API';

export const MISTAKE_TYPES: MistakeType[] = [
  '접근 실패',
  '알고리즘 선택',
  '자료구조 선택',
  '구현 오류',
  '시간복잡도',
  '문법/API',
];

/** 복습 한 회차의 결과 — 복습 플로우 Step 4의 3지선다와 1:1 대응 */
export type ReviewResult =
  /** 아직도 접근이 어려움 */
  | 'FAILED'
  /** 접근은 가능하지만 구현이 어려움 */
  | 'PARTIAL'
  /** 완전히 이해함 */
  | 'UNDERSTOOD';

export interface Problem {
  /** `pgs-42627` */
  id: string;
  platform: 'PGS' | 'BOJ' | 'SWEA';
  number: number;
  title: string;
  /** `Level 3` (프로그래머스) / `Gold 4` (백준) */
  difficulty: string;
  url: string;
  /** algorithm 레포 기준 상대 경로 */
  sourcePath: string;
  /** 출제 플랫폼의 분류 (`힙（Heap）`) */
  category: string;
  types: string[];
  mistakes: MistakeType[];
  reviewStatus: ReviewStatus;
  /** YYYY-MM-DD */
  firstSolvedAt: string;
  lastReviewedAt: string | null;
  reviewCount: number;
  /** concepts.json 의 id 목록 */
  concepts: string[];
  performance: { memory: string; time: string } | null;
}

export interface Concept {
  /** `java-priority-queue` */
  id: string;
  category: 'Java' | 'Algorithm';
  title: string;
  description: string;
  /** 대표 사용 예시 코드 */
  code: string;
  relatedProblems: string[];
  /** 관련 개념 id */
  related: string[];
  /** 처음 기록한 날 YYYY-MM-DD */
  learnedAt: string;
}

export interface ReviewEntry {
  /** YYYY-MM-DD */
  date: string;
  result: ReviewResult;
  note: string;
  /** attempts/ 안의 재풀이 코드 파일명 */
  codeFile?: string;
}

export interface ReviewLog {
  problemId: string;
  history: ReviewEntry[];
}

/** 복습 결과 → 문제의 복습 상태 */
export const RESULT_TO_STATUS: Record<ReviewResult, ReviewStatus> = {
  FAILED: 'NEEDS_REVIEW',
  PARTIAL: 'NEEDS_REVIEW',
  UNDERSTOOD: 'UNDERSTOOD',
};

export const RESULT_LABEL: Record<ReviewResult, string> = {
  FAILED: '아직도 접근이 어려움',
  PARTIAL: '접근은 가능하지만 구현이 어려움',
  UNDERSTOOD: '완전히 이해함',
};
