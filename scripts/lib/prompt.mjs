import readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const rl = readline.createInterface({ input: stdin, output: stdout });

/**
 * 들어온 줄을 큐에 모아둔다.
 *
 * readline은 질문을 기다리는 중이 아닐 때 들어온 줄을 그냥 버린다.
 * 파이프로 입력을 넣으면 모든 줄이 한꺼번에 도착하므로 그대로 두면 대부분 유실된다.
 * 큐에 쌓아두면 사람이 직접 치든 파이프로 넣든 똑같이 동작한다.
 */
const queued = [];
const waiting = [];
let ended = false;

rl.on('line', (line) => {
  const resolve = waiting.shift();
  if (resolve) resolve(line);
  else queued.push(line);
});

rl.on('close', () => {
  ended = true;
  while (waiting.length) waiting.shift()('');
});

function nextLine() {
  if (queued.length) return Promise.resolve(queued.shift());
  if (ended) return Promise.resolve('');
  return new Promise((resolve) => waiting.push(resolve));
}

export function close() {
  rl.close();
}

export async function ask(question, fallback = '') {
  stdout.write(`${question}${fallback ? ` (${fallback})` : ''}: `);
  const answer = (await nextLine()).trim();
  return answer || fallback;
}

export async function confirm(question, fallback = true) {
  stdout.write(`${question} [${fallback ? 'Y/n' : 'y/N'}]: `);
  const answer = (await nextLine()).trim().toLowerCase();
  if (!answer) return fallback;
  return answer === 'y' || answer === 'yes';
}

/**
 * YYYY-MM-DD 날짜. 형식이 틀리면 다시 묻는다.
 * 이 값이 정렬 · 히트맵 · 복습 이력의 기준이라 조용히 틀리면 안 된다.
 */
export async function askDate(question, fallback) {
  const answer = await ask(question, fallback);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(answer) || Number.isNaN(Date.parse(answer))) {
    stdout.write(`날짜는 YYYY-MM-DD 형식이어야 합니다: ${answer}\n`);
    return askDate(question, fallback);
  }
  return answer;
}

/**
 * 번호로 하나 고르기.
 * @param {{label: string, value: any}[]} options
 */
export async function pick(question, options, fallbackIndex = 0) {
  stdout.write(`\n${question}\n`);
  options.forEach((o, i) => stdout.write(`  ${i + 1}. ${o.label}\n`));
  stdout.write(`선택 (${fallbackIndex + 1}): `);

  const answer = (await nextLine()).trim();
  const index = answer ? Number(answer) - 1 : fallbackIndex;
  if (!Number.isInteger(index) || index < 0 || index >= options.length) {
    stdout.write('범위를 벗어난 선택입니다. 다시 골라주세요.\n');
    return pick(question, options, fallbackIndex);
  }
  return options[index].value;
}

/**
 * 번호를 쉼표로 여러 개 고르기. 엔터만 치면 지금 선택을 유지한다.
 * @param {{label: string, value: any}[]} options
 */
export async function pickMany(question, options, selected = []) {
  stdout.write(`\n${question}\n`);
  options.forEach((o, i) => {
    stdout.write(`  [${selected.includes(o.value) ? '×' : ' '}] ${i + 1}. ${o.label}\n`);
  });
  stdout.write('번호를 쉼표로 구분해 입력 (엔터 = 유지): ');

  const answer = (await nextLine()).trim();
  if (!answer) return selected;

  const picked = answer
    .split(',')
    .map((s) => Number(s.trim()) - 1)
    .filter((i) => Number.isInteger(i) && i >= 0 && i < options.length)
    .map((i) => options[i].value);
  return [...new Set(picked)];
}

/** 여러 줄 입력. 빈 줄에서 엔터를 한 번 더 누르면 끝난다. */
export async function askMultiline(question) {
  stdout.write(`\n${question}\n(작성 후 빈 줄에서 엔터를 한 번 더 누르면 끝납니다)\n`);

  const lines = [];
  for (;;) {
    stdout.write('> ');
    const line = await nextLine();
    if (line === '' && (lines.length === 0 || lines.at(-1) === '')) break;
    lines.push(line);
  }
  return lines.join('\n').trim();
}
