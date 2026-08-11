#!/usr/bin/env node
/**
 * algorithm 레포의 프로그래머스 문제를 아카이브로 가져온다.
 *
 * 멱등하게 동작한다. 두 번 돌려도 손으로 채운 내용(types 수정본, mistakes,
 * reviewStatus, concepts, review.md, my-code.java)은 그대로 두고
 * README에서 파생되는 필드만 갱신한다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR, SOURCE_REPO, nfc, read, reviewTemplate, write } from './lib/store.mjs';

const PGS_DIR = path.join(SOURCE_REPO, '프로그래머스');

/** 프로그래머스 `구분` → 초기 유형 태그. 이후 `npm run annotate` 로 세분화한다. */
const CATEGORY_TYPES = {
  '해시': ['Hash'],
  '스택／큐': ['Stack', 'Queue'],
  '힙（Heap）': ['Heap', 'Priority Queue'],
  '정렬': ['Sorting'],
  '완전탐색': ['Brute Force'],
  '탐욕법（Greedy）': ['Greedy'],
  '이분탐색': ['Binary Search'],
  '깊이／너비 우선 탐색（DFS／BFS）': ['DFS/BFS'],
  '동적계획법（Dynamic Programming）': ['DP'],
  '그래프': ['Graph'],
  '2018 KAKAO BLIND RECRUITMENT': [],
  'PCCP 기출문제': [],
};

/**
 * README에는 U+2005(four-per-em space) 같은 유니코드 공백이 섞여 있다.
 * 그대로 두면 `구분` 문자열이 매핑 키와 안 맞는다.
 */
function despace(s) {
  // \s 는 유니코드 공백을 전부 포함한다. 줄바꿈만 남기고 나머지는 평범한 공백으로.
  return s.replace(/[^\S\r\n]/g, ' ');
}

/** `### 제목` 아래 첫 번째 비어있지 않은 줄 */
function section(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => l.trim() === `### ${heading}`);
  if (start === -1) return null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('###')) break;
    if (line) return despace(line);
  }
  return null;
}

function parseReadme(markdown) {
  const md = despace(nfc(markdown));

  // # [level 3] 디스크 컨트롤러 - 42627
  const title = md.match(/^#\s*\[level\s*(\d+)\]\s*(.+?)\s*-\s*(\d+)\s*$/m);
  if (!title) return null;

  const submitted = section(md, '제출 일자'); // 2026년 07월 30일 09:15:59
  const date = submitted?.match(/(\d{4})년\s*(\d{2})월\s*(\d{2})일/);

  const perf = section(md, '성능 요약')?.match(/메모리:\s*([^,]+),\s*시간:\s*(.+)/);
  const url = md.match(/\[문제 링크\]\((.+?)\)/);

  // 코딩테스트 연습 > 힙（Heap）  →  마지막 조각만
  const category = section(md, '구분')?.split('>').pop()?.trim() ?? '';

  return {
    number: Number(title[3]),
    title: title[2],
    difficulty: `Level ${title[1]}`,
    url: url?.[1] ?? `https://school.programmers.co.kr/learn/courses/30/lessons/${title[3]}`,
    category,
    firstSolvedAt: date ? `${date[1]}-${date[2]}-${date[3]}` : null,
    performance: perf ? { memory: perf[1].trim(), time: perf[2].trim() } : null,
  };
}

/** 프로그래머스 폴더를 훑어 { readme, java, sourcePath } 목록을 만든다. */
function scanSource() {
  if (!fs.existsSync(PGS_DIR)) {
    console.error(`프로그래머스 폴더를 찾을 수 없습니다: ${PGS_DIR}`);
    console.error('algorithm 레포가 algo-archive 와 같은 상위 폴더에 있어야 합니다.');
    process.exit(1);
  }

  const found = [];
  // 레벨 폴더(1, 2, 3) → 문제 폴더
  for (const level of fs.readdirSync(PGS_DIR, { withFileTypes: true })) {
    if (!level.isDirectory()) continue;
    const levelDir = path.join(PGS_DIR, level.name);

    for (const problem of fs.readdirSync(levelDir, { withFileTypes: true })) {
      if (!problem.isDirectory()) continue;
      // NFD 파일명이라 readdir이 준 이름을 그대로 이어붙여야 한다
      const dir = path.join(levelDir, problem.name);
      const entries = fs.readdirSync(dir);
      const readme = entries.find((f) => nfc(f) === 'README.md');
      const java = entries.find((f) => f.endsWith('.java'));
      if (!readme || !java) continue;

      found.push({
        readmePath: path.join(dir, readme),
        javaPath: path.join(dir, java),
        sourcePath: nfc(path.join('프로그래머스', level.name, problem.name)),
      });
    }
  }
  return found;
}

function main() {
  const problems = read('problems');
  const byId = new Map(problems.map((p) => [p.id, p]));

  let added = 0;
  let updated = 0;
  const skipped = [];

  for (const src of scanSource()) {
    const meta = parseReadme(fs.readFileSync(src.readmePath, 'utf8'));
    if (!meta) {
      skipped.push(src.sourcePath);
      continue;
    }

    const id = `pgs-${meta.number}`;
    const existing = byId.get(id);

    // README에서 파생되는 필드만 갱신하고 손으로 채운 필드는 유지한다
    const record = {
      id,
      platform: 'PGS',
      number: meta.number,
      title: meta.title,
      difficulty: meta.difficulty,
      url: meta.url,
      sourcePath: src.sourcePath,
      category: meta.category,
      // 손으로 붙인 태그는 지키되, 비어있으면 매핑에서 다시 시드한다
      types: existing?.types?.length ? existing.types : (CATEGORY_TYPES[meta.category] ?? []),
      mistakes: existing?.mistakes ?? [],
      reviewStatus: existing?.reviewStatus ?? 'UNTOUCHED',
      firstSolvedAt: existing?.firstSolvedAt ?? meta.firstSolvedAt,
      lastReviewedAt: existing?.lastReviewedAt ?? null,
      reviewCount: existing?.reviewCount ?? 0,
      concepts: existing?.concepts ?? [],
      performance: meta.performance,
    };

    if (existing) {
      Object.assign(existing, record);
      updated++;
    } else {
      problems.push(record);
      byId.set(id, record);
      added++;
    }

    writeContent(id, src.javaPath);
  }

  write('problems', problems);

  console.log(`문제 ${problems.length}개 · 새로 추가 ${added} · 갱신 ${updated}`);
  if (skipped.length) {
    console.log(`\nREADME 형식이 달라 건너뛴 폴더 ${skipped.length}개:`);
    skipped.forEach((s) => console.log(`  ${s}`));
  }
  if (added) {
    console.log('\n다음: npm run annotate <id> 로 유형과 오답노트를 채우세요.');
  }
}

/** 정답 코드는 항상 원본과 맞추고, 손으로 쓰는 파일은 없을 때만 만든다. */
function writeContent(id, javaPath) {
  const dir = path.join(CONTENT_DIR, id);
  fs.mkdirSync(dir, { recursive: true });

  fs.copyFileSync(javaPath, path.join(dir, 'answer-code.java'));

  const myCode = path.join(dir, 'my-code.java');
  if (!fs.existsSync(myCode)) fs.writeFileSync(myCode, '', 'utf8');

  const review = path.join(dir, 'review.md');
  if (!fs.existsSync(review)) fs.writeFileSync(review, reviewTemplate(), 'utf8');
}

main();
