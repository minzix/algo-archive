import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
export const DATA_DIR = path.join(ROOT, 'data');
export const CONTENT_DIR = path.join(ROOT, 'content', 'problems');

/** BaekjoonHub가 정답 코드를 커밋하는 레포. algo-archive 와 나란히 있다고 가정한다. */
export const SOURCE_REPO = path.resolve(ROOT, '..', 'algorithm');

const FILES = {
  problems: 'problems.json',
  concepts: 'concepts.json',
  reviews: 'reviews.json',
};

function filePath(kind) {
  const name = FILES[kind];
  if (!name) throw new Error(`알 수 없는 데이터 종류: ${kind}`);
  return path.join(DATA_DIR, name);
}

export function read(kind) {
  const p = filePath(kind);
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8').trim();
  return raw ? JSON.parse(raw) : [];
}

/**
 * JSON 배열을 정렬해서 저장한다.
 * 정렬을 고정해야 임포트를 반복해도 git diff가 깨끗하다.
 */
export function write(kind, rows, sortKey = 'id') {
  const sorted = [...rows].sort((a, b) =>
    String(a[sortKey]).localeCompare(String(b[sortKey]), 'en'),
  );
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(kind), JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  return sorted;
}

export function problemDir(id) {
  return path.join(CONTENT_DIR, id);
}

export function findProblem(problems, id) {
  const needle = String(id).trim().toLowerCase();
  return (
    problems.find((p) => p.id === needle) ??
    // `42627` 처럼 번호만 넘겨도 찾아준다
    problems.find((p) => String(p.number) === needle) ??
    null
  );
}

export function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** macOS 한글 파일명은 NFD로 저장된다. 비교·파싱에만 NFC를 쓰고 경로는 원본 그대로 쓴다. */
export function nfc(s) {
  return s.normalize('NFC');
}

/** 빈 오답노트 뼈대. 섹션 제목은 사이트가 파싱하므로 바꾸지 말 것. */
export function reviewTemplate() {
  return `## 내 접근

<!-- 처음 문제를 봤을 때 어떤 생각을 했는지 -->

## 왜 틀렸는가

<!-- 한 줄에 하나씩, 목록으로 -->
`;
}
