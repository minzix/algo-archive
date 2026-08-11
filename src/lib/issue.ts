/**
 * 브라우저에서 바로 쓸 수 있게 Issue Form 링크를 미리 채워준다.
 * 제출하면 Actions 가 데이터에 반영하고 이슈를 닫는다.
 */
const REPO = 'https://github.com/minzix/algo-archive';

function issueUrl(template: string, title: string, fields: Record<string, string>): string {
  const params = new URLSearchParams({ template, title, ...fields });
  return `${REPO}/issues/new?${params}`;
}

/** 오답노트 쓰기 */
export function annotateUrl(problemId: string): string {
  return issueUrl('annotate.yml', `annotate: ${problemId}`, { problem: problemId });
}

/** 복습 결과 기록 */
export function reviewUrl(problemId: string): string {
  return issueUrl('review.yml', `review: ${problemId}`, { problem: problemId });
}

/** 개념 카드 추가 */
export function conceptUrl(problemId?: string): string {
  return issueUrl('concept.yml', 'study: ', problemId ? { problems: problemId } : {});
}
