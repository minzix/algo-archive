/**
 * 브라우저에서 레포에 직접 커밋한다.
 *
 * 정적 사이트라 서버가 없다. GitHub API 를 부르려면 신원을 증명해야 하는데
 * 그 수단이 토큰뿐이라 한 번 붙여넣어 localStorage 에 둔다.
 * 이 레포에만 권한이 있는 토큰이라 새어나가도 여기 밖으로는 영향이 없다.
 */
const OWNER = 'minzix';
const REPO = 'algo-archive';
const BRANCH = 'main';
const API = 'https://api.github.com';

const TOKEN_KEY = 'algo-archive:token';

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? '';
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return getToken().length > 0;
}

async function api(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${getToken()}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(describe(res.status, detail.message));
  }
  return res.json();
}

/** GitHub 오류를 사람이 읽을 수 있는 말로 */
function describe(status: number, message?: string): string {
  if (status === 401) return '토큰이 올바르지 않습니다. 설정에서 다시 등록해주세요.';
  if (status === 403) return '토큰에 이 레포 쓰기 권한이 없습니다. Contents 를 Read and write 로 주세요.';
  if (status === 404) return '레포를 찾을 수 없습니다. 토큰이 algo-archive 에 접근할 수 있는지 확인해주세요.';
  if (status === 409) return '누군가 먼저 수정했습니다. 새로고침한 뒤 다시 시도해주세요.';
  return message ? `GitHub 오류 (${status}): ${message}` : `GitHub 오류 (${status})`;
}

/** 토큰이 살아있고 이 레포를 만질 수 있는지 확인한다. */
export async function checkToken(): Promise<{ login: string; canWrite: boolean }> {
  const [user, repo] = await Promise.all([
    api('/user'),
    api(`/repos/${OWNER}/${REPO}`),
  ]);
  return { login: user.login, canWrite: Boolean(repo.permissions?.push) };
}

/** 커밋 시점의 최신 파일을 읽는다. 빌드에 박힌 값은 오래됐을 수 있다. */
export async function readJson<T>(path: string): Promise<T> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`,
    {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );
  if (!res.ok) throw new Error(describe(res.status));
  return res.json() as Promise<T>;
}

export interface FileChange {
  path: string;
  /** 내용. 빈 문자열이면 빈 파일이 된다. */
  content: string;
}

/**
 * 여러 파일을 한 커밋으로 올린다.
 *
 * Contents API 는 파일 하나에 커밋 하나라 JSON 과 Markdown 이 따로 커밋된다.
 * Git Data API 로 트리를 직접 만들면 한 번에 묶여서 이력이 깔끔하다.
 */
export async function commitFiles(files: FileChange[], message: string): Promise<string> {
  const base = `/repos/${OWNER}/${REPO}/git`;

  const ref = await api(`${base}/ref/heads/${BRANCH}`);
  const parent = ref.object.sha;

  const parentCommit = await api(`${base}/commits/${parent}`);

  const tree = await api(`${base}/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: parentCommit.tree.sha,
      tree: files.map((f) => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.content,
      })),
    }),
  });

  const commit = await api(`${base}/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: tree.sha, parents: [parent] }),
  });

  await api(`${base}/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit.sha.slice(0, 7);
}

export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
