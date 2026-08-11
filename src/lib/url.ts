/**
 * GitHub Pages 하위 경로(/algo-archive) 위에서 동작하므로
 * 내부 링크는 반드시 base를 붙여야 한다.
 */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** `2026-08-11` → `2026.08.11` */
export function fullDate(date: string | null | undefined): string {
  return date ? date.replaceAll('-', '.') : '—';
}

/** `2026-08-11` → `08.11` */
export function shortDate(date: string | null | undefined): string {
  return date ? date.slice(5).replace('-', '.') : '—';
}
