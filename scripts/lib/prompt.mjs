import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const rl = readline.createInterface({ input: stdin, output: stdout });

export function close() {
  rl.close();
}

export async function ask(question, fallback = '') {
  const suffix = fallback ? ` (${fallback})` : '';
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || fallback;
}

export async function confirm(question, fallback = true) {
  const hint = fallback ? 'Y/n' : 'y/N';
  const answer = (await rl.question(`${question} [${hint}]: `)).trim().toLowerCase();
  if (!answer) return fallback;
  return answer === 'y' || answer === 'yes';
}

/**
 * 번호로 하나 고르기.
 * @param {{label: string, value: any}[]} options
 */
export async function pick(question, options, fallbackIndex = 0) {
  console.log(`\n${question}`);
  options.forEach((o, i) => console.log(`  ${i + 1}. ${o.label}`));
  const answer = (await rl.question(`선택 (${fallbackIndex + 1}): `)).trim();
  const index = answer ? Number(answer) - 1 : fallbackIndex;
  if (!Number.isInteger(index) || index < 0 || index >= options.length) {
    console.log('범위를 벗어난 선택입니다. 다시 골라주세요.');
    return pick(question, options, fallbackIndex);
  }
  return options[index].value;
}

/**
 * 번호를 쉼표로 여러 개 고르기. 빈 입력은 빈 배열.
 * @param {{label: string, value: any}[]} options
 */
export async function pickMany(question, options, selected = []) {
  console.log(`\n${question}`);
  options.forEach((o, i) => {
    const mark = selected.includes(o.value) ? '×' : ' ';
    console.log(`  [${mark}] ${i + 1}. ${o.label}`);
  });
  const answer = (await rl.question('번호를 쉼표로 구분해 입력 (엔터 = 유지): ')).trim();
  if (!answer) return selected;
  const picked = answer
    .split(',')
    .map((s) => Number(s.trim()) - 1)
    .filter((i) => Number.isInteger(i) && i >= 0 && i < options.length)
    .map((i) => options[i].value);
  return [...new Set(picked)];
}

/** 여러 줄 입력. 빈 줄 두 번이면 종료. */
export async function askMultiline(question) {
  console.log(`\n${question}`);
  console.log('(작성 후 빈 줄에서 엔터를 한 번 더 누르면 끝납니다)');
  const lines = [];
  for (;;) {
    const line = await rl.question('> ');
    if (line === '' && lines.at(-1) === '') break;
    if (line === '' && lines.length === 0) break;
    lines.push(line);
  }
  return lines.join('\n').trim();
}
